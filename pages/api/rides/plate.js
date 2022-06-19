import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import { isAuth } from '../../../utils/auth'
import Cors from 'cors'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
    credentials: true,
  })
)

const schemaName = Profile

handler.use(isAuth)

handler.post(async (req, res) => {
  await db()
  try {
    const { plate } = req.body

    const profile = await schemaName.findOne({
      plate: plate.toUpperCase(),
      userType: 'driver',
    })

    console.log(profile)

    res.status(200).send(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
