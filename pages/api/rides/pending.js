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
    const { _id } = req.user

    const ride = await schemaName
      .findOne({
        status: 'pending',
        rider: _id,
      })
      .lean()

    return res.status(200).send(ride)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

export default handler
