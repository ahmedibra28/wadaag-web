import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import { isAuth } from '../../../utils/auth'
import Cors from 'cors'
import User from '../../../models/User'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
    credentials: true,
  })
)

const schemaName = Profile

handler.use(isAuth)

handler.post(async (req, res) => {
  await db()
  try {
    const { plate } = req.body

    const profile = await schemaName.findOne({
      plate: plate.toUpperCase(),
      userType: 'driver',
    })

    if (!profile) return res.status(400).json({ error: 'Driver not found' })

    const user = await User.findOne({ _id: profile.user }, { mobileNumber: 1 })

    res.status(200).send(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
