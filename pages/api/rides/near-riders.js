import nc from 'next-connect'
import db from '../../../config/db'
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
            Number(ride.riderOne.originLatLng.split(',')[0]) -
              Number(originLatLng.split(',')[0])
          ) < 0.005 &&
          Math.abs(
            Number(ride.riderOne.originLatLng.split(',')[1]) -
              Number(originLatLng.split(',')[1])
          ) < 0.005
      )

    const nearDestination =
      nearOrigin.length > 0 &&
      nearOrigin.filter(
        (ride) =>
          Math.abs(
            Number(ride.riderOne.destinationLatLng.split(',')[0]) -
              Number(destinationLatLng.split(',')[0])
          ) < 0.005 &&
          Math.abs(
            Number(ride.riderOne.destinationLatLng.split(',')[1]) -
              Number(destinationLatLng.split(',')[1])
          ) < 0.005
      )

    console.log(nearDestination)

    return res.status(200).send(nearDestination)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

export default handler
