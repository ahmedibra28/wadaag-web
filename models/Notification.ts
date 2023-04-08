import { Schema, model, models } from 'mongoose'

export interface INotification {
  _id: Schema.Types.ObjectId
  title: string
  body: string
  data: {
    screen: string
    param: string
  }
  createdAt?: Date
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: {
      screen: { type: String, required: true },
      param: { type: String, required: true },
    },
  },
  { timestamps: true }
)

const Notification =
  models.Notification || model('Notification', notificationSchema)

export default Notification
