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
    const { _id: currentUser } = req.user

    let query = schemaName.find({
      $or: [{ sender: currentUser }, { receiver: currentUser }],
    })

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 25
    const skip = (page - 1) * pageSize
    const total = await schemaName.countDocuments({ secondUser: currentUser })

    const pages = Math.ceil(total / pageSize)

    query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

    let result = await query

    const noDuplicates = []
    result.forEach((d) => {
      !noDuplicates
        .map((n) => n?.sender.toString())
        .includes(d.sender.toString()) && noDuplicates.push(d)
    })

    const newPromiseResult = Promise.all(
      noDuplicates?.map(async (result) => {
        const profile = await Profile.findOne({ user: result.sender }).lean()
        return {
          _id: result.sender,
          name: profile?.name,
          lastMessage: 'Hi there!',
          createdAt: new Date(),
          image: profile?.image,
        }
      })
    )

    let newResult = await newPromiseResult

    newResult = newResult?.filter(
      (result) => result._id?.toString() !== currentUser?.toString()
    )

    res.status(200).json({
      startIndex: skip + 1,
      endIndex: skip + newResult.length,
      count: newResult.length,
      page,
      pages,
      total,
      data: newResult,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
