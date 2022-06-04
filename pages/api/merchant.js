import nc from 'next-connect'
import axios from 'axios'

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
    TLSVersion: 'TLSv2,TLSv1.2',
  },
}

handler.get(async (req, res) => {
  try {
    const QUERY = req.query.query

    const BASE_URL = `https://merchant.hormuud.com/api/account`

    const LOGIN_URL = `${BASE_URL}/login`
    const BALANCE = `${BASE_URL}/balance`
    const TRANSACTIONS = `${BASE_URL}/transactions`

    const allowedQueries = ['balance', 'transactions']

    if (!allowedQueries.includes(QUERY))
      return res.status(400).json({ error: 'Invalid query' })

    const URL =
      QUERY === 'balance'
        ? BALANCE
        : QUERY === 'transactions'
        ? TRANSACTIONS
        : ''

    // Login
    const response = await axios.post(LOGIN_URL, REQUEST_PAYLOAD, LOGIN_HEADERS)
    const loginData = response.data
    const loginCookie = response.headers['set-cookie']
    const { sessionId } = loginData

    // Data
    const { data } = await axios.post(
      URL,
      '{"userNature":"MERCHANT","sessionId":"' + sessionId + '"}',
      {
        headers: {
          accept: 'application/json; charset=utf-8',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json;charset=UTF-8',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          cookie: loginCookie,
          Referer: 'https://merchant.hormuud.com/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          TLSVersion: 'TLSv2,TLSv1.2',
        },
      }
    )

    res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default handler
