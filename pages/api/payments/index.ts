import nc from 'next-connect'
import db from '../../../config/db'
import Transaction from '../../../models/Transaction'
import { isAuth } from '../../../utils/auth'
import { subscription } from '../../../utils/subscription'

const schemaName = Transaction

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { mobile } = req.user

      let transactions = await schemaName
        .find({ mobile: mobile })
        .lean()
        .sort({ paidDate: -1 })

      transactions = transactions && transactions.slice(0, 24)

      const expirationDays = await subscription(mobile as number)

      return res.status(200).json({ transactions, expirationDays })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
