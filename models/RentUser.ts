import { Schema, model, models } from 'mongoose'
import User from './User'

export interface IRentUser {
  _id: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  name: string
  image: string
  mobile: string
  mobile2?: string
  mobile3?: string
  district: string
  type: 'individual' | 'company'
  expiredAt: Date
  createdAt: Date
}

const rentUserSchema = new Schema<IRentUser>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    name: String,
    image: String,
    mobile: String,
    mobile2: String,
    mobile3: String,
    district: String,
    type: {
      type: String,
      enum: ['individual', 'company'],
    },
    expiredAt: Date,
  },
  { timestamps: true }
)

const RentUser = models.RentUser || model('RentUser', rentUserSchema)

export default RentUser
