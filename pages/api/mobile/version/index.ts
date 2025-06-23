import nc from 'next-connect'
import db from '../../../../config/db'
import Version from '../../../../models/Version'
import User from '../../../../models/User'

const handler = nc()

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      await db()

      const { token, userId } = req.query as any

      if (token && userId) {
        await User.findOneAndUpdate({ _id: userId }, { pushToken: token })
      }

      const version = await Version.findOne({}).sort({ createdAt: -1 })
      res.status(200).json(version)
    } catch (error: any) {
      res.status(500).json({ error: error?.message })
    }
  }
)

export default handler
