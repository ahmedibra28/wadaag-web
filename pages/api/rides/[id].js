import nc from 'next-connect'
import db from '../../../config/db'
import Ride from '../../../models/Ride'
import { isAuth } from '../../../utils/auth'

const schemaName = Ride
const schemaNameString = 'Ride'

const handler = nc()

handler.use(isAuth)

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
