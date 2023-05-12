import nc from 'next-connect'
import db from '../../../config/db'
import Notification from '../../../models/Notification'
import { isAuth } from '../../../utils/auth'
import User from '../../../models/User'

const schemaName = Notification

const handler = nc()
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const q = req.query && req.query.q

      let query = schemaName.find(
        q ? { title: { $regex: q, $options: 'i' } } : {}
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await schemaName.countDocuments(
        q ? { title: { $regex: q, $options: 'i' } } : {}
      )

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

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

handler.use(isAuth)
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { token } = req.body

      const object = await User.findById(req.user._id)
      if (!object) return res.status(400).json({ error: `User not found` })

      object.pushToken = token
      object.allowsNotification = Boolean(token)

      await object.save()
      res.status(200).json({ message: `User updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
