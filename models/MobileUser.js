import mongoose from 'mongoose'

const mobileUserScheme = mongoose.Schema(
  {
    mobile: { type: String, required: true, unique: true },
    otp: String,
    otpExpire: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

mobileUserScheme.methods.getRandomOtp = function () {
  const resetToken = Math.floor(Math.random() * 1000000)
  this.otp = resetToken.toString()
  this.otpExpire = Date.now() + 10 * (60 * 1000) // Ten Minutes

  return resetToken
}

const MobileUser =
  mongoose.models.MobileUser || mongoose.model('MobileUser', mobileUserScheme)
export default MobileUser
