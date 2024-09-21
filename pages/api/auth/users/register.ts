import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
import axios from 'axios'
import Role from '../../../../models/Role'
import UserRole from '../../../../models/UserRole'
import Transaction from '../../../../models/Transaction'
import moment from 'moment'

const handler = nc()

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
    await db()
    try {
      const { name, plate, license, selected, district, sex } = req.body
      let { mobile } = req.body

      if (!mobile || mobile.length !== 9)
        return res.status(400).json({ error: 'Invalid mobile number' })

      const key = ['61', '77'].includes(mobile.substring(0, 2))
      if (!key) return res.status(400).json({ error: 'Invalid mobile number' })

      mobile = `252${mobile}`

      const user = await User.findOne({
        mobile: Number(mobile),
      })

      if (user) return res.status(400).json({ error: 'Mobile already exists' })

      if (selected === 'driver') {
        const profile = await Profile.findOne({
          plate: plate.toUpperCase(),
        })

        if (profile)
          return res.status(400).json({ error: 'Plate already existed' })
      }

      const userCreated = await User.create({
        name,
        mobile,
        blocked: false,
        confirmed: true,
        platform: 'mobile',
      })

      if (!userCreated)
        return res.status(400).json({ error: 'User not created' })

      userCreated.getRandomOtp()
      await userCreated.save()

      const userRole = await Role.findOne({ type: 'AUTHENTICATED' }, { _id: 1 })

      if (!userRole) return res.status(400).json({ error: 'Role not found' })

      await Profile.create({
        user: userCreated._id,
        name: userCreated.name,
        district,
        sex,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${userCreated.name}&background=random&color=random&size=128`,
        mobile: mobile,
        plate: selected === 'driver' ? plate : undefined,
        license: selected === 'driver' ? license : undefined,
      })

      await UserRole.create({
        user: userCreated._id,
        role: userRole._id,
      })

      const token = await getToken()
      await sendSMS({
        token: token.access_token,
        mobile,
        message: `Your OTP is ${userCreated.otp}`,
      })

      const { otp, ...userData } = userCreated.toObject()
      console.log(userData)
      // if (sms) return res.send(userData)

      // Disable this line for the future update

      // const data = {
      //   mobile,
      //   amount: 2,
      //   paidDate: moment().format(),
      //   expireDate: moment().add(Number(15), 'days').format(),
      // }

      // await Transaction.create(data)

      return res.status(200).send({
        _id: userCreated._id,
        otp,
        mobile: userCreated.mobile,
        name: userCreated.name,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
