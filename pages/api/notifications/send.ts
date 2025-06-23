import nc from 'next-connect'
import db from '../../../config/db'
import Notification from '../../../models/Notification'
import { isAuth } from '../../../utils/auth'
import User from '../../../models/User'
import { sendPushNotification } from '../../../utils/sendPushNotification'

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

      await sendPushNotification({
        tokens: tokens as any[],
        message: object.body,
        title: object.title,
        data: {
          url: '/(tabs)',
        },
      })

      res.status(200).json({ message: 'Notification sent successfully' })
    } catch (error: any) {
      res.status(500).json({
        error: error?.response?.data?.errors[0]?.message,
        details: error?.response?.data?.errors,
      })
    }
  }
)

export default handler
