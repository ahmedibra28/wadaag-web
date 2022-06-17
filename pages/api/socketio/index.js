import nc from 'next-connect'
import db from '../../../config/db'
import Ride from '../../../models/Ride'
import User from '../../../models/User'
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
    const {
      _id,
      riderOne,
      riderTwo,
      requestType,
      riderTwoName,
      riderTwoMobile,
    } = req.body

    const ride = await schemaName.findOne({ _id, status: 'pending' })

    const user = await User.findById(riderOne)

    if (!ride || !user)
      return res.status(400).json({ message: 'Ride not found' })

    if (requestType === 'request') {
      const chat = {
        rideId: _id,
        requestType: requestType,
        price: Number(ride.distance.split('km')[0]) * 0.5,
        riderOne: riderOne,
        riderOneName: user.name,
        riderOneMobile: user.mobileNumber,
        riderTwo: riderTwo,
        riderTwoName: riderTwoName,
        riderTwoMobile: riderTwoMobile,
      }

      return res.status(200).send(chat)
    }

    res.status(400).json({ message: 'Invalid Type' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
