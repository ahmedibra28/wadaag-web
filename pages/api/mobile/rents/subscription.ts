import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../config/db'
import moment from 'moment'
import Transaction from '../../../../models/Transaction'
import { initPayment } from '../../../../utils/waafipay'
import RentUser from '../../../../models/RentUser'

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { mobile, type, _id } = req.body as any

      console.log(req.body)

      const user = await RentUser.findOne({ user: _id })
      if (!user)
        return res.status(400).json({ error: 'Rent profile not found' })

      // Waafi Pay
      const payment = await initPayment({
        amount: 6.12,
        mobile: `${mobile}`,
      })

      if (payment?.error) return res.status(400).json({ error: payment.error })

      const data = {
        mobile,
        amount: 6,
        paidDate: moment().format(),
        expireDate: moment().add(30, 'days').format(),
        type,
      }

      user.expiredAt = moment().add(30, 'days').format()
      await user.save()

      const obj = await Transaction.create(data)
      if (!obj)
        return res
          .status(400)
          .json({ error: 'No transaction has been created.' })

      return res.status(200).json({ amount: 6, mobile })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
