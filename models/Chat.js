import mongoose from 'mongoose'
import User from './User'

const chatScheme = mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
    messages: [
      {
        text: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: User },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatScheme)
export default Chat
