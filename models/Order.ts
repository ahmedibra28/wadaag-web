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
  cost: number
  price: number
  quantity: number
  createdAt?: Date
}

const orderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: User },
    owner: { type: Schema.Types.ObjectId, ref: MarketUser },
    product: { type: Schema.Types.ObjectId, ref: Product },
    transaction: { type: Schema.Types.ObjectId, ref: Transaction },
    name: String,
    cost: Number,
    price: Number,
    quantity: Number,
  },
  { timestamps: true }
)

const Order = models.Order || model('Order', orderSchema)

export default Order
