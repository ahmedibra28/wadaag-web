import mongoose from 'mongoose'
import User from './User'

const profileScheme = mongoose.Schema(
  {
    isRider: { type: Boolean, default: false },
    name: String,
    image: String,
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
