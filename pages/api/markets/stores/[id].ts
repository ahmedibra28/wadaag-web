import nc from 'next-connect'
import Order from '../../../../models/Order'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import MarketUser from '../../../../models/MarketUser'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id, q } = req.query

      let query = Order.find(
        q
          ? {
              name: { $regex: q, $options: 'i' },
              owner: id,
            }
          : { owner: id }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Order.countDocuments(
        q
          ? {
              name: { $regex: q, $options: 'i' },
              owner: id,
            }
          : { owner: id }
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

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      console.log(id)
      const market = await MarketUser.findById(id)
      if (!market) {
        return res.status(404).json({ error: 'Market not found' })
      }
      const store = await MarketUser.findByIdAndUpdate(id, {
        isApproved: !market.isApproved,
      })

      res.status(200).json(store)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
