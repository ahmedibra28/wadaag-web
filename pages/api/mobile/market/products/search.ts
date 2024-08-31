import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Product from '../../../../../models/Product'
import Profile from '../../../../../models/Profile'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { q, category } = req.query

      const productQuery = Product.find(
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
      )

      const storeQuery = Profile.find(
        q
          ? {
              company: { $regex: q, $options: 'i' },
              hasStoreProfile: true,
              user: { $ne: req.user._id },
            }
          : { hasStoreProfile: true, user: { $ne: req.user._id } }
      )

      let products = await productQuery.lean().limit(25).sort({ createdAt: -1 })
      const stores = await storeQuery.lean().limit(5).sort({ createdAt: -1 })

      products = await Promise.all(
        products.map(async (obj) => {
          const profile = await Profile.findOne({ user: obj.owner })
            .lean()
            .select('name image company')
          return {
            ...obj,
            owner: {
              _id: obj.owner,
              name: profile?.name,
              image: profile?.image,
              company: profile?.company,
            },
          }
        })
      )

      res.status(200).json({
        products,
        stores,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
