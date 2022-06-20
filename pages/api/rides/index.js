import nc from 'next-connect'
import db from '../../../config/db'
import Ride from '../../../models/Ride'
import { isAuth } from '../../../utils/auth'
import Cors from 'cors'
import { subscription, userType } from '../../../utils/subscription'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
    credentials: true,
  })
)

const schemaName = Ride

handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const q = req.query && req.query.q

    let query = schemaName.find(q ? { name: { $regex: q, $options: 'i' } } : {})

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 25
    const skip = (page - 1) * pageSize
    const total = await schemaName.countDocuments(
      q ? { name: { $regex: q, $options: 'i' } } : {}
    )

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
    const {
      origin,
      destination,
      distance,
      duration,
      originLatLng,
      destinationLatLng,
      plate,
    } = req.body
    const rider = req.user._id

    const { mobileNumber } = req.user

    // if ((await subscription(mobileNumber)) === 0)
    //   return res.status(400).json({ error: 'Subscription expired' })

    if (!(await userType(mobileNumber)))
      return res.status(400).json({ error: 'User type not allowed' })

    if (
      (!origin || !destination || !distance || !duration,
      !originLatLng,
      !destinationLatLng)
    )
      return res.status(400).json({ error: 'Please fill all the fields' })

    const ride = await schemaName.findOne({
      status: 'pending',
      rider,
    })
    if (ride)
      return res.status(400).json({ error: 'You have a uncompleted ride' })

    const object = await schemaName.create({
      rider,
      origin,
      destination,
      distance,
      duration,
      originLatLng,
      destinationLatLng,
      plate,
    })
    res.status(200).send(object)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
