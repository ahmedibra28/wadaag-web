import nc from 'next-connect'
import db from '../../../../config/db'
import Trip from '../../../../models/Trip'
import { isAuth } from '../../../../utils/auth'

const schemaName = Trip
const schemaNameString = 'Trip'

const handler = nc()
handler.use(isAuth)
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { riderTwo, origin, riderOne } = req.body

      const object = await schemaName.findOne({
        rider: riderOne,
        status: 'pending',
        riderTwo: { $exists: false },
      })

      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.riderTwo = riderTwo
      object.initialOrigin = origin
      object.dealt = true
      await object.save()

      res
        .status(200)
        .json({ message: `${schemaNameString} has just started successfully` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
