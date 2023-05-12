import { Schema, model, models } from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export interface IUser {
  _id: Schema.Types.ObjectId
  name: string
  email?: string
  password?: string | undefined
  resetPasswordToken?: string
  resetPasswordExpire?: string
  confirmed: boolean
  blocked: boolean
  createdAt?: Date
  mobile?: number
  otp?: string
  otpExpire?: Date
  platform: 'web' | 'mobile'
  status: 'active' | 'deleted'
  pushToken: string
  allowsNotification: boolean
}

const userSchema = new Schema<IUser>(
  {
    platform: { type: String, enum: ['web', 'mobile'], default: 'web' },
    name: { type: String, required: true },
    email: { type: String, lowercase: true },
    mobile: { type: Number },
    password: { type: String },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: String,
    otpExpire: Date,
    confirmed: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },

    pushToken: String,
    allowsNotification: { type: Boolean, default: true },
  },
  { timestamps: true }
)

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.encryptPassword = async function (password: string) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password as any, salt)
})

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000) // Ten Minutes

  return resetToken
}

userSchema.methods.getRandomOtp = function () {
  let resetToken = Math.floor(Math.random() * 10000)
  resetToken =
    resetToken.toString().length !== 4
      ? Math.floor(Math.random() * 10000)
      : resetToken

  this.otp = resetToken.toString()
  this.otpExpire = Date.now() + 10 * (60 * 1000) // Ten Minutes
  return resetToken
}

const User = models.User || model('User', userSchema)

export default User
