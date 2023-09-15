import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Rent from '../../../../models/Rent'

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
            user: req.user._id,
          }
        : { user: req.user._id }
      let query = Rent.find(filter)

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Rent.countDocuments(filter)

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

      const result = await query

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
