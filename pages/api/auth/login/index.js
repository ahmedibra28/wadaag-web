import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import axios from 'axios'
import Cors from 'cors'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
  })
)

const schemaName = User

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
    let mobileNumber = req.body.mobileNumber
      ? Number(req.body.mobileNumber)
      : ''

    if (!mobileNumber || mobileNumber.toString().length !== 9)
      return res.status(400).json({ error: 'Invalid mobile number' })

    if (mobileNumber.toString().substring(0, 2) !== '61')
      return res.status(400).json({ error: 'Invalid mobile number' })

    mobileNumber = `252${mobileNumber}`

    const user = await schemaName.findOne({ mobileNumber })

    if (user && user.blocked)
      return res.status(401).json({ error: 'User is blocked' })

    if (user && !user.isActive)
      return res.status(401).json({ error: 'User is not active' })

    const token = await getToken()

    if (!user) return res.status(401).json({ error: 'User not found' })

    user.getRandomOtp()

    await user.save()

    // const sms = await sendSMS(
    //   token.access_token,
    //   req.body.mobileNumber,
    //   `Your OTP is ${user.otp}`
    // )
    // if (sms)
    return res.status(200).send(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
