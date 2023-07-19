import { createSlice } from '@reduxjs/toolkit';

const initalState = {
  originDetails: [],
  destinationDetails: [],
};

const airportDetailsSlice = createSlice({
  name: 'airportDetails',
  initialState: initalState,
  reducers: {
    setOriginDetails: (state, action) => {
      state.originDetails = action.payload;
    },
    setDestinationDetails: (state, action) => {
      state.destinationDetails = action.payload;
    },
  },
});

export const { setOriginDetails, setDestinationDetails } =
  airportDetailsSlice.actions;
export default airportDetailsSlice.reducer;
