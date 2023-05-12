import nc from 'next-connect'
import db from '../../../../config/db'
import Trip from '../../../../models/Trip'
import { isAuth } from '../../../../utils/auth'
import { subscription, userType } from '../../../../utils/subscription'

const schemaName = Trip

const handler = nc()
handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { origin, destination, distance, duration } = req.body
      const { _id: rider, mobile } = req.user

      const subscriptionRemainingDays = await subscription(mobile as number)

      if (subscriptionRemainingDays <= 0)
        return res.status(400).json({ error: 'Subscription expired' })

      const isRider = await userType(mobile as number)

      if (isRider !== 'RIDER')
        return res.status(400).json({ error: 'You are not a rider' })

      const isRiderPending = await schemaName.findOne({
        status: 'pending',
        rider,
      })
      if (isRiderPending)
        return res.status(400).json({ error: 'You have a uncompleted trip' })

      const object = await schemaName.create({
        rider,
        origin,
        destination,
        distance,
        duration,
        status: 'pending',
      })
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
