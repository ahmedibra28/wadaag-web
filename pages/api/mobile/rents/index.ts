import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Rent, { IRent } from '../../../../models/Rent'
import { regions } from '../../../../utils/regions'
import { rentSubscription } from '../../../../utils/subscription'

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
          }
        : {}
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

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const {
        region,
        district,
        type,
        rooms,
        kitchen,
        toilet,
        images,
        price,
        description,
        hasBalcony,
        hasDeposit,
        hasUpFront,
        deposit,
        contact,
        status,
      } = req.body as IRent

      // check if user has paid the rent advertisement fee
      const rentExpirationDays = await rentSubscription(
        req.user.mobile as number
      )

      if (Number(rentExpirationDays) <= 0)
        return res
          .status(400)
          .json({ error: 'Rent subscription has expired, please renew' })

      const regionObj = regions.find((item) => item.name === region)
      if (!region) return res.status(400).json({ error: 'Region not found' })

      if (!regionObj?.districts.includes(district))
        return res.status(400).json({ error: 'District not found' })

      const createObj = await Rent.create({
        user: req.user._id,
        region,
        district,
        type,
        rooms,
        kitchen,
        toilet,
        images,
        price,
        description,
        hasBalcony,
        hasDeposit,
        hasUpFront,
        deposit,
        contact,
        status,
      })

      return res.status(200).send(createObj)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
