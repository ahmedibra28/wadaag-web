import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Order from '../../../../../models/Order'
import Profile from '../../../../../models/Profile'

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
            }
          : { quantity: { $gt: 0 }, status: 'active' }
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
        .populate('product')

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

export default handler
