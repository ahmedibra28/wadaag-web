import mongoose from 'mongoose'
import User from './User'

const profileScheme = mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ['rider', 'driver', 'admin'],
      required: true,
    },
    name: String,
    image: String,
    plate: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
    },
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
