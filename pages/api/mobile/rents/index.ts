import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Rent, { IRent } from '../../../../models/Rent'
import { rentSubscription } from '../../../../utils/subscription'
import Profile from '../../../../models/Profile'
import { getDistrictsByLabel } from '../../../../utils/banadirDistricts'

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
            status: { $eq: 'active' },
          }
        : { status: { $eq: 'active' } }
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
          const profile = await Profile.findOne({ user: item.user }).lean()
          return {
            ...item,
            user: {
              name: profile?.name,
              mobile: profile?.mobile,
              image: profile?.image,
              contact: profile?.contact,
              contact2: profile?.contact2,
            },
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
        rentType,
      } = req.body as IRent

      // check if user has paid the rent advertisement fee
      const rentExpirationDays = await rentSubscription(
        req.user.mobile as number
      )

      if (Number(rentExpirationDays) <= 0)
        return res
          .status(400)
          .json({ error: 'Rent subscription has expired, please renew' })

      if (!region) return res.status(400).json({ error: 'Region not found' })

      if (!getDistrictsByLabel(district))
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
        status: 'pending',
        rentType,
      })

      return res.status(200).send(createObj)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
