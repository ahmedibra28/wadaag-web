import { Schema, model, models } from 'mongoose'
import MarketUser, { IMarketUser } from './MarketUser'

export interface IProduct {
  _id: Schema.Types.ObjectId
  owner: IMarketUser
  name: string
  cost: number
  price: number
  quantity: number
  category: string
  images: string[]
  description?: string
  status: 'active' | 'deleted' | 'pending'

  createdAt?: Date
}

const productSchema = new Schema<IProduct>(
  {
    owner: { type: Schema.Types.ObjectId, ref: MarketUser },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    images: [String],
    description: String,
    status: {
      type: String,
      default: 'pending',
      enum: ['active', 'deleted', 'pending'],
    },
  },
  { timestamps: true }
)

const Product = models.Product || model('Product', productSchema)

export default Product
