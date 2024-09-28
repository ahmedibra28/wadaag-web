import { Schema, model, models } from 'mongoose'
import User from './User'

export interface IMarketUser {
  _id: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  name: string
  image: string
  mobile: string
  district: string
  type: 'individual' | 'company'
  createdAt: Date
  isApproved: boolean
}

const marketUserSchema = new Schema<IMarketUser>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    name: String,
    image: String,
    mobile: String,
    district: String,
    type: {
      type: String,
      enum: ['individual', 'company'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const MarketUser = models.MarketUser || model('MarketUser', marketUserSchema)

export default MarketUser
