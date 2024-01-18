import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import Advertisement from '../../../../models/Advertisement'
// import { advertisementSubscription } from '../../../../utils/subscription'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      let query = Advertisement.find({ status: 'ACTIVE' })

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Advertisement.countDocuments({ status: 'ACTIVE' })

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
      const { image } = req.body

      // check if user has paid the advertisement advertisement fee
      // const advertisementExpirationDays = await advertisementSubscription(
      //   req.user.mobile as number
      // )

      // if (Number(advertisementExpirationDays) <= 0)
      //   return res
      //     .status(400)
      //     .json({ error: 'Advertisement subscription has expired, please renew' })

      if (!image) return res.status(400).json({ error: 'Image not found' })

      const createObj = await Advertisement.create({
        user: req.user._id,
        status: 'PENDING',
        image,
      })

      return res.status(200).send(createObj)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
