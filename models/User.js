import mongoose from 'mongoose'

const userScheme = mongoose.Schema(
  {
    name: String,
    mobileNumber: { type: Number, required: true, unique: true },
    blocked: { type: Boolean, default: false },
    otp: String,
    otpExpire: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

userScheme.methods.getRandomOtp = function () {
  const resetToken = Math.floor(Math.random() * 1000000)
  this.otp = resetToken.toString()
  this.otpExpire = Date.now() + 10 * (60 * 1000) // Ten Minutes

  return resetToken
}

const User = mongoose.models.User || mongoose.model('User', userScheme)
export default User
