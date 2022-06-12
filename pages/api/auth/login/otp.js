import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import Profile from '../../../../models/Profile'
import { generateToken } from '../../../../utils/auth'
import UserRole from '../../../../models/UserRole'
import Role from '../../../../models/Role'

const schemaName = User

import Cors from 'cors'
import Payment from '../../../../models/Payment'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
  })
)

handler.post(async (req, res) => {
  await db()
  try {
    const { otp } = req.body

    if (!otp) return res.status(400).json({ error: 'Please enter your OTP' })
    // if (!userId) return res.status(400).json({ error: 'User not found' })

    const object = await schemaName.findOne({
      // _id: userId,
      otp,
      otpExpire: { $gt: Date.now() },
    })
    if (!object)
      return res.status(400).json({ error: `Invalid OTP or expired` })

    if (!object.isActive)
      return res.status(400).json({ error: `User is not active` })

    if (object.blocked)
      return res.status(400).json({ error: `User is blocked` })

    object.otp = undefined
    object.otpExpire = undefined

    await object.save()

    const profile = await Profile.findOne({ user: object._id })

    const role = await Role.findOne({ type: 'AUTHENTICATED' }).lean()
    if (role) {
      const userRole = await UserRole.findOne({ user: object._id })
      if (!userRole) {
        await UserRole.create({ user: object._id, role: role._id })
      }
    }

    const payments = await Payment.find({
      mobileNumber: object.mobileNumber,
    })

    const expirationDays = payments
      .map((payment) => {
        const date = new Date(payment.date)
        const now = new Date()
        const diff = now - date
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        return days < 31 && 31 - days
      })
      ?.reduce((a, b) => a + b, 0)

    res.status(200).send({
      _id: object._id,
      name: object.name,
      avatar: profile.image,
      userType: profile.userType,
      points: Number(profile.points),
      expiration: Number(expirationDays),
      level: Number(profile.level),
      isAuth: true,
      token: generateToken(object._id),
      mobile: Number(object.mobileNumber),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
