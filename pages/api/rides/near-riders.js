import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import Ride from '../../../models/Ride'
import { isAuth } from '../../../utils/auth'
import Cors from 'cors'
import { subscription, userType } from '../../../utils/subscription'

const schemaName = Ride

const handler = nc()
handler.use(
  Cors({
    origin: '*',
    credentials: true,
  })
)

handler.use(isAuth)
handler.post(async (req, res) => {
  await db()

  try {
    const { originLatLng, destinationLatLng } = req.body
    const { _id, mobileNumber } = req.user

    // if ((await subscription(mobileNumber)) === 0)
    //   return res.status(400).json({ error: 'Subscription expired' })

    if (!(await userType(mobileNumber)))
      return res.status(400).json({ error: 'User type not allowed' })

    const rides = await schemaName
      .find({
        status: 'pending',
        _id: { $ne: _id },
      })
      .lean()

    const nearOrigin =
      rides.length > 0 &&
      rides.filter(
        (ride) =>
          Math.abs(
            Number(ride.originLatLng.split(',')[0]) -
              Number(originLatLng.split(',')[0])
          ) < 0.005 &&
          Math.abs(
            Number(ride.originLatLng.split(',')[1]) -
              Number(originLatLng.split(',')[1])
          ) < 0.005
      )

    const nearDestination =
      nearOrigin.length > 0 &&
      nearOrigin.filter(
        (ride) =>
          Math.abs(
            Number(ride.destinationLatLng.split(',')[0]) -
              Number(destinationLatLng.split(',')[0])
          ) < 0.005 &&
          Math.abs(
            Number(ride.destinationLatLng.split(',')[1]) -
              Number(destinationLatLng.split(',')[1])
          ) < 0.005
      )

    if (!nearDestination)
      return res.status(400).json({ error: 'No riders found at your location' })

    const results = Promise.all(
      nearDestination.map(async (near) => {
        const profile = await Profile.findOne({
          user: near.rider,
        })
          .lean()
          .populate('user', ['name', 'mobileNumber'])

        return {
          _id: near._id,
          rider: near.rider,
          name: profile?.name || 'unknown',
          mobileNumber: profile?.user?.mobileNumber,
          image: profile?.image,
          origin: near.origin,
          destination: near.destination,
          createdAt: near.createdAt,
          duration: near.duration,
        }
      })
    )

    const objects = await results

    if (objects.length === 0)
      return res.status(400).json({ error: 'No riders found at your location' })

    return res.status(200).send(objects)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

export default handler
