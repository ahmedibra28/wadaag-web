import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
// import { isAuth } from '../../../../utils/auth'

const schemaName = User

import Cors from 'cors'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
  })
)
// handler.use(isAuth)

handler.post(async (req, res) => {
  await db()
  try {
    const { name, plate, license, selected } = req.body
    let mobile = req.body.mobile

    if (!mobile || mobile.toString().length !== 9)
      return res.status(400).json({ error: 'Invalid mobile number' })

    if (mobile.toString().substring(0, 2) !== '61')
      return res.status(400).json({ error: 'Invalid mobile number' })

    mobile = `252${mobile}`

    const user = await schemaName.findOne({
      mobileNumber: mobile,
    })

    if (user) return res.status(400).json({ error: 'User already exists' })

    const object = await schemaName.create({
      name,
      mobileNumber: mobile,
      blocked: false,
      isActive: true,
    })

    if (!object) return res.status(400).json({ error: 'User not created' })

    await Profile.create({
      user: object._id,
      name: object.name,
      image: `https://ui-avatars.com/api/?uppercase=true&name=${object.name}&background=random&color=random&size=128`,
      isRider: selected === 'rider' ? true : false,
      profileCompleted: false,
      plate,
      license,
      level: 0,
      points: 0,
    })

    object.getRandomOtp()

    await object.save()

    // const sms = await sendSMS(
    //   token.access_token,
    //   req.body.mobile,
    //   `Your OTP is ${object.otp}`
    // )
    // if (sms)
    return res.status(200).send(object)

    res.status(200).send(object)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
