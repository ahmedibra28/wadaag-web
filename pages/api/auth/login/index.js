import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'

const handler = nc()

const schemaName = User

handler.post(async (req, res) => {
  await db()
  try {
    let mobileNumber = req.body.mobileNumber
      ? Number(req.body.mobileNumber)
      : ''

    if (!mobileNumber || mobileNumber.toString().length !== 9)
      return res.status(400).json({ error: 'Invalid mobile number' })

    mobileNumber = `252${mobileNumber}`

    const user = await schemaName.findOne({ mobileNumber })

    if (user && user.blocked)
      return res.status(401).json({ error: 'User is blocked' })

    if (!user) {
      const object = await schemaName.create({ mobileNumber })

      object.getRandomOtp()
      await object.save()
      return res.status(200).send(object)
    }

    user.getRandomOtp()
    await user.save()

    res.status(200).send(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
