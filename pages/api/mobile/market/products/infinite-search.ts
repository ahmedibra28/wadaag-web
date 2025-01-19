import nc from 'next-connect'
// import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Product from '../../../../../models/Product'

const handler = nc()
// handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      let { category } = req.query
      const q = req.query?.q

      if (category === 'All') {
        category = ''
      }

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 4
      const skip = (page - 1) * pageSize

      const queryRequest =
        q || category
          ? {
              name: { $regex: q, $options: 'i' },
              quantity: { $gt: 0 },
              status: 'active',
              ...(category && {
                category: { $regex: category, $options: 'i' },
              }),
            }
          : { quantity: { $gt: 0 }, status: 'active' }
      const total = await Product.countDocuments(queryRequest)
      let query = Product.find(queryRequest)

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
