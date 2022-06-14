import nc from 'next-connect'
import db from '../../../config/db'
import Ride from '../../../models/Ride'
// import { isAuth } from '../../../utils/auth'
import Cors from 'cors'

const schemaName = Ride

const handler = nc()
handler.use(
  Cors({
    origin: '*',
    credentials: true,
  })
)

handler.post(async (req, res) => {
  await db()
  try {
    const { riderTwoId, riderTwoName, riderTwoMobile, rideId, requestType } =
      req.body

    // get ride
    const ride = await schemaName.findOne({ _id: rideId, status: 'pending' })

    if (!ride) return res.status(400).json({ message: 'Ride not found' })

    // check if request
    if (requestType === 'request') {
      const calculatePriceBasedOnDistance = (distance) => {
        const km = Number(distance.split('km')[0])
        const price = km * 0.5
        return price
      }

      const chat = [
        {
          requestedBy: riderTwoId,
          name: riderTwoName,
          mobile: riderTwoMobile,
          status: 'request',
          price: calculatePriceBasedOnDistance(ride.distance),
        },
      ]

      if (ride.chat.length === 0) {
        ride.chat = [...ride.chat, ...chat]
        await ride.save()
      }

      return res.status(200).send(ride)
    }

    res.send(ride)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
