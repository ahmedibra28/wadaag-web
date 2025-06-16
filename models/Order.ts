import { Schema, model, models } from 'mongoose'
import User, { IUser } from './User'
import Product, { IProduct } from './Product'
import Transaction, { ITransaction } from './Transaction'
import MarketUser, { IMarketUser } from './MarketUser'

export interface IOrder {
  _id: Schema.Types.ObjectId
  customer: IUser
  owner: IMarketUser
  product: IProduct
  transaction: ITransaction
  name: string
  color?: string
  size?: string
  cost: number
  price: number
  quantity: number
  createdAt?: Date
  transactionId?: string
  variants?: { color?: string; size?: string }[]
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered'
  address?: string
}

const orderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: User, required: true },
    owner: { type: Schema.Types.ObjectId, ref: MarketUser, required: true },
    product: { type: Schema.Types.ObjectId, ref: Product, required: true },
    transaction: { type: Schema.Types.ObjectId, ref: Transaction },
    name: String,
    color: String,
    size: String,
    cost: Number,
    price: Number,
    quantity: Number,
    transactionId: String,
    variants: [{ color: String, size: String }],
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed', 'preparing', 'delivered'],
    },
    address: String,
  },
  { timestamps: true }
)

const Order = models.Order || model('Order', orderSchema)

export default Order
