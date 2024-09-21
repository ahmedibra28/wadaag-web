import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import User from '../../../models/User'
import UserRole from '../../../models/UserRole'
import { isAuth } from '../../../utils/auth'
import { initPayment } from '../../../utils/waafipay'
import moment from 'moment'
import Transaction from '../../../models/Transaction'

const schemaName = Profile
const schemaNameString = 'Profile'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.user
      const objects = await schemaName
        .findOne({ user: _id })
        .lean()
        .sort({ createdAt: -1 })
        .populate('user', ['name', 'email', 'confirmed', 'blocked'])

      const userRole = await UserRole.findOne({ user: _id }).populate('role', [
        'type',
      ])
      res.status(200).send({ ...objects, role: userRole.role.type })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.user
      const {
        name,
        address,
        mobile,
        contact,
        contact2,
        bio,
        image,
        password,
        district,
        type,
        company,
        license,
        sex,
        hasRentalProfile,
        hasStoreProfile,
        email,
      } = req.body

      if (type && !['INDIVIDUAL', 'COMPANY'].includes(type))
        return res
          .status(400)
          .json({ error: 'Invalid type, must be INDIVIDUAL or COMPANY' })

      if (sex && !['Male', 'Female'].includes(sex))
        return res
          .status(400)
          .json({ error: 'Invalid sex, must be Male or Female' })

      const object = await schemaName.findOne({ user: _id }).populate('user')
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      if (name) await User.findOneAndUpdate({ _id }, { name })
      if (password) {
        const regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!regex.test(password))
          return res.status(400).json({
            error:
              'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character',
          })

        await User.findOneAndUpdate(
          { _id },
          { password: await object.user.encryptPassword(password) }
        )
      }

      if (!object?.hasRentalProfile && hasRentalProfile) {
        let payment
        // Waafi Pay
        if (process.env.NODE_ENV === 'production') {
          payment = await initPayment({
            amount: 6,
            mobile: `${req.user?.mobile}`,
          })
        } else {
          payment = {
            transactionId: '1234567890',
          }
        }

        if (payment?.error)
          return res.status(400).json({ error: payment.error })

        const data = {
          mobile: req.user?.mobile,
          amount: 6,
          paidDate: moment().format(),
          expireDate: moment().add(30, 'days').format(),
          type: 'rent',
          transactionId: payment?.transactionId,
        }

        const obj = await Transaction.create(data)
        if (!obj)
          return res
            .status(400)
            .json({ error: 'No transaction has been created.' })
      }

      object.name = name ? name : object.name
      object.mobile = mobile ? mobile : object.mobile
      object.contact = contact ? contact : object.contact
      object.contact2 = contact2 ? contact2 : object.contact2
      object.address = address ? address : object.address
      object.district = district ? district : object.district
      object.image = image ? image : object.image
      object.bio = bio ? bio : object.bio
      object.type = type ? type : object.type
      object.company = company ? company : object.company
      object.license = license ? license : object.license
      object.sex = sex ? sex : object.sex
      object.hasRentalProfile = hasRentalProfile
        ? hasRentalProfile
        : object.hasRentalProfile
      object.hasStoreProfile = hasStoreProfile
        ? hasStoreProfile
        : object.hasStoreProfile
      object.email = email ? email : object.email
      object.user = _id
      await object.save()

      res.send(object)
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
