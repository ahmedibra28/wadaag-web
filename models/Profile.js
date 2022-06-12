import mongoose from 'mongoose'
import User from './User'

const profileScheme = mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ['rider', 'driver', 'user'],
      required: true,
    },
    name: String,
    image: String,
    plate: String,
    license: String,
    points: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
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
