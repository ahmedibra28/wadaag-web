import nc from 'next-connect'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../config/db'
import Product from '../../../../../models/Product'
import MarketUser from '../../../../../models/MarketUser'

const handler = nc()
handler.use(isAuth)
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const products = req.body

      const marketUser = await MarketUser.findOne({ user: req.user._id })
      if (!marketUser)
        return res.status(400).json({ error: 'Store user not found' })
      const owner = marketUser._id

      if (!marketUser.isApproved)
        return res.status(400).json({ error: 'Your store is not approved yet' })

      for (const product of products) {
        const { cost, price, quantity } = product
        if (
          Number(cost) > Number(price) ||
          Number(price) <= 0 ||
          Number(quantity) <= 0
        ) {
          return res
            .status(400)
            .json({ error: 'Invalid cost, price or quantity' })
        }
      }

      for (const product of products) {
        const { name, cost, price, quantity, category, images, description } =
          product
        const checkDup = await Product.findOne({
          name,
          owner,
        })

        if (checkDup) {
          checkDup.cost = cost
          checkDup.price = price
          checkDup.status = 'active'
          // checkDup.status = 'pending'
          checkDup.quantity = Number(checkDup.quantity) + Number(quantity)
          await checkDup.save()
        } else {
          const product = await Product.create({
            owner,
            name,
            cost,
            price,
            quantity,
            category,
            images,
            description,
            status: 'active',
            // status: 'pending',
          })

          if (!product)
            return res.status(400).json({ error: 'Failed to create product' })
        }
      }

      return res.status(200).json({ message: 'Products created' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
