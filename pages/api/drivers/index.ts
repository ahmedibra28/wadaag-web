import nc from 'next-connect'
import db from '../../../config/db'
import Trip from '../../../models/Trip'
import { isAuth } from '../../../utils/auth'

const schemaName = Trip

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.user

      const trips = await schemaName
        .find({ driver: _id })
        .lean()
        .sort({ createdAt: -1 })
        .limit(20)

      return res.status(200).json(trips)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
