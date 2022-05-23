import nc from 'next-connect'
import db from '../../../config/db'
import Ride from '../../../models/Ride'
import { isAuth } from '../../../utils/auth'

const schemaName = Ride

const handler = nc()
handler.use(isAuth)
handler.post(async (req, res) => {
  await db()

  try {
    const { originLatLng, destinationLatLng } = req.body
    const { _id } = req.user

    console.log(req.body)

    const nearRiders = await schemaName
      .findOne({
        status: 'latLng',
      })
      .lean()

    return res.status(200).send(nearRiders)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

export default handler
