import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import UserRole from '../../../../models/UserRole'
import User from '../../../../models/User'
import axios from 'axios'
// import { isAuth } from '../../../../utils/auth'

const schemaName = User

import Cors from 'cors'
import Role from '../../../../models/Role'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
  })
)
// handler.use(isAuth)

const { MY_SMS_BASE_URL, MY_SMS_API_KEY, MY_SMS_USERNAME } = process.env
const username = MY_SMS_USERNAME
const password = MY_SMS_API_KEY
const grant_type = 'password'
const tokenURL = `${MY_SMS_BASE_URL}/token`
const sendSMS_URL = `${MY_SMS_BASE_URL}/api/SendSMS`

// get access token
const getToken = async () => {
  const { data } = await axios.post(
    tokenURL,
    `username=${username}&password=${password}&grant_type=${grant_type}`
  )
  return data
}

// send SMS
const sendSMS = async (token, mobile, message) => {
  const { data } = await axios.post(
    sendSMS_URL,
    { mobile, message },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return data
}

handler.post(async (req, res) => {
  await db()
  try {
    const { name, plate, license, selected } = req.body
    let mobile = req.body.mobileNumber

    if (!mobile || mobile.toString().length !== 9)
      return res.status(400).json({ error: 'Invalid mobile number' })

    if (mobile.toString().substring(0, 2) !== '61')
      return res.status(400).json({ error: 'Invalid mobile number' })

    mobile = `252${mobile}`

    const user = await schemaName.findOne({
      mobileNumber: mobile,
    })

    if (user) return res.status(400).json({ error: 'User already exists' })

    if (selected === 'driver') {
      const prof = await Profile.findOne({
        plate: plate.toUpperCase(),
      })

      if (prof) return res.status(400).json({ error: 'Plate already existed' })
    }

    const object = await schemaName.create({
      name,
      mobileNumber: mobile,
      blocked: false,
      isActive: true,
    })

    if (!object) return res.status(400).json({ error: 'User not created' })

    const userRole = await Role.findOne(
      selected === 'driver' ? { type: 'DRIVER' } : { type: 'RIDER' },
      { _id: 1 }
    )

    if (!userRole) return res.status(400).json({ error: 'Role not found' })

    await Profile.create({
      user: object._id,
      name: object.name,
      image: `https://ui-avatars.com/api/?uppercase=true&name=${object.name}&background=random&color=random&size=128`,
      userType: selected,
      plate: selected === 'driver' ? plate : mobile,
      license: selected === 'driver' ? license : undefined,
      level: 0,
      points: 0,
    })

    await UserRole.create({
      user: object._id,
      role: userRole._id,
    })

    const token = await getToken()

    object.getRandomOtp()

    await object.save()
    // const sms = await sendSMS(
    //   token.access_token,
    //   req.body.mobileNumber,
    //   `Your OTP is ${object.otp}`
    // )

    // const { otp, ...userData } = object.toObject()

    // if (sms) return res.status(200).send(userData)

    return res.status(200).send({
      otp: object.otp,
      mobileNumber: object.mobileNumber,
      name: object.name,
      _id: object._id,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
