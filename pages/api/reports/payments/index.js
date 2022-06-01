import nc from 'next-connect'
import db from '../../../../config/db'
import Payment from '../../../../models/Payment'
import { isAuth } from '../../../../utils/auth'
import moment from 'moment'

const schemaName = Payment

const handler = nc()

handler.use(isAuth)
handler.post(async (req, res) => {
  try {
    await db()

    const { startDate, endDate, mobileNumber } = req.body

    const start = moment(startDate).clone().startOf('day').format()
    const end = moment(endDate).clone().endOf('day').format()

    const s = new Date(startDate)
    const e = new Date(endDate)

    if (s > e) return res.status(400).send('Please check the range of the date')

    if (mobileNumber) {
      const payments = await schemaName
        .find({
          mobileNumber,
          date: {
            $gte: start,
            $lt: end,
          },
        })
        .sort({ date: -1 })
      return res.status(200).json(payments)
    }

    const payments = await schemaName
      .find({
        date: {
          $gte: start,
          $lt: end,
        },
      })
      .sort({ date: -1 })

    return res.status(200).json(payments)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default handler
