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
      const { id } = req.query
      let product = await Product.findOne({
        _id: id,
        quantity: { $gt: 0 },
        status: 'active',
      }).lean()

      if (!product) return res.status(400).json({ error: `Product not found` })

      const marketUser = await MarketUser.findOne({ user: product.owner })
        .lean()
        .select('name image company')

      product = {
        ...product,
        owner: marketUser,
      }

      return res.status(200).json(product)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const { name, cost, price, quantity, category, images, description } =
        req.body

      if (
        Number(cost) > Number(price) ||
        Number(price) <= 0 ||
        Number(quantity) <= 0
      ) {
        return res
          .status(400)
          .json({ error: 'Invalid cost, price or quantity' })
      }

      const marketUser = await MarketUser.findOne({ user: req.user._id })
      if (!marketUser)
        return res.status(400).json({ error: 'Store user not found' })

      if (!marketUser.isApproved)
        return res.status(400).json({ error: 'Your store is not approved yet' })

      const object = await Product.findOne({
        _id: id,
        status: 'active',
        owner: marketUser._id,
      })
      if (!object) return res.status(400).json({ error: `Product not found` })

      const checkDup = await Product.findOne({
        name,
        owner: marketUser._id,
        status: 'active',
        _id: { $ne: id },
      })

      if (checkDup) {
        checkDup.cost = cost
        checkDup.price = price
        checkDup.quantity = Number(checkDup.quantity) + Number(quantity)
        await checkDup.save()

        object.status = 'deleted'
        await object.save()

        return res.status(200).json(checkDup)
      }

      object.name = name
      object.cost = cost
      object.price = price
      object.quantity = quantity
      object.category = category
      object.images = images
      object.description = description
      await object.save()

      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query

      const marketUser = await MarketUser.findOne({ user: req.user._id })
      if (!marketUser)
        return res.status(400).json({ error: 'Store user not found' })

      const object = await Product.findOne({
        _id: id,
        owner: marketUser._id,
        status: 'active',
      })
      if (!object) return res.status(400).json({ error: `Product not found` })

      await Product.findByIdAndDelete(id)

      return res.status(200).json({ message: 'Products removed' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
