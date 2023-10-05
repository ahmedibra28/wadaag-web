import { Schema, model, models } from 'mongoose'
import { IUser } from './User'

export interface IRent {
  _id: Schema.Types.ObjectId
  user: IUser
  region: string
  district: string
  type: string
  rooms: number
  kitchen: number
  toilet: number
  images?: string[]
  price: number
  description?: string
  hasBalcony: boolean
  hasDeposit: boolean
  hasUpFront: boolean
  deposit?: number
  contact?: string

  createdAt?: Date
  status: 'active' | 'deleted'
}

const rentSchema = new Schema<IRent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    region: { type: String, required: true },
    district: { type: String, required: true },
    type: { type: String, required: true },
    rooms: { type: Number, default: 0 },
    kitchen: { type: Number, default: 0 },
    toilet: { type: Number, default: 0 },
    price: { type: Number, required: true },
    hasBalcony: { type: Boolean, required: true },
    hasDeposit: { type: Boolean, required: true },
    hasUpFront: { type: Boolean, required: true },
    images: [String],
    deposit: { type: Number, default: 0 },
    description: String,
    contact: String,
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
  },
  { timestamps: true }
)

const Rent = models.Rent || model('Rent', rentSchema)

export default Rent
