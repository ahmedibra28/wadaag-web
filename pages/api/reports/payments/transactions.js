import nc from 'next-connect'
import db from '../../../../config/db'
import Payment from '../../../../models/Payment'
import User from '../../../../models/User'
import { isAuth } from '../../../../utils/auth'

const schemaName = Payment

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const { id } = req.user
    const user = await User.findById(id)

    const payments = await schemaName
      .find({ mobileNumber: user.mobileNumber })
      .lean()
      .sort({ date: -1 })

    const last3PaymentTransactions = payments && payments.slice(0, 3)

    return res.status(200).json(last3PaymentTransactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
