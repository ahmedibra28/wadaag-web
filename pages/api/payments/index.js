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

handler.use(isAuth)
handler.get(async (req, res) => {
  try {
    await db()
    const QUERY = req.query.query

    const BASE_URL = `https://merchant.hormuud.com/api/account`

    const LOGIN_URL = `${BASE_URL}/login`
    // const BALANCE = `${BASE_URL}/balance`
    const TRANSACTIONS = `${BASE_URL}/transactions`

    const allowedQueries = ['balance', 'transactions']

    if (!allowedQueries.includes(QUERY))
      return res.status(400).json({ error: 'Invalid query' })

    // const URL =
    //   QUERY === 'balance'
    //     ? BALANCE
    //     : QUERY === 'transactions'
    //     ? TRANSACTIONS
    //     : ''

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

    // Transactions
    const { data } = await axios.post(
      TRANSACTIONS,
      '{"userNature":"MERCHANT","sessionId":"' + sessionId + '"}',
      {
        headers,
      }
    )

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

      const filteredData = data.transactionInfo.filter(
        (transaction) => !paymentsId.includes(transaction.tranID.toString())
      )
      filteredData.forEach(async (transaction) => {
        await schemaName.create({
          mobileNumber: transaction.sender,
          transactionId: transaction.tranID,
          amount: transaction.credit,
          paymentMethod: 'MERCHANT',
          date: moment(transaction.tranDate, 'DD/MM/YY HH:mm:ss').format(),
        })
      })

      return res.status(200).json({
        newTransactions: filteredData.length,
        totalTransactions: data.transactionInfo.length,
      })
    }

    res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default handler
