import { Server } from 'socket.io'
import nc from 'next-connect'
import Cors from 'cors'

export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(
  Cors({
    origin: '*',
  })
)

handler.get(async (req, res) => {
  if (!res.socket.server.io) {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('object', socket)
      socket.on('ride-request', (message) => {
        console.log(message)
        io.emit('ride-request', message)
      })
    })
  }
  res.end()
})

export default handler
