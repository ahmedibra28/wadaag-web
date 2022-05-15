import nc from 'next-connect'
import db from '../../../../config/db'
import MobileUser from '../../../../models/MobileUser'

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

    res.status(200).json({ message: 'OTP has been confirmed' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
