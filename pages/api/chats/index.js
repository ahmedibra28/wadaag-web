import nc from 'next-connect'
import db from '../../../config/db'
import Chat from '../../../models/Chat'
import { isAuth } from '../../../utils/auth'

const schemaName = Chat

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    let query = schemaName.find({})

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 25
    const skip = (page - 1) * pageSize
    const total = await schemaName.countDocuments({})

    const pages = Math.ceil(total / pageSize)

    query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

    const result = await query

    res.status(200).json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.post(async (req, res) => {
  await db()
  try {
    const { user, text } = req.body

    const currentUser = req.user._id

    const chat = await schemaName.findOne({
      users: { $all: [currentUser, user] },
    })
    if (chat) {
      chat.messages.push({ text, user: currentUser, createdAt: Date.now() })

      await chat.save()
      return res.status(200).json({ message: 'Message added to chat' })
    }

    const newChat = await schemaName.create({
      users: [currentUser, user],
      messages: [{ text, user: currentUser, createdAt: Date.now() }],
    })

    if (!newChat) return res.status(400).json({ error: 'Chat not created' })

    return res.status(200).send('Chat has been started')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
