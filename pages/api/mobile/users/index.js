import nc from 'next-connect'
import db from '../../../../config/db'
import MobileUser from '../../../../models/MobileUser'
import { isAuth } from '../../../../utils/auth'

const schemaName = MobileUser

const handler = nc()

handler.post(async (req, res) => {
  await db()
  try {
    let mobile = req.body.mobile ? req.body.mobile.toString() : ''

    if (!mobile || mobile.length !== 9)
      return res
        .status(400)
        .json({ error: 'Mobile number must be 9 digits and must not be empty' })

    mobile = `252${mobile}`

    const user = await schemaName.findOne({ mobile: mobile.toString() })

    if (!user) {
      const object = await schemaName.create({ mobile: mobile.toString() })

      object.getRandomOtp()
      await object.save()
      return res.status(200).send(object)
    }

    user.getRandomOtp()
    await user.save()

    res.status(200).send(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const q = req.query && req.query.q

    let query = schemaName.find(
      q ? { mobile: { $regex: q, $options: 'i' } } : {}
    )

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 25
    const skip = (page - 1) * pageSize
    const total = await schemaName.countDocuments(
      q ? { mobile: { $regex: q, $options: 'i' } } : {}
    )

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
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
