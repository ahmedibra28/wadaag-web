import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  from: '',
  to: '',
  distance: '',
  duration: '',
  directionsResponse: null,
  plate: '',
  _id: '',
}

export const trip = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    startTrip: (state, { payload }) => {
      state.from = payload.from
      state.to = payload.to
      state.distance = payload.distance
      state.duration = payload.duration
      state.directionsResponse = payload.directionsResponse
    },
    plateConfirmation: (state, { payload }) => {
      state.plate = payload.plate
      state._id = payload._id
    },
    cancelTrip: (state) => {
      state.from = ''
      state.to = ''
      state.distance = ''
      state.duration = ''
      state.directionsResponse = null
      state.plate = ''
      state._id = ''
    },
  },
})

export const { startTrip, plateConfirmation, cancelTrip } = trip.actions

export default trip.reducer
