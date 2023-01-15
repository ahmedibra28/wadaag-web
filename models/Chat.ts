import { Schema, model, models } from 'mongoose'
import User from './User'

export interface IChat {
  _id: Schema.Types.ObjectId
  text: string
  sender: Schema.Types.ObjectId
  receiver: Schema.Types.ObjectId
  createdAt?: Date
  status?: string
}

const chatSchema = new Schema<IChat>(
  {
    text: String,
    sender: { type: Schema.Types.ObjectId, ref: User },
    receiver: { type: Schema.Types.ObjectId, ref: User },
    status: String,
  },
  { timestamps: true }
)

const Chat = models.Chat || model('Chat', chatSchema)

export default Chat
