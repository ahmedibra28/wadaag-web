import nc from 'next-connect'
import db from '../../../config/db'
import User from '../../../models/User'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.body
      const user = await User.findById(_id)
      if (!user) return res.status(404).json({ error: 'User not found' })

      user.status = 'active'
      await user.save()
      return res.send(user)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
