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

    socket.on('joinRoom', (info) => {
      console.log('=============== connected')
      console.log(info)
    })

    socket.on('message', (info) => {
      console.log('=============== connected message')
      console.log(info)

      io.emit('message', info)
    })

    // ======================= Start Rider Two Ride ==========================

    socket.on('rider-two-chat', (info) => {
      const rideFun = async () => {
        try {
          const { data } = await axios.post(
            'http://localhost:3000/api/socketio',
            {
              _id: info._id,
              riderOneId: info.riderOneId,
              riderOneName: info.riderOneName,
              riderOneAvatar: info.riderOneAvatar,
              riderOneMobile: info.riderOneMobile,

              riderTwoId: info.riderTwoId,
              riderTwoName: info.riderTwoName,
              riderTwoAvatar: info.riderTwoAvatar,
              riderTwoMobile: info.riderTwoMobile,

              message: info.message,
            },
            {}
          )

          if (data) {
            io.emit(`${data.riderOneId}1`, data)
          }
        } catch (error) {
          console.log({ error: error.message })
        }
      }
      rideFun()
    })

    // ========================= End Rider Two Ride ==========================

    // ======================= Start Rider One Ride ==========================

    socket.on('rider-one-chat', (info) => {
      const rideFun = async () => {
        try {
          const { data } = await axios.post(
            'http://localhost:3000/api/socketio',
            {
              _id: info._id,
              riderOneId: info.riderOneId,
              riderOneName: info.riderOneName,
              riderOneAvatar: info.riderOneAvatar,
              riderOneMobile: info.riderOneMobile,

              riderTwoId: info.riderTwoId,
              riderTwoName: info.riderTwoName,
              riderTwoAvatar: info.riderTwoAvatar,
              riderTwoMobile: info.riderTwoMobile,

              message: info.message,
            },
            {}
          )

          if (data) {
            io.emit(`${data.riderTwoId}2`, data)
          }
        } catch (error) {
          console.log({ error: error.message })
        }
      }
      rideFun()
    })

    // ========================= End Rider One Ride ==========================

    // ======================= Start Rider One Ride ==========================

    socket.on('send-message', (info) => {
      const rideFun = async () => {
        try {
          const { data } = await axios.post(
            'http://localhost:3000/api/socketio',
            {
              _id: info._id,
              riderOneId: info.riderOneId,
              riderOneName: info.riderOneName,
              riderOneAvatar: info.riderOneAvatar,
              riderOneMobile: info.riderOneMobile,

              riderTwoId: info.riderTwoId,
              riderTwoName: info.riderTwoName,
              riderTwoAvatar: info.riderTwoAvatar,
              riderTwoMobile: info.riderTwoMobile,

              message: info.message,
            },
            {}
          )

          if (data) {
            io.emit(
              info.sender === data.riderOneId
                ? `${data.riderTwoId}message1`
                : `${data.riderOneId}message2`,
              data
            )
          }
        } catch (error) {
          console.log({ error: error.message })
        }
      }
      rideFun()
    })

    // ========================= End Rider One Ride ==========================

    socket.on('disconnect', () => {
      console.log('client disconnected')
    })
  })

  app.all('*', (req, res) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
