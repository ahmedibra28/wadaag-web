import { Schema, model, models } from 'mongoose'

export interface IRent {
  _id: Schema.Types.ObjectId
  region: string
  district: string
  type: string
  room: number
  kitchen: number
  toilet: number
  images?: string[]
  price: number
  hasBalcony: boolean
  hasDeposit: boolean
  hasUpFront: boolean
  deposit?: number

  createdAt?: Date
  status: 'active' | 'deleted'
}

const rentSchema = new Schema<IRent>(
  {
    region: { type: String, required: true },
    district: { type: String, required: true },
    type: { type: String, required: true },
    room: { type: Number, default: 0 },
    kitchen: { type: Number, default: 0 },
    toilet: { type: Number, default: 0 },
    price: { type: Number, required: true },
    hasBalcony: { type: Boolean, required: true },
    hasDeposit: { type: Boolean, required: true },
    hasUpFront: { type: Boolean, required: true },
    images: [String],
    deposit: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
  },
  { timestamps: true }
)

const Rent = models.Rent || model('Rent', rentSchema)

export default Rent
