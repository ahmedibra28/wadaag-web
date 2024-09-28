import nc from 'next-connect'
import MarketUser from '../../../../../models/MarketUser'
import db from '../../../../../config/db'
import { isAuth } from '../../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.user
      const objects = await MarketUser.findOne({ user: _id }).lean()

      res.status(200).send(objects)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.user
      const { name, image, mobile, type, district } = req.body

      if (!['individual', 'company'].includes(type))
        return res
          .status(400)
          .json({ error: 'Invalid type, must be individual or company' })

      const object = await MarketUser.findOne({ user: _id })
      if (object)
        return res
          .status(400)
          .json({ error: `You already have a store profile` })

      const data = {
        user: _id,
        name,
        image,
        mobile,
        type,
        district,
        isApproved: false,
      }

      const obj = await MarketUser.create(data)

      if (!obj)
        return res.status(400).json({ error: 'Store profile not created.' })

      res.send(object)
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
