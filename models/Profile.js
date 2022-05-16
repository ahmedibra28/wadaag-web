import mongoose from 'mongoose'
import User from './User'

const profileScheme = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['rider', 'driver', 'administrator', 'temporary'],
      required: true,
    },
    name: String,
    image: String,
    plate: String,
    license: String,
    owner: String,
    approved: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    points: { type: Number, default: 0 },
    expiration: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Profile =
  mongoose.models.Profile || mongoose.model('Profile', profileScheme)
export default Profile
