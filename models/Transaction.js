import mongoose from 'mongoose'

const transactionScheme = mongoose.Schema(
  {
    mobileNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    paidDate: { type: String, required: true },
    expireDate: { type: String, required: true },
  },
  { timestamps: true }
)

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', transactionScheme)

export default Transaction
