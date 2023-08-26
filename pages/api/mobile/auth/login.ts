import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import axios from 'axios'

const handler = nc()

const { MY_SMS_BASE_URL, MY_SMS_API_KEY, MY_SMS_USERNAME } = process.env
const username = MY_SMS_USERNAME
const password = MY_SMS_API_KEY
const grant_type = 'password'
const tokenURL = `${MY_SMS_BASE_URL}/token`
const sendSMS_URL = `${MY_SMS_BASE_URL}/api/SendSMS`

// // get access token
const getToken = async () => {
  const { data } = await axios.post(
    tokenURL,
    `username=${username}&password=${password}&grant_type=${grant_type}`
  )
  return data
}

// // send SMS
const sendSMS = async ({
  token,
  mobile,
  message,
}: {
  token: string
  mobile: string
  message: string
}) => {
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

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()
      let { mobile } = req.body

      if (!mobile || mobile.length !== 9)
        return res.status(400).json({ error: 'Invalid mobile number' })

      const key = mobile.substring(0, 2)
      if (key !== '61' || key !== '77')
        return res.status(400).json({ error: 'Invalid mobile number' })

      mobile = `252${mobile}`

      const user = await User.findOne({ mobile, platform: 'mobile' })

      if (!user) return res.status(404).json({ error: 'User not found' })

      if (user.blocked)
        return res.status(401).send({ error: 'User is blocked' })

      if (!user.confirmed)
        return res.status(401).send({ error: 'User is not confirmed' })

      user.getRandomOtp()
      await user.save()

      if (user.mobile === 252615301507)
        return res.json({
          _id: user._id,
          otp: 1234,
          mobile: user.mobile,
          name: user.name,
        })

      const token = await getToken()
      const sms = await sendSMS({
        token: token.access_token,
        mobile,
        message: `Your OTP is ${user.otp}`,
      })

      const { otp, ...userData } = user.toObject()
      if (sms) return res.send(userData)

      return res.status(200).send({
        _id: user._id,
        otp,
        mobile: user.mobile,
        name: user.name,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
