import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
import { isAuth } from '../../../../utils/auth'

const schemaName = User

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const q = req.query && req.query.q

      let query = schemaName.find(
        q ? { email: { $regex: q, $options: 'i' } } : {}
      )

      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.limit as string) || 25
      const skip = (page - 1) * pageSize
      const total = await schemaName.countDocuments(
        q ? { email: { $regex: q, $options: 'i' } } : {}
      )

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .select('-password -otp -otpExpire')
        .lean()

      const result = await query

      const getUsersDistrictAndSex = Promise.all(
        result.map(async (user: any) => {
          const profile = await Profile.findOne({
            user: user._id,
          })
            .select('district sex')
            .lean()
          return { ...user, district: profile?.district, sex: profile?.sex }
        })
      )

      const profiles = await getUsersDistrictAndSex

      const deletedUsers = await schemaName.countDocuments({
        status: 'deleted',
      })
      const activeUsers = await schemaName.countDocuments({
        status: 'active',
      })

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + profiles.length,
        count: profiles.length,
        page,
        pages,
        total,
        data: profiles,
        deletedUsers,
        activeUsers,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const user = await User.findOne({
        email: req.body?.email?.toLowerCase(),
      })

      if (user) return res.status(400).json({ error: 'Email already exists' })

      const object = await schemaName.create({
        platform: 'web',
        ...req.body,
      })

      await Profile.create({
        user: object._id,
        name: object.name,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${object.name}&background=random&color=random&size=128`,
        bio: '',
        address: '',
      })

      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
