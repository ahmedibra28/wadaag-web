import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Order from '../../../../models/Order'

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
              $or: [
                {
                  name: { $regex: q, $options: 'i' },
                },
                {
                  'owner.name': { $regex: q, $options: 'i' },
                },
                {
                  'customer.name': { $regex: q, $options: 'i' },
                },
              ],
            }
          : {}
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Order.countDocuments(
        q
          ? {
              $or: [
                {
                  name: { $regex: q, $options: 'i' },
                },
                {
                  'owner.name': { $regex: q, $options: 'i' },
                },
                {
                  'customer.name': { $regex: q, $options: 'i' },
                },
              ],
            }
          : {}
      )

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .populate('owner', 'name email mobile')
        .populate('customer', 'name email mobile')
        .populate('product', 'images quantity category')

      const result = await query

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

export default handler
