import nc from 'next-connect'
import axios from 'axios'
import db from '../../../config/db'
import Payment from '../../../models/Payment'
import { isAuth } from '../../../utils/auth'
import moment from 'moment'

const schemaName = Payment

const handler = nc()

const REQUEST_PAYLOAD = {
  username: process.env.MERCHANT_USERNAME,
  password: process.env.MERCHANT_PASSWORD,
  type: 'MERCHANT',
  userNature: 'MERCHANT',
  currency: 840,
}

const LOGIN_HEADERS = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Cache-Control': 'no-cache',
    Host: 'merchant.hormuud.com',
  },
}

const BASE_URL = process.env.MERCHANT_BASE_URL

const LOGIN_URL = `${BASE_URL}/login`
const TRANSACTIONS = `${BASE_URL}/transactions`

handler.use(isAuth)
handler.get(async (req, res) => {
  try {
    await db()

    // Login
    const response = await axios.post(LOGIN_URL, REQUEST_PAYLOAD, LOGIN_HEADERS)
    const loginData = response.data
    const loginCookie = response.headers['set-cookie']
    const { sessionId } = loginData

    const headers = {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/json;charset=UTF-8',
      Cookie: loginCookie,
      Referer: 'https://merchant.hormuud.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }

    if (loginData.replyMessage !== 'Success')
      return res.status(401).json({ error: 'Authentication Error' })

    // Transactions
    const { data } = await axios.post(
      TRANSACTIONS,
      '{"userNature":"MERCHANT","sessionId":"' + sessionId + '"}',
      {
        headers,
      }
    )

    if (data.replyMessage !== 'Success')
      return res.status(401).json({ error: 'Fetching Transactions Error' })

    if (data) {
      const payments = await schemaName.find(
        {
          date: {
            $gte: moment().subtract(30, 'days').toDate(),
          },
        },
        { transactionId: 1 }
      )
      const paymentsId = payments.map((payment) => payment.transactionId)

      let filteredData = data.transactionInfo.filter(
        (transaction) => !paymentsId.includes(transaction.tranID.toString())
      )

      const thirtyDaysBefore = moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD HH:mm:ss')

      filteredData = filteredData.filter((payment) => {
        payment.tranDate = moment(payment.tranDate, 'DD/MM/YY HH:mm:ss').format(
          'YYYY-MM-DD HH:mm:ss'
        )
        return payment.tranDate > thirtyDaysBefore
      })

      filteredData.forEach(async (transaction) => {
        await schemaName.create({
          mobileNumber: transaction.sender,
          transactionId: transaction.tranID,
          amount: transaction.credit,
          paymentMethod: 'MERCHANT',
          date: transaction.tranDate,
        })
      })

      return res.status(200).json({
        newTransactions: filteredData.length,
        totalTransactions: data.transactionInfo.length,
      })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// handler.post(async (req, res) => {
//   try {
//     await db()

//     // Login
//     const response = await axios.post(LOGIN_URL, REQUEST_PAYLOAD, LOGIN_HEADERS)
//     const loginData = response.data
//     const loginCookie = response.headers['set-cookie']
//     const { sessionId } = loginData

//     const headers = {
//       Accept: 'application/json; charset=utf-8',
//       'Content-Type': 'application/json;charset=UTF-8',
//       Cookie: loginCookie,
//       Referer: 'https://merchant.hormuud.com/',
//       'Referrer-Policy': 'strict-origin-when-cross-origin',
//     }

//     if (loginData.replyMessage !== 'Success')
//       return res.status(401).json({ error: 'Authentication Error' })

//     // Transactions
//     const { data } = await axios.post(
//       TRANSACTIONS,
//       '{"userNature":"MERCHANT","sessionId":"' + sessionId + '"}',
//       {
//         headers,
//       }
//     )

//     if (data.replyMessage !== 'Success')
//       return res.status(401).json({ error: 'Fetching Transactions Error' })

//     if (data) {
//       const payments = await schemaName.find(
//         {
//           date: {
//             $gte: moment().subtract(30, 'days').toDate(),
//           },
//         },
//         { transactionId: 1 }
//       )
//       const paymentsId = payments.map((payment) => payment.transactionId)

//       let filteredData = data.transactionInfo.filter(
//         (transaction) => !paymentsId.includes(transaction.tranID.toString())
//       )

//       const thirtyDaysBefore = moment()
//         .subtract(30, 'days')
//         .format('YYYY-MM-DD HH:mm:ss')

//       filteredData = filteredData.filter((payment) => {
//         payment.tranDate = moment(payment.tranDate, 'DD/MM/YY HH:mm:ss').format(
//           'YYYY-MM-DD HH:mm:ss'
//         )
//         return payment.tranDate > thirtyDaysBefore
//       })

//       filteredData.forEach(async (transaction) => {
//         await schemaName.create({
//           mobileNumber: transaction.sender,
//           transactionId: transaction.tranID,
//           amount: transaction.credit,
//           paymentMethod: 'MERCHANT',
//           date: transaction.tranDate,
//         })
//       })

//       return res.status(200).json({
//         newTransactions: filteredData.length,
//         totalTransactions: data.transactionInfo.length,
//       })
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message })
//   }
// })

handler.post(async (req, res) => {
  try {
    await db()
    return res.status(200).send('success')
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default handler
