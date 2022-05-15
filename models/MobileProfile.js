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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MobileUser,
    },
  },
  { timestamps: true }
)

const MobileProfile =
  mongoose.models.MobileProfile ||
  mongoose.model('MobileProfile', mobileProfileScheme)
export default MobileProfile
