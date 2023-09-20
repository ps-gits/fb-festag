import { createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
const initialState = {
  signIn: [],
  familyDetails: [],
  createAccount: [],
  passengerUpdate: [],
  savedFamilyDetails: [],
  subscribedUserData: [],
};

const createAccountSlice = createSlice({
  name: 'createAccount',
  initialState: initialState,
  reducers: {
    setSignIn: (state, action) => {
      state.signIn = action.payload;
    },
    resetLogin() {
      storage.removeItem('persist:root');
    },
    setCreateAccount(state, action) {
      state.createAccount = action.payload;
    },
    setFamilyDetails: (state, action) => {
      state.familyDetails = action.payload;
    },
    setPassengerUpdate: (state, action) => {
      state.passengerUpdate = action.payload;
    },
    setSavedFamilyDetails: (state, action) => {
      state.savedFamilyDetails = action.payload;
    },
    setSubscribedUserData: (state, action) => {
      state.subscribedUserData = action.payload;
    },
  },
});

export const {
  setSignIn,
  resetLogin,
  setCreateAccount,
  setFamilyDetails,
  setPassengerUpdate,
  setSavedFamilyDetails,
  setSubscribedUserData,
} = createAccountSlice.actions;
export default createAccountSlice.reducer;