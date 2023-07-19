import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loader: {
    show: false,
    name: '',
  },
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState: initialState,
  reducers: {
    loader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

export const { loader } = loaderSlice.actions;
export default loaderSlice.reducer;
