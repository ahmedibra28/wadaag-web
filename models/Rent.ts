import { Schema, model, models } from 'mongoose'
import RentUser, { IRentUser } from './RentUser'

export interface IRent {
  _id: Schema.Types.ObjectId
  rentUser: IRentUser
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
  rentType?: string
  deposit?: number
  contact?: string

  createdAt?: Date
  status: 'active' | 'deleted' | 'pending'
}

const rentSchema = new Schema<IRent>(
  {
    rentUser: { type: Schema.Types.ObjectId, ref: RentUser, required: true },
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
    rentType: String,
    description: String,
    contact: String,
    status: {
      type: String,
      enum: ['active', 'deleted', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

const Rent = models.Rent || model('Rent', rentSchema)

export default Rent
