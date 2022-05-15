import mongoose from 'mongoose'
import MobileUser from './MobileUser'

const mobileProfileScheme = mongoose.Schema(
  {
    type: { type: String, enum: ['rider', 'driver'], required: true },
    name: String,
    image: String,
    plate: String,
    license: String,
    owner: String,
    approved: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MobileUser,
    },
    points: { type: Number, default: 0 },
    expiration: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const MobileProfile =
  mongoose.models.MobileProfile ||
  mongoose.model('MobileProfile', mobileProfileScheme)
export default MobileProfile
