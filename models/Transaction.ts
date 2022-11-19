import { Schema, model, models } from 'mongoose'

export interface ITransaction {
  _id: Schema.Types.ObjectId
  mobile: number
  amount: number
  paidDate: Date
  expireDate: Date
  createdAt?: Date
}

const transactionSchema = new Schema<ITransaction>(
  {
    mobile: { type: Number, required: true },
    amount: { type: Number, required: true },
    paidDate: { type: Date, required: true },
    expireDate: { type: Date, required: true },
  },
  { timestamps: true }
)

const Transaction =
  models.Transaction || model('Transaction', transactionSchema)

export default Transaction