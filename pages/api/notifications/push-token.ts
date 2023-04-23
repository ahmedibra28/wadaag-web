import nc from 'next-connect'
import db from '../../../config/db'
import User from '../../../models/User'
import { isAuth } from '../../../utils/auth'

const schemaName = User
const schemaNameString = 'User'

const handler = nc()
handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { token } = req.body

      const object = await schemaName.findById(req.user._id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.pushToken = token
      object.allowsNotification = Boolean(token)

      await object.save()
      res.status(200).json({ message: `${schemaNameString} updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
