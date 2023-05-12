import nc from 'next-connect'
import db from '../../../../config/db'
import Trip from '../../../../models/Trip'
import { isAuth } from '../../../../utils/auth'
import Profile from '../../../../models/Profile'

const schemaName = Trip

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.user

      await schemaName.updateMany(
        {
          status: 'pending',
          createdAt: { $lte: new Date(Date.now() - 120 * 60 * 1000) },
        },
        {
          $set: { status: 'expired' },
        }
      )

      let trip = await schemaName
        .findOne({
          status: 'pending',
          $or: [{ rider: _id }, { riderTwo: _id }],
        })
        .lean()

      if (!trip) return res.status(200).send(trip)
      if (!trip.riderTwo) return res.status(200).send(trip)

      const profile1 = await Profile.findOne({ user: trip.rider })
        .select('mobile image name')
        .lean()

      const profile2 = await Profile.findOne({ user: trip?.riderTwo })
        .select('mobile image name')
        .lean()

      trip = {
        ...trip,
        riderOneInfo: profile1,
        riderTwoInfo: profile2,
      }

      return res.status(200).send(trip)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
