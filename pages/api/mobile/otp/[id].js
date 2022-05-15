import nc from 'next-connect'
import db from '../../../../config/db'
import MobileUser from '../../../../models/MobileUser'
import MobileProfile from '../../../../models/MobileProfile'
import { generateToken } from '../../../../utils/auth'
import UserRole from '../../../../models/UserRole'
import Role from '../../../../models/Role'

const schemaName = MobileUser

const handler = nc()

handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const { otp } = req.body

    if (!otp) return res.status(400).json({ error: 'Please enter your OTP' })

    const object = await schemaName.findOne({
      _id: id,
      otp,
      otpExpire: { $gt: Date.now() },
    })
    if (!object)
      return res.status(400).json({ error: `Invalid OTP or expired` })

    object.otp = undefined
    object.otpExpire = undefined

    await object.save()

    // create user profile
    const profile = await MobileProfile.findOne({ user: object._id })
    if (!profile) {
      await MobileProfile.create({
        user: object._id,
        type: 'rider',
        image: `https://ui-avatars.com/api/?uppercase=true&name=wadaag&background=random&color=random&size=128`,
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
      token: generateToken(object._id),
      mobile: object.mobile,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
