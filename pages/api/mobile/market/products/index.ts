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
      const q = req.query && req.query.q

      let query = Product.find(
        q
          ? {
              name: { $regex: q, $options: 'i' },
              quantity: { $gt: 0 },
              status: 'active',
              owner: req.user._id,
            }
          : { quantity: { $gt: 0 }, status: 'active', owner: req.user._id }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Product.countDocuments(
        q ? { name: { $regex: q, $options: 'i' } } : {}
      )

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean()

      let result = await query

      result = await Promise.all(
        result.map(async (obj) => {
          const profile = await Profile.findOne({ user: obj.owner })
            .lean()
            .select('name image')
          return {
            ...obj,
            owner: {
              _id: obj.owner,
              name: profile?.name,
              image: profile?.image,
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
      const { name, cost, price, quantity, category, images, description } =
        req.body
      const owner = req.user._id

      if (
        Number(cost) > Number(price) ||
        Number(price) <= 0 ||
        Number(quantity) <= 0
      ) {
        return res
          .status(400)
          .json({ error: 'Invalid cost, price or quantity' })
      }

      const newCost = Number(price)
      const newPrice = newCost * 0.7 + 1.5

      const checkDup = await Product.findOne({
        name,
        owner,
      })

      if (checkDup) {
        checkDup.cost = newCost
        checkDup.price = newPrice
        // checkDup.status = 'pending'
        checkDup.status = 'active'
        checkDup.quantity = Number(checkDup.quantity) + Number(quantity)
        await checkDup.save()
        return res.status(200).json(checkDup)
      }

      const product = await Product.create({
        owner,
        name,
        cost: newCost,
        price: newPrice,
        quantity,
        category,
        images,
        description,
        status: 'active',
        // status: 'pending',
      })

      if (!product)
        return res.status(400).json({ error: 'Failed to create product' })

      return res.status(200).json(product)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
