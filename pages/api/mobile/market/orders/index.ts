import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Order from '../../../../../models/Order'
import Product from '../../../../../models/Product'
import { initPayment } from '../../../../../utils/waafipay'
import { getToken, sendSMS } from '../../../../../utils/sms'
import MarketUser from '../../../../../models/MarketUser'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const q = req.query && req.query.q

      let query = Order.find(
        q
          ? {
              name: { $regex: q, $options: 'i' },
              quantity: { $gt: 0 },
              status: 'active',
              owner: req.user._id,
            }
          : { quantity: { $gt: 0 }, status: 'active', owner: req.user._id }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Order.countDocuments(
        q ? { name: { $regex: q, $options: 'i' } } : {}
      )

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .populate('product', 'name images quantity')

      let result = await query

      result = await Promise.all(
        result.map(async (obj) => {
          const marketUser = await MarketUser.findOne({ _id: obj.owner })
            .lean()
            .select('name image')

          const customer = await MarketUser.findOne({ user: obj.customer })
            .select('name image')
            .lean()
          return {
            ...obj,
            owner: marketUser,
            customer: {
              _id: obj.customer,
              name: customer?.name,
              image: customer?.image,
            },
          }
        })
      )

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      let { products } = req.body as {
        products: {
          _id: string
          customId?: string
          owner: {
            _id: string
            name: string
            image: string
          }
          name: string
          cost: number
          price: number
          quantity: number
          category: string
          images: string[]
          description: string
          status: string
          createdAt: string
          updatedAt: string
          color: string
          size: string
          variants: { color?: string; size?: string; quantity: number }[]
        }[]
      }

      products = products?.map((obj) => ({
        ...obj,
        customId: `${obj._id}###${obj.color}${obj.size}`,
      }))

      const newProducts = products.reduce((acc: any, obj: any) => {
        const index = acc.findIndex(
          (item: any) => item.customId.toString() === obj.customId.toString()
        )
        if (index !== -1) {
          acc[index].quantity += obj.quantity
        } else {
          acc.push(obj)
        }
        return acc
      }, [])

      const newOrders = await Promise.all(
        newProducts.map(async (obj: any) => {
          const checkProductWithQty = await Product.findOne({
            _id: obj?._id,
          }).lean()

          if (!checkProductWithQty)
            throw new Error(`${obj?.name} is out of stock`)

          if (!obj?.variants || obj?.variants?.length < 1) {
            if (checkProductWithQty?.quantity < obj?.quantity)
              throw new Error(`${obj?.name} is out of stock`)
          } else {
            // check quantity and also check if color and size is available
            const checkVariation = obj?.variants.find(
              (v: any) => v.color === obj?.color && v.size === obj?.size
            )

            if (!checkVariation)
              throw new Error(
                `${obj?.name} with color ${obj?.color} and size ${obj?.size} is out of stock`
              )

            if (checkVariation?.quantity < obj?.quantity)
              throw new Error(
                `${obj?.name} with color ${obj?.color} and size ${obj?.size} is out of stock`
              )
          }

          const newOrder = {
            customer: req.user._id,
            owner: checkProductWithQty.owner,
            product: checkProductWithQty._id,
            name: checkProductWithQty.name,
            cost: checkProductWithQty.cost,
            price: checkProductWithQty.price,
            quantity: Number(obj?.quantity),
            color: obj?.color,
            size: obj?.size,
            variants: obj?.variants,
          }

          return newOrder
        })
      )

      const totalPrice = newOrders.reduce(
        (acc: number, obj: any) =>
          acc + Number(obj.price) * Number(obj.quantity),
        0
      )

      console.log({ totalPrice })

      // Waafi Pay
      const payment = await initPayment({
        amount: totalPrice + 1.5,
        mobile: `${req.body.paymentMobile}`,
      })

      if (payment?.error) return res.status(400).json({ error: payment.error })

      const orders = newOrders.map((obj: any) => ({
        ...obj,
        transactionId: payment.transactionId,
      }))

      const result = await Order.insertMany(orders)

      if (!result)
        return res.status(500).json({ error: 'Error creating order' })

      await Promise.all(
        newOrders.map(async (obj: any) => {
          if (!obj?.variants || obj?.variants?.length < 1) {
            await Product.findOneAndUpdate(
              { _id: obj.product },
              { $inc: { quantity: -obj.quantity } }
            )
          }

          const checkVariation = obj?.variants.find(
            (v: any) => v.color === obj?.color && v.size === obj?.size
          )

          if (checkVariation) {
            await Product.findOneAndUpdate(
              {
                _id: obj?.product,
                variants: {
                  $elemMatch: { color: obj?.color, size: obj?.size },
                },
              },
              {
                $inc: { 'variants.$.quantity': -obj.quantity },
              }
            )
          }

          return obj
        })
      )

      const token = await getToken()
      await sendSMS({
        token: token.access_token,
        mobile: `${req.user.mobile}`,
        message: `Your order has been placed successfully. We will contact you soon.`,
      })

      // notice the system admin about the order
      const adminNotice = {
        token: token.access_token,
        message: `New order has been placed by ${req.user.mobile}`,
      }

      await sendSMS({ ...adminNotice, mobile: '252618237779' })
      await sendSMS({ ...adminNotice, mobile: '252771674395' })

      res.status(200).json(result)
    } catch (error: any) {
      console.log(error?.message)
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
