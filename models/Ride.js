import mongoose from 'mongoose'
import User from './User'

const rideScheme = mongoose.Schema(
  {
    riderOne: [
      {
        rider: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
          required: true,
        },
        from: { type: String, required: true },
        to: { type: String, required: true },
        distance: { type: String, required: true },
        duration: { type: String, required: true },
        plate: { type: String, required: true },
      },
    ],
    riderTwo: [
      {
        rider: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        },
        from: { type: String, required: true },
        to: { type: String, required: true },
        distance: { type: String, required: true },
        duration: { type: String, required: true },
        plate: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
)

const Ride = mongoose.models.Ride || mongoose.model('Ride', rideScheme)
export default Ride
