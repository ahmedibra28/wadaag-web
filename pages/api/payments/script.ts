import nc from 'next-connect'
import db from '../../../config/db'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import Transaction from '../../../models/Transaction'

const schemaName = Transaction

import Cors from 'cors'

const handler = nc()
handler.use(
  Cors({
    origin: '*',
    // origin: ['http://10.0.2.2'],
  })
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { timestamp, body, originatingAddress } = req.body

      // authentications
      let token = ''
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1]
      }
      const authData = {
        iss: 'Ahmed Ibrahim Samow',
        iat: 718675200,
        exp: 32275670400,
        aud: 'www.ahmedibra.com',
        sub: 'ahmaat19@gmail.com',
        Email: 'ahmaat19@gmail.com',
        Role: 'Super Admin',
        key: 'jdhfdsyfuds76f5689783294838248bdnsfb!J@#TR^%&^%5!%$22350900--=-304384',
      }

      // checking required fields
      if (!timestamp || !body || !originatingAddress)
        return res.status(400).json({ error: 'All fields are required' })

      // checking request address
      if (originatingAddress !== '192')
        return res.status(400).json({ error: 'Invalid address' })

      // calculating difference between sent date and current date
      const currentDateTime = moment()
      const currentTimestamp = moment(timestamp)
      const minutes = currentDateTime.diff(currentTimestamp, 'minutes')
      if (minutes < 0 || minutes > 30)
        return res
          .status(400)
          .json({ error: 'The message must be received within 30 minutes.' })

      // verifying authentications
      const decoded: any = jwt.verify(token, authData?.key)
      if (
        decoded?.iss !== authData?.iss ||
        decoded?.iat !== authData?.iat ||
        decoded?.exp !== authData?.exp ||
        decoded?.aud !== authData?.aud ||
        decoded?.sub !== authData?.sub ||
        decoded?.Email !== authData?.Email ||
        decoded?.Role !== authData?.Role
      )
        return res
          .status(403)
          .json({ error: 'You are not authorized to perform this action.' })

      // checking body message if its received or sent
      if (body.startsWith('[-EVCPlus-] Waxaad ')) {
        const [amount, mobile] = body.match(/[0-9.]+/g)

        const amountPerDay = 1 / 30
        const noOfDays = Math.round(Number(amount) / amountPerDay)

        const data = {
          mobile,
          amount,
          paidDate: moment(timestamp).format(),
          expireDate: moment(timestamp).add(Number(noOfDays), 'days').format(),
        }

        const obj = await schemaName.create(data)
        if (!obj)
          return res
            .status(400)
            .json({ error: 'No transaction has been created.' })

        return res.status(200).json({ amount, mobile })
      }

      return res
        .status(404)
        .json({ error: 'This type of message is not supported by us.' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
