import { Schema, model, models } from 'mongoose'

export interface ITransaction {
  _id: Schema.Types.ObjectId
  type: 'rent' | 'market'
  transactionId?: string
  mobile: number
  amount: number
  paidDate: Date
  expireDate: Date
  createdAt?: Date
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: ['rent', 'market'], required: true },
    mobile: { type: Number, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String },
    paidDate: { type: Date, required: true },
    expireDate: { type: Date, required: true },
  },
  { timestamps: true }
)

const Transaction =
  models.Transaction || model('Transaction', transactionSchema)

export default Transaction
