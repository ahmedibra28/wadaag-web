import nc from 'next-connect'
import MarketUser from '../../../../../models/MarketUser'
import db from '../../../../../config/db'
import { isAuth } from '../../../../../utils/auth'
import Order from '../../../../../models/Order'
import Product, { IProduct } from '../../../../../models/Product'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.user
      const object = await MarketUser.findOne({ user: _id }).lean()

      if (!object) return res.json(null)

      // get total amount of today's orders
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const orders = await Order.find({
        owner: object?._id,
        createdAt: { $gte: yesterday, $lte: today },
      }).lean()

      const totalAmount = orders?.map((order) => order.price * order.quantity)

      // count all products belong this current user
      const products = (await Product.find({
        owner: object?._id,
      }).lean()) as IProduct[]

      let totalQuantity = 0
      products?.forEach((product) => {
        if (product.variants?.length > 0) {
          product.variants.forEach((variant) => {
            totalQuantity += variant.quantity || 0
          })
        } else {
          totalQuantity += product.quantity || 0
        }
      })

      res.status(200).send({
        ...object,
        totalAmount: totalAmount?.reduce((acc, curr) => acc + curr, 0),
        totalQuantity,
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
      const { _id } = req.user
      const { name, image, mobile, type, district } = req.body

      if (!['individual', 'company'].includes(type))
        return res
          .status(400)
          .json({ error: 'Invalid type, must be individual or company' })

      const object = await MarketUser.findOne({ user: _id })
      if (object)
        return res
          .status(400)
          .json({ error: `You already have a store profile` })

      const data = {
        user: _id,
        name,
        image,
        mobile,
        type,
        district,
        isApproved: false,
      }

      const obj = await MarketUser.create(data)

      if (!obj)
        return res.status(400).json({ error: 'Store profile not created.' })

      res.send(object)
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
