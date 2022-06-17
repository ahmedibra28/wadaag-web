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
    const ride = await schemaName.findOne({
      _id: req.body._id,
      status: 'pending',
    })

    const user = await User.findById(req.body.riderOneId)

    if (!ride || !user)
      return res.status(400).json({ message: 'Ride not found' })

    const chat = {
      price: Number(ride.distance.split('km')[0]) * 0.5,
      ...req.body,
      createdAt: new Date(),
    }

    return res.status(200).send(chat)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
