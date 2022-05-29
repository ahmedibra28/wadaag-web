import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import { isAuth } from '../../../../utils/auth'

const schemaName = Profile

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query

    const object = await schemaName.findByIdAndUpdate(
      { _id: id },
      { $set: { approved: true } }
    )

    res.status(200).send(object)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
