import nc from 'next-connect'
import Order from '../../../../models/Order'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Product from '../../../../models/Product'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const object = await Order.findById(id)
        .populate('owner', 'name email mobile')
        .populate('customer', 'name email mobile')
        .populate('product', 'images quantity')
      if (!object) return res.status(400).json({ error: `Order not found` })

      res.status(200).json(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const object = await Order.findById(id)
      if (!object) return res.status(400).json({ error: `Order not found` })

      await Order.findByIdAndDelete(id)

      await Product.findOneAndUpdate(
        { _id: object.product },
        { $inc: { quantity: object.quantity } }
      )

      res.status(200).json({ message: `Order removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
