import nc from 'next-connect'
import db from '../../../config/db'
// import Profile from '../../../models/Profile'
import Trip from '../../../models/Trip'
import User from '../../../models/User'
import { isAuth } from '../../../utils/auth'
import { subscription, userType } from '../../../utils/subscription'

const schemaName = Trip

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const q = req.query && req.query.q
      const user = await User.findOne({ mobile: q })

      let query = schemaName.find(q ? { rider: user?._id } : {})

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await schemaName.countDocuments(
        q ? { rider: user?._id } : {}
      )

      const completedRide = await schemaName.countDocuments({
        status: 'completed',
      })

      const cancelledRide = await schemaName.countDocuments({
        status: 'cancelled',
      })

      const expiredRide = await schemaName.countDocuments({
        status: 'expired',
      })

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .populate('rider', ['name'])
        .populate('driver', ['name'])

      const result = await query

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
        completedRide,
        cancelledRide,
        expiredRide,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { origin, destination, distance, duration } = req.body
      const { _id: rider, mobile } = req.user

      // return res.status(400).json({ error: 'ok' })

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

      // const profile = await Profile.findOne({ plate: plate?.toUpperCase() })

      // if (!profile)
      //   return res.status(400).json({
      //     error: 'Incorrect plate number with this driver',
      //   })

      const object = await schemaName.create({
        rider,
        origin,
        destination,
        distance,
        duration,
        // driver: profile?.user,
        status: 'pending',
      })
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
