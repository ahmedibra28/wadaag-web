import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  from: '',
  to: '',
  distance: '',
  duration: '',
  directionsResponse: null,
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
  },
})

export const { startTrip } = trip.actions

export default trip.reducer
