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
    const { _id, riderOne, riderTwo, requestType } = req.body

    // get ride
    const ride = await schemaName.findOne({ _id, status: 'pending' })

    if (!ride) return res.status(400).json({ message: 'Ride not found' })

    if (requestType === 'request') {
      console.log('------------------------')
      const chat = [
        {
          rideId: _id,
          riderOne: riderOne,
          riderTwo: riderTwo,
          requestType: requestType,
          price: Number(ride.distance.split('km')[0]) * 0.5,
        },
      ]

      console.log(chat)

      if (ride.chat.length === 0) {
        ride.chat = chat
        await ride.save()
      }

      return res.status(200).send(ride.chat)
    }

    // // check if accept
    // if (acceptType === 'accept') {
    //   const calculatePriceBasedOnDistance = (distance) => {
    //     const km = Number(distance.split('km')[0])
    //     const price = km * 0.5
    //     return price
    //   }

    //   const chat = [
    //     {
    //       requestedBy: riderTwoId,
    //       name: riderTwoName,
    //       mobile: riderTwoMobile,
    //       status: 'accept',
    //       price: calculatePriceBasedOnDistance(ride.distance),
    //     },
    //   ]

    //   if (ride.chat.length === 1) {
    //     ride.chat = [...ride.chat, ...chat]
    //     await ride.save()
    //   }

    //   return res.status(200).send(ride)
    // }

    res.status(400).json({ message: 'Invalid request' })
    res.send(ride.chat)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
