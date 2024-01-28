import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Order from '../../../../../models/Order'
import Profile from '../../../../../models/Profile'
import Product from '../../../../../models/Product'

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
          const profile = await Profile.findOne({ user: obj.owner })
            .lean()
            .select('name image')

          const customer = await Profile.findOne({ user: obj.customer })
            .lean()
            .select('name image')
          return {
            ...obj,
            owner: {
              _id: obj.owner,
              name: profile?.name,
              image: profile?.image,
            },
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
      const { products } = req.body

      const newProducts = products.reduce((acc: any, obj: any) => {
        const index = acc.findIndex(
          (item: any) => item.product.toString() === obj.product.toString()
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
            _id: obj?.product,
            quantity: { $gte: Number(obj?.quantity) },
          }).lean()

          if (!checkProductWithQty)
            throw new Error(`${obj?.name} is out of stock`)

          const newOrder = {
            customer: req.user._id,
            owner: checkProductWithQty.owner,
            product: checkProductWithQty._id,
            name: checkProductWithQty.name,
            cost: checkProductWithQty.cost,
            price: checkProductWithQty.price,
            quantity: Number(obj?.quantity),
          }

          return newOrder
        })
      )

      const totalPrice = newOrders.reduce(
        (acc: number, obj: any) =>
          acc + Number(obj.price) * Number(obj.quantity),
        0
      )

      // payment goes here
      console.log({ totalPrice })

      const result = await Order.insertMany(newOrders)

      if (!result)
        return res.status(500).json({ error: 'Error creating order' })

      await Promise.all(
        result.map(async (obj: any) => {
          await Product.findOneAndUpdate(
            { _id: obj.product },
            { $inc: { quantity: -obj.quantity } }
          )
        })
      )

      res.status(200).json(result)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler