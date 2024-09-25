import nc from 'next-connect'
import moment from 'moment'
import RentUser from '../../../../../models/RentUser'
import db from '../../../../../config/db'
import { isAuth } from '../../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { _id } = req.user
      const objects = await RentUser.findOne({ user: _id }).lean()

      const remainingDays =
        moment(objects?.expiredAt).diff(moment(), 'days') || 0

      res.status(200).send({ ...objects, ...(objects && { remainingDays }) })
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
      const { name, image, mobile, mobile2, mobile3, district, type } = req.body

      if (!['individual', 'company'].includes(type))
        return res
          .status(400)
          .json({ error: 'Invalid type, must be individual or company' })

      const object = await RentUser.findOne({ user: _id })
      if (object)
        return res
          .status(400)
          .json({ error: `You already have a rental profile` })

      const data = {
        user: _id,
        name,
        image,
        mobile,
        mobile2,
        mobile3,
        district,
        type,
      }

      const obj = await RentUser.create(data)

      if (!obj)
        return res.status(400).json({ error: 'Rental profile not created.' })

      res.send(object)
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
