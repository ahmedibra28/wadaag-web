import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import Rent from '../../../../models/Rent'
import db from '../../../../config/db'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()

    try {
      const obj = await Rent.findOne({
        _id: req.query.id,
      })

      res.status(200).send(obj)
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

      const obj = await Rent.findOneAndUpdate(
        {
          _id: id,
        },
        {
          status: 'deleted',
        }
      )

      if (!obj)
        return res
          .status(400)
          .json({ error: 'rent not found or deleting failed' })

      res
        .status(200)
        .json({ message: `Rent ${obj.region} deleted successfully` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
