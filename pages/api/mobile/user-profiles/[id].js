import nc from 'next-connect'
import db from '../../../../config/db'
import MobileProfile from '../../../../models/MobileProfile'
import { isAuth } from '../../../../utils/auth'

const schemaName = MobileProfile
const schemaNameString = 'Mobile profile'

const handler = nc()
handler.use(isAuth)
handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query

    const objects = await schemaName.findOneAndUpdate(
      { _id: id },
      { approved: true }
    )

    if (!objects)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    res.status(200).send(objects)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
