import nc from 'next-connect'
import MarketUser from '../../../../../models/MarketUser'
import db from '../../../../../config/db'
import { isAuth } from '../../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.put(
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
      if (!object)
        return res.status(400).json({ error: `You don't have a store profile` })

      const obj = await MarketUser.findByIdAndUpdate(object._id, {
        name,
        image: image || object.image,
        mobile,
        type,
        district,
      })

      if (!obj)
        return res.status(400).json({ error: 'Store profile not updated.' })

      res.send(object)
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
