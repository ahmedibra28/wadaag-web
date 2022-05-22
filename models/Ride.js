import mongoose from 'mongoose'
import User from './User'

const rideScheme = mongoose.Schema(
  {
    riderOne: {
      rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
      from: { type: String, required: true },
      to: { type: String, required: true },
      distance: { type: String, required: true },
      duration: { type: String, required: true },
      directionsResponse: { type: Object, required: true },
      plate: { type: String, required: true },
    },

    riderTwo: {
      rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
      from: String,
      to: String,
      distance: String,
      duration: String,
      directionsResponse: Object,
      plate: String,
    },

    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

const Ride = mongoose.models.Ride || mongoose.model('Ride', rideScheme)
export default Ride
