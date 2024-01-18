import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import db from '../../../config/db'
import Advertisement from '../../../models/Advertisement'

const handler = nc()
handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const advertisement = await Advertisement.findById(id)

      if (!advertisement)
        return res.status(400).json({ error: `Advertisement not found` })

      advertisement.status = req.body.status

      await advertisement.save()

      res.status(200).json(advertisement)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
