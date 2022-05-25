import nc from 'next-connect'
import db from '../../../config/db'
import Chat from '../../../models/Chat'
import { isAuth } from '../../../utils/auth'

const schemaName = Chat
const schemaNameString = 'Chat'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await db()

  try {
    const user = req.query.id
    const currentUser = req.user._id

    const chat = await schemaName.findOne({
      users: { $all: [currentUser, user] },
    })

    res.status(200).send(chat)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.delete(async (req, res) => {
  await db()
  try {
    const { id, status } = req.query

    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    if (status === 'cancelled') {
      object.status = 'cancelled'
      await object.save()
      return res.status(200).json({ message: `${schemaNameString} cancelled` })
    }

    if (status === 'completed') {
      object.status = 'completed'
      await object.save()
      return res.status(200).json({ message: `${schemaNameString} completed` })
    }

    if (status === 'pending') {
      object.status = 'pending'
      await object.save()
      return res.status(200).json({ message: `${schemaNameString} pending` })
    }

    if (status === 'delete') {
      await object.remove()
      return res.status(200).json({ message: `${schemaNameString} deleted` })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
