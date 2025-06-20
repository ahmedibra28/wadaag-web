import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../utils/auth'
import Profile from '../../../../models/Profile'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()
      const { otp, _id } = req.body

      if (!otp) return res.status(400).json({ error: 'Please enter your OTP' })

      const user = await User.findOne({
        _id,
        otpExpire: { $gt: Date.now() },
        platform: 'mobile',
      })

      if (!user)
        return res.status(400).json({ error: `Invalid OTP or expired` })

      if (![252615301507, 252618237779, 252610937744].includes(user.mobile)) {
        if (!user.otp || user.otp !== otp) {
          return res.status(400).json({ error: `Invalid OTP or expired` })
        }
      }

      if (!user.confirmed)
        return res.status(400).json({ error: `User is not active` })

      if (user.blocked)
        return res.status(400).json({ error: `User is blocked` })

      user.otp = undefined
      user.otpExpire = undefined

      await user.save()

      const profile = await Profile.findOne({ user: user._id })

      res.status(200).send({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        avatar: profile.image,
        role: 'AUTHENTICATED',
        token: generateToken(user._id),
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
