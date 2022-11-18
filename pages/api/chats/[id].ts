import nc from 'next-connect'
import db from '../../../config/db'
import Chat from '../../../models/Chat'
import Profile from '../../../models/Profile'
import { isAuth } from '../../../utils/auth'

const schemaName = Chat
const schemaNameString = 'Chat'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()

    try {
      const sender = req.query.id
      const receiver = req.user._id

      let chat = await schemaName
        .find({
          $or: [
            { sender: receiver, receiver: sender },
            { sender, receiver },
          ],
        })
        .lean()

      const receiverProfile = await Profile.findOne({ user: receiver })
      const senderProfile = await Profile.findOne({ user: sender })

      chat = chat?.map((c) => {
        return {
          _id: c._id,
          text: c.text,
          createdAt: c.createdAt,
          user: {
            _id:
              sender.toString() === c.sender.toString()
                ? senderProfile.user
                : receiverProfile.user,

            name:
              sender.toString() === c.sender.toString()
                ? senderProfile.name
                : receiverProfile.name,

            avatar:
              sender.toString() === c.sender.toString()
                ? senderProfile.image
                : receiverProfile.image,
          },
        }
      })

      res.status(200).send(chat)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const user = req.query.id
      const { text } = req.body
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
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const currentUser = req.user._id

      const object = await schemaName.findOne({
        users: { $all: [currentUser, id] },
      })

      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      await object.remove()
      res.status(200).json({ message: `${schemaNameString} removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
