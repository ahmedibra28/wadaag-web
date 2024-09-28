import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import User from '../../../models/User'
import UserRole from '../../../models/UserRole'
import { isAuth } from '../../../utils/auth'

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
        bio,
        image,
        password,
        district,
        sex,
        email,
      } = req.body

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

      object.name = name ? name : object.name
      object.mobile = mobile ? mobile : object.mobile
      object.address = address ? address : object.address
      object.district = district ? district : object.district
      object.image = image ? image : object.image
      object.bio = bio ? bio : object.bio
      object.sex = sex ? sex : object.sex
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
