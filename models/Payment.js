import mongoose from 'mongoose'

const paymentScheme = mongoose.Schema(
  {
    mobileNumber: { type: String, required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'MERCHANT' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const Payment =
  mongoose.models.Payment || mongoose.model('Payment', paymentScheme)
export default Payment
