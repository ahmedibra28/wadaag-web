import nc from 'next-connect'
import db from '../../../../config/db'
import Transaction from '../../../../models/Transaction'
import User from '../../../../models/User'
import { isAuth } from '../../../../utils/auth'
import { subscription } from '../../../../utils/subscription'

const schemaName = Transaction

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()

  try {
    const { id } = req.user
    const user = await User.findById(id)

    const payments = await schemaName
      .find({ mobileNumber: user.mobileNumber.toString() })
      .lean()
      .sort({ paidDate: -1 })

    const transactions = payments && payments.slice(0, 20)

    const expirationDays = await subscription(user.mobileNumber)

    return res.status(200).json({ transactions, expirationDays })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
