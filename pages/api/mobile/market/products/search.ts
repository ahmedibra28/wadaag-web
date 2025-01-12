import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Product from '../../../../../models/Product'
import MarketUser from '../../../../../models/MarketUser'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { q, category } = req.query

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 10
      const skip = (page - 1) * pageSize

      const query =
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
      const total = await Product.countDocuments(query)

      const pages = Math.ceil(total / pageSize)

      const marketUser = await MarketUser.findOne({ user: req.user._id })
      if (!marketUser)
        return res.status(400).json({ error: 'Store user not found' })

      const productQuery = Product.find(query).skip(skip).limit(pageSize)

      const storeQuery = MarketUser.find(
        q
          ? {
              name: { $regex: q, $options: 'i' },
              user: { $ne: marketUser._id },
            }
          : { user: { $ne: marketUser._id } }
      )

      let products = await productQuery
        .lean()
        .limit(pageSize)
        .sort({ createdAt: -1 })
      const stores = await storeQuery.lean().limit(5).sort({ createdAt: -1 })

      products = await Promise.all(
        products.map(async (obj) => {
          const marketUser = await MarketUser.findOne({ _id: obj.owner })
            .lean()
            .select('name image company')

          return {
            ...obj,
            owner: marketUser,
          }
        })
      )

      res.status(200).json({
        products,
        pages,
        stores: stores.map((store) => ({
          ...store,
          isStore: true,
        })),
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
