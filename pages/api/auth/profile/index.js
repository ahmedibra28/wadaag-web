import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
import { isAuth } from '../../../../utils/auth'

const schemaName = Profile
const schemaNameString = 'Profile'

import Cors from 'cors'
import { subscription } from '../../../../utils/subscription'
import Transaction from '../../../../models/Transaction'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
  })
)
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const { _id, mobileNumber } = req.user
    const objects = await schemaName
      .findOne({ user: _id })
      .lean()
      .sort({ createdAt: -1 })
      .populate('user', ['mobileNumber'])

    const expiration = await subscription(
      `0${mobileNumber?.toString()?.slice(-9)}`
    )

    const payments = await Transaction.find({
      mobileNumber: `0${mobileNumber?.toString()?.slice(-9)}`,
    })
      .lean()
      .sort({ paidDate: -1 })

    const last3PaymentTransactions = payments && payments.slice(0, 3)

    res.status(200).send({ ...objects, expiration, last3PaymentTransactions })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.post(async (req, res) => {
  await db()
  try {
    const { _id } = req.user
    const { name, image, userType, plate, license } = req.body

    const object = await schemaName.findOne({ user: _id }).populate('user')
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    if (name) await User.findOneAndUpdate({ _id }, { name })

    object.profileCompleted = true
    object.image = image ? image : object.image
    object.userType = userType ? userType : object.userType
    object.name = name ? name : object.name
    object.user = _id

    if (userType === 'driver' && plate) {
      object.plate = plate
    }
    if (userType === 'driver' && license) {
      object.license = license
    }

    await object.save()
    res.status(200).send(`${schemaNameString} updated`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
