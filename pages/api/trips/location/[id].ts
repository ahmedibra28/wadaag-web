import nc from 'next-connect'
import db from '../../../../config/db'
import Trip from '../../../../models/Trip'
import { isAuth } from '../../../../utils/auth'

const schemaName = Trip
const schemaNameString = 'Trip'

const handler = nc()
handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const currentLocation = req.body

      const trip = await schemaName.findOne({ _id: id, status: 'pending' })

      if (trip) {
        trip.currentLocation = currentLocation
        await trip.save()
      }

      res.status(200).json({ message: `${schemaNameString} has been updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
