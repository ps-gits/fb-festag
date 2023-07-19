import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  passengersData: [],
};

const passengerSlice = createSlice({
  name: 'passenger',
  initialState: initialState,
  reducers: {
    setPassengerDetails: (state, action) => {
      state.passengersData = action.payload;
    },
  },
});

export const { setPassengerDetails } = passengerSlice.actions;
export default passengerSlice.reducer;
