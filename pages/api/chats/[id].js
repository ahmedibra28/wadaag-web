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
    const user = req.query.id
    const currentUser = req.user._id

    const chat = await schemaName
      .findOne({
        users: { $all: [currentUser, user] },
      })
      .populate('messages.user', 'name')
      .populate('users', 'name')
    //  populate user inside messages array

    res.status(200).send(chat)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// @TODO: finish this function

handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query

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
