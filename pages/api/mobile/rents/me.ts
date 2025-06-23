import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Rent from '../../../../models/Rent'
import RentUser from '../../../../models/RentUser'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { region, district, type, noRooms, minPrice, maxPrice } =
        req.query as {
          region?: string
          district?: string
          type?: string
          noRooms?: string
          minPrice?: string
          maxPrice?: string
        }

      const user = await RentUser.findOne({ user: req.user._id })
      if (!user)
        return res.status(400).json({
          error: 'You do not have a rental profile, please create one',
        })

      const hasFilter =
        region || district || type || noRooms || minPrice || maxPrice
          ? true
          : false

      const filter = hasFilter
        ? {
            ...(region && {
              region: { $regex: region as string, $options: 'i' },
            }),
            ...(district && {
              district: { $regex: district as string, $options: 'i' },
            }),
            ...(type && { type: { $regex: type as string, $options: 'i' } }),
            ...(noRooms && { rooms: Number(noRooms) }),
            ...(minPrice && { price: { $gte: Number(minPrice) } }),
            ...(maxPrice && { price: { $lte: Number(maxPrice) } }),
            user: user.rentUser,
            status: { $ne: 'deleted' },
          }
        : {
            user: user.rentUser,
            status: { $ne: 'deleted' },
          }
      let query = Rent.find(filter)

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Rent.countDocuments(filter)

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

      let result = await query

      result = await Promise.all(
        result.map(async (item) => {
          const rentUser = await RentUser.findOne({
            _id: item.rentUser,
          }).lean()
          return {
            ...item,
            user: rentUser,
          }
        })
      )

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
