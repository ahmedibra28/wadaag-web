import mongoose from 'mongoose'
import User from './User'

const profileScheme = mongoose.Schema(
  {
    isRider: { type: Boolean, default: false },
    name: String,
    image: String,
    plate: String,
    license: String,
    points: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    profileCompleted: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
)

const Profile =
  mongoose.models.Profile || mongoose.model('Profile', profileScheme)
export default Profile
