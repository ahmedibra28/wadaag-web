const express = require('express')
const path = require('path')
const http = require('http')
const next = require('next')
const socketio = require('socket.io')
const cors = require('cors')
const axios = require('axios')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
  let app = express()

  app.use(cors())

  const server = http.createServer(app)
  const io = new socketio.Server({
    cors: {
      origin: '*',
      methods: 'GET,POST',
    },
  })
  io.attach(server)

  app.use(express.static(path.join(__dirname, './public')))
  app.use('/_next', express.static(path.join(__dirname, './.next')))

  io.on('connection', (socket) => {
    console.log('connection')
    socket.on('ride-request', (data) => {
      const riderTwoId = data.user._id
      const riderTwoName = data.user.name
      const riderTwoMobile = data.user.mobile
      const rideId = data._id
      const requestType = data.requestType

      const rideFun = async () => {
        try {
          const { data } = await axios.post(
            'http://localhost:3000/api/socketio',
            {
              riderTwoId,
              riderTwoName,
              riderTwoMobile,
              rideId,
              requestType,
            },
            {}
          )
          io.emit('ride-response', data)
        } catch (error) {
          console.log({ error: error.message })
        }
      }
      rideFun()
    })

    socket.on('disconnect', () => {
      console.log('client disconnected')
    })
  })

  app.all('*', (req, res) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
