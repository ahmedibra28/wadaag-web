import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import MobileUser from '../../../../models/MobileUser'
import UserRole from '../../../../models/UserRole'
import { isAuth } from '../../../../utils/auth'

const schemaName = MobileUser
const schemaNameString = 'Mobile user'

const handler = nc()
handler.use(isAuth)

handler.delete(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    const profile = await Profile.findOne({ user: object._id })
    profile && (await profile.remove())

    const userRole = await UserRole.findOne({ user: object._id })
    userRole && (await userRole.remove())

    await object.remove()
    res.status(200).json({ message: `${schemaNameString} removed` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
