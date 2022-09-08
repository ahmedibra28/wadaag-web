import nc from 'next-connect'
import db from '../../../../config/db'
import Transaction from '../../../../models/Transaction'
import User from '../../../../models/User'
import { isAuth } from '../../../../utils/auth'

const schemaName = Transaction

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()

  try {
    const { id } = req.user
    const user = await User.findById(id)

    const payments = await schemaName
      .find({ mobileNumber: `0${user.mobileNumber?.toString()?.slice(-9)}` })
      .lean()
      .sort({ paidDate: -1 })

    const last3PaymentTransactions = payments && payments.slice(0, 3)

    return res.status(200).json(last3PaymentTransactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
