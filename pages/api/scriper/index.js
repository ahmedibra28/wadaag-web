import nc from 'next-connect'
import puppeteer from 'puppeteer'

const handler = nc()

handler.get(async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    const { MERCHANT_USERNAME, MERCHANT_PASSWORD } = process.env

    //   login merchant hormuud account
    await page.goto('https://merchant.hormuud.com/#/login')
    await page.type('input[name="username"]', MERCHANT_USERNAME)
    await page.type('input[name="password"]', MERCHANT_PASSWORD)
    await page.click('button[type="submit"]')

    // wait for the page to load
    await page.waitForNavigation()

    //   get the transaction history list table
    await page.waitForSelector('table.table')
    const data = await page.evaluate(() => {
      const table = document.querySelector('table.table')
      const tableData = []
      const tableRows = table.querySelectorAll('tbody > tr')
      tableRows.forEach((row) => {
        const tableRow = []
        const tableCells = row.querySelectorAll('td')
        tableCells.forEach((cell) => {
          tableRow.push(cell.innerText)
        })
        tableData.push(tableRow)
      })
      const tableHeaders = []
      const tableHeadersCells = table.querySelectorAll('thead > tr > th')
      tableHeadersCells.forEach((cell) => {
        tableHeaders.push(cell.innerText)
      })
      return { tableData, tableHeaders }
    })

    // get the transaction history list table with pagination
    const pageCount = await page.evaluate(() => {
      const pagination = document.querySelector('ul.pagination')
      const pageCount = pagination.querySelectorAll('li')
      return pageCount.length
    })

    const keyValuePair = data.tableData.map((row) => {
      return data.tableHeaders.map((header, i) => ({
        [header]: row[i],
      }))
    })

    const newData = keyValuePair.map((row) => {
      return Object.assign({}, ...row)
    })

    // close the browser
    await browser.close()

    return res.json(newData)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
})

export default handler
