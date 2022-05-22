import nc from 'next-connect'
import db from '../../../config/db'
import Ride from '../../../models/Ride'
import { isAuth } from '../../../utils/auth'

const schemaName = Ride

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()

  try {
    const _id = req.user.id

    const ride = await schemaName.findOne({
      status: 'pending',
      'riderOne.rider': _id,
    })

    if (ride) return res.status(200).json(ride)

    return res.status(200).json({ message: 'No pending rides' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
