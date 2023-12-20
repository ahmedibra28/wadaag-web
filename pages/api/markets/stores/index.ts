import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const q = req.query && req.query.q

      let query = Profile.find(
        q
          ? {
              name: { $regex: q, $options: 'i' },
              hasStoreProfile: true,
            }
          : { hasStoreProfile: true }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Profile.countDocuments(
        q
          ? {
              name: { $regex: q, $options: 'i' },
              hasStoreProfile: true,
            }
          : { hasStoreProfile: true }
      )

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .populate('user', 'name email mobile')

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
