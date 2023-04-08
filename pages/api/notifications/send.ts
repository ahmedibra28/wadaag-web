import nc from 'next-connect'
import db from '../../../config/db'
import Notification from '../../../models/Notification'
import { isAuth } from '../../../utils/auth'
import axios from 'axios'

const schemaName = Notification

const handler = nc()

handler.use(isAuth)
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()

    const { _id } = req.body

    try {
      const object = await schemaName.findOne({ _id })

      if (!object)
        return res.status(404).json({ error: 'Not found notification' })

      await axios.post(
        `https://exp.host/--/api/v2/push/send`,
        {
          to: process.env.EXPO_TOKEN,
          title: object?.title,
          body: object?.body,
          data: {
            screen: object?.data?.screen,
            param: object?.data?.param,
          },
        },
        {
          headers: {
            Host: 'exp.host',
            Accept: 'application/json',
            ' Accept-Encoding': 'gzip, deflate',
            ' Content-Type': 'application/json',
          },
        }
      )

      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
