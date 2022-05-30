import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import Ride from '../../../models/Ride'
import { isAuth } from '../../../utils/auth'

const schemaName = Ride

const handler = nc()
handler.use(isAuth)
handler.post(async (req, res) => {
  await db()

  try {
    const { originLatLng, destinationLatLng } = req.body
    const { _id } = req.user

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
          from: near.from,
          to: near.to,
          createdAt: near.createdAt,
        }
      })
    )

    const objects = await results

    return res.status(200).send(objects)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

export default handler
