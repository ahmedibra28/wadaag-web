import mongoose from 'mongoose'
import User from './User'

const chatScheme = mongoose.Schema(
  {
    text: String,
    createdAt: { type: Date, default: Date.now },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: User },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: User },
  }

  // { timestamps: true }
)

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatScheme)
export default Chat
