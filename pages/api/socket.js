// import * as http from 'http'
// import * as socket from 'socket.io'
// import cors from 'cors'

// // use cors
// const corsOptions = {
//   origin: '*',
//   methods: 'GET,POST',
// }

// export default function handler(req, res) {
//   if (res.socket.server.io) {
//     console.log('Socket is already running')
//   } else {
//     console.log('Socket is initializing')
//     const io = new Server(res.socket.server)
//     res.socket.server.io = io
//   }
//   res.end()
// }
