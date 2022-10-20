import nc from 'next-connect'
import db from '../../../config/db'
import Ride from '../../../models/Ride'
import { isAuth } from '../../../utils/auth'
import Cors from 'cors'
import { subscription } from '../../../utils/subscription'
import Profile from '../../../models/Profile'

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
    const { origin, destination, distance, duration, plate } = req.body
    const { _id: rider, mobileNumber } = req.user

    const originLatLng = `${origin?.location?.lat},${origin?.location?.lng}`
    const destinationLatLng = `${destination?.location?.lat},${destination?.location?.lng}`

    if (
      (!origin || !destination || !distance || !duration, !plate, !mobileNumber)
    )
      return res.status(400).json({ error: 'Please fill all the fields' })

    const subscriptionRemainingDays = await subscription(mobileNumber)

    if (Number(subscriptionRemainingDays) <= 0)
      return res.status(400).json({ error: 'Subscription expired' })

    const isRider = await Profile.findOne({ user: rider, userType: 'rider' })
    if (!isRider) return res.status(400).json({ error: 'You are not a rider' })

    const isRiderPending = await schemaName.findOne({
      status: 'pending',
      rider,
    })
    if (isRiderPending)
      return res.status(400).json({ error: 'You have a uncompleted trip' })

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
