import nc from 'next-connect'
import db from '../../../config/db'
import Chat from '../../../models/Chat'
import Profile from '../../../models/Profile'
import { isAuth } from '../../../utils/auth'

const schemaName = Chat

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const { _id } = req.user

    let query = schemaName.find({ users: { $all: [_id] } })

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 25
    const skip = (page - 1) * pageSize
    const total = await schemaName.countDocuments({ users: { $all: [_id] } })

    const pages = Math.ceil(total / pageSize)

    query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

    const result = await query

    const results = result.map((r) => ({
      _id: r._id,
      user: r.users.find((u) => u.toString() !== _id.toString()),
      updatedAt: r.updatedAt,
    }))

    const data = Promise.all(
      results.map(async (r) => {
        const profile = await Profile.findOne(
          {
            user: r.user,
          },
          { image: 1, name: 1 }
        )
          .populate('user', ['mobileNumber'])
          .lean()

        return {
          _id: r._id,
          user: profile,
          mobileNumber: profile.user.mobileNumber,
          updatedAt: r.updatedAt,
        }
      })
    )

    const objects = await data

    res.status(200).json({
      startIndex: skip + 1,
      endIndex: skip + objects.length,
      count: objects.length,
      page,
      pages,
      total,
      data: objects,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
