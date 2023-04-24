import nc from 'next-connect'
import db from '../../../config/db'
import Notification from '../../../models/Notification'
import { isAuth } from '../../../utils/auth'
import axios from 'axios'
import User from '../../../models/User'

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

      let tokens = await User.find(
        { allowNotification: true, pushToken: { $exists: true } },
        { pushToken: 1 }
      ).lean()

      tokens = tokens
        .map((token) => token.pushToken !== '' && token.pushToken)
        ?.filter(Boolean)

      const messages = tokens.map((token) => ({
        to: token,
        title: object?.title,
        body: object?.body,
        data: {
          screen: object?.data?.screen,
          param: object?.data?.param,
        },
      }))

      const result = await axios.post(
        `https://exp.host/--/api/v2/push/send`,
        messages,
        {
          headers: {
            Host: 'exp.host',
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
        }
      )

      if (result.status !== 200)
        return res.status(400).json({ error: 'Error send notification' })

      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
