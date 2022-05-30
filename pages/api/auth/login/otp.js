import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import Profile from '../../../../models/Profile'
import { generateToken } from '../../../../utils/auth'
import UserRole from '../../../../models/UserRole'
import Role from '../../../../models/Role'

const schemaName = User

const handler = nc()

handler.post(async (req, res) => {
  await db()
  try {
    const { otp, userId } = req.body

    if (!otp) return res.status(400).json({ error: 'Please enter your OTP' })
    if (!userId) return res.status(400).json({ error: 'User not found' })

    const object = await schemaName.findOne({
      _id: userId,
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

    // create user profile
    const profile = await Profile.findOne({ user: object._id })

    if (!profile) {
      await Profile.create({
        user: object._id,
        name: 'John Doe',
        isRider: true,
        image: `https://ui-avatars.com/api/?uppercase=true&name=wadaag&background=random&color=random&size=128`,
        approved: false,
        profileCompleted: false,
      })
    }

    const role = await Role.findOne({ type: 'AUTHENTICATED' }).lean()
    if (role) {
      const userRole = await UserRole.findOne({ user: object._id })
      if (!userRole) {
        await UserRole.create({ user: object._id, role: role._id })
      }
    }

    res.status(200).send({
      _id: object._id,
      name: object.name || 'John Doe',
      token: generateToken(object._id),
      mobileNumber: object.mobileNumber,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
