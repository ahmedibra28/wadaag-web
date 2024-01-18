import { Schema, model, models } from 'mongoose'
import User, { IUser } from './User'

export interface IAdvertisement {
  _id: Schema.Types.ObjectId
  image: string
  status: 'PENDING' | 'ACTIVE' | 'DELETED'
  user: IUser
  createdAt?: Date
}

const advertisementSchema = new Schema<IAdvertisement>(
  {
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'DELETED'],
      default: 'PENDING',
    },
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
  },
  { timestamps: true }
)

const Advertisement =
  models.Advertisement || model('Advertisement', advertisementSchema)

export default Advertisement
