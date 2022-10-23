import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import Ride from '../../../models/Ride'
import { isAuth } from '../../../utils/auth'

const schemaName = Ride

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()

  try {
    const { _id } = req.user

    const isDriver = await Profile.findOne({ user: _id, userType: 'driver' })

    if (!isDriver) return res.status(400).json({ error: 'You are not driver' })

    const plates = await schemaName
      .find({ plate: isDriver.plate, status: 'completed' })
      .lean()

    return res.status(200).send(plates)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
