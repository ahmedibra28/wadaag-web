import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
import { isAuth } from '../../../../utils/auth'

const schemaName = Profile
const schemaNameString = 'Profile'

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const { _id } = req.user
    const objects = await schemaName
      .findOne({ user: _id })
      .lean()
      .sort({ createdAt: -1 })
      .populate('user', ['name', 'email', 'confirmed', 'blocked'])

    res.status(200).send(objects)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.post(async (req, res) => {
  await db()
  try {
    const { _id } = req.user
    const { type, name, image, plate, license, owner } = req.body

    const object = await schemaName.findOne({ user: _id }).populate('user')
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    if (name) await User.findOneAndUpdate({ _id }, { name })

    const typeOptions = ['rider', 'driver']

    if (type && !typeOptions.includes(type)) {
      return res
        .status(400)
        .json({ error: `${schemaNameString} type is invalid` })
    }

    if (type === 'driver') {
      object.plate = plate ? plate : object.plate
      object.license = license ? license : object.license
      object.owner = owner ? owner : object.owner
    }

    if (type === 'rider') {
      object.plate = undefined
      object.license = undefined
      object.owner = undefined

      // @TODO: here implement payment logic
      // if rider is paid, then set approved to true
    }

    if (object.type !== 'driver' && type === 'driver') object.approved = false
    if (type !== 'driver') object.approved = true
    if (
      object.type === 'driver' &&
      type === 'driver' &&
      object.approved === true
    )
      object.approved = true

    object.profileCompleted = true
    object.type = type ? type : object.type
    object.image = image ? image : object.image
    object.name = name ? name : object.name
    object.user = _id

    await object.save()
    res.status(200).send(`${schemaNameString} updated`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
