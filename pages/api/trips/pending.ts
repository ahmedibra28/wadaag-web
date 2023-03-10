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

      await schemaName.deleteMany({
        status: 'pending',
        createdAt: { $lte: new Date(Date.now() - 120 * 60 * 1000) },
      })

      const trip = await schemaName
        .findOne({
          status: 'pending',
          rider: _id,
        })
        .lean()

      return res.status(200).send(trip)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
