import moment from 'moment'
import nc from 'next-connect'
import db from '../../../config/db'
import Profile from '../../../models/Profile'
import Transaction, { ITransaction } from '../../../models/Transaction'
import { isAuth } from '../../../utils/auth'

const schemaName = Transaction

const handler = nc()
handler.use(isAuth)
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { sender, startDate, endDate } = req.body

      const start = moment(startDate).clone().startOf('day').format()
      const end = moment(endDate).clone().endOf('day').format()

      let query: ITransaction[] = []

      if (sender && startDate && endDate) {
        query = await schemaName
          .find({ mobile: sender, createdAt: { $gte: start, $lte: end } })
          .lean()
      }
      if (sender && !startDate && !endDate) {
        query = await schemaName.find({ mobile: sender }).lean()
      }
      if (!sender && startDate && endDate) {
        query = await schemaName
          .find({ createdAt: { $gte: start, $lte: end } })
          .lean()
      }

      const finalResult = Promise.all(
        query.map(async (r) => {
          const profile = await Profile.findOne({
            mobile: Number(r?.mobile),
          })

          return {
            name: profile?.name,
            image: profile?.image,
            ...r,
          }
        })
      )

      const objects = await finalResult

      res.status(200).json(objects)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
