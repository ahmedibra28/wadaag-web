import nc from 'next-connect'
import Product from '../../../../models/Product'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const object = await Product.findById(id).populate(
        'owner',
        'name email mobile'
      )
      if (!object) return res.status(400).json({ error: `Product not found` })

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

      const object = await Product.findById(id)
      if (!object) return res.status(400).json({ error: `Product not found` })

      object.status = status
      await object.save()
      res.status(200).json({ message: `Product updated` })
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
      const object = await Product.findById(id)
      if (!object) return res.status(400).json({ error: `Product not found` })

      object.status = 'deleted'
      await object.save()
      res.status(200).json({ message: `Product removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
