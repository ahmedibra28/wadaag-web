import nc from 'next-connect'
import Rent from '../../../../models/Rent'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const object = await Rent.findById(id)
      if (!object) return res.status(400).json({ error: `Rent not found` })

      res.status(200).json(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const { status } = req.body

      const object = await Rent.findById(id)
      if (!object) return res.status(400).json({ error: `Rent not found` })

      object.status = status
      await object.save()
      res.status(200).json({ message: `Rent updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const object = await Rent.findById(id)
      if (!object) return res.status(400).json({ error: `Rent not found` })

      object.status = 'deleted'
      await object.save()
      res.status(200).json({ message: `Rent removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
