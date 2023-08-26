import { createSlice } from '@reduxjs/toolkit';

const initalState = {
  yourCart: [],
  allBooking: [],
  fareFamily: [],
  findBooking: [],
  chooseSeats: [],
  paymentForm: '',
  selectedMeal: [],
  searchFlight: [],
  reviewFlight: [],
  cancelFlight: [],
  prepareFlight: [],
  createBooking: [],
  modifyBooking: [],
  footerTC: false,
  updateCart: false,
  paymentStatus: '',
  modifyData: false,
  modifySeat: false,
  modifyMeal: false,
  modifyDates: false,
  selectedFlight: [],
  cookiesSettings: [],
  prepareFlightRef: [],
  selectSeatLater: false,
  modifyBookingSeats: [],
  prepareCancelFlight: [],
  exchangeCreateBooking: [],
  prepareExchangeFlight: [],
  modifyDataFromBooking: false,
  acceptTermsConditions: false,
  originToDestinationDates: [],
  destinationToOriginDates: [],
  prepareBookingModification: [],
  selectedFlightCodesWithDate: [],
};

const flightDetailsSlice = createSlice({
  name: 'flightDetails',
  initialState: initalState,
  reducers: {
    setYourCart: (state, action) => {
      state.yourCart = action.payload;
    },
    setFooterTC: (state, action) => {
      state.footerTC = action.payload;
    },
    setModifySeat: (state, action) => {
      state.modifySeat = action.payload;
    },
    setFareFamily: (state, action) => {
      state.fareFamily = action.payload;
    },
    setAllBooking: (state, action) => {
      state.allBooking = action.payload;
    },
    setModifyData: (state, action) => {
      state.modifyData = action.payload;
    },
    setModifyMeal: (state, action) => {
      state.modifyMeal = action.payload;
    },
    setModifyDates: (state, action) => {
      state.modifyDates = action.payload;
    },
    setUpdateCart: (state, action) => {
      state.updateCart = action.payload;
    },
    setSelectedMeal: (state, action) => {
      state.selectedMeal = action.payload;
    },
    setChooseSeatData: (state, action) => {
      state.chooseSeats = action.payload;
    },
    setCookiesSettings: (state, action) => {
      state.cookiesSettings = action.payload;
    },
    setPaymentFormData: (state, action) => {
      state.paymentForm = action.payload;
    },
    setFindBookingData: (state, action) => {
      state.findBooking = action.payload;
    },
    setCancelFlightData: (state, action) => {
      state.cancelFlight = action.payload;
    },
    setSearchFlightData: (state, action) => {
      state.searchFlight = action.payload;
    },
    setPrepareFlightRef: (state, action) => {
      state.prepareFlightRef = action.payload;
    },
    setReviewFlightData: (state, action) => {
      state.reviewFlight = action.payload;
    },
    setPaymentStatusData: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setModifyBookingData: (state, action) => {
      state.modifyBooking = action.payload;
    },
    setPrepareFlightData: (state, action) => {
      state.prepareFlight = action.payload;
    },
    setCreateBookingData: (state, action) => {
      state.createBooking = action.payload;
    },
    setSelectedFlightData: (state, action) => {
      state.selectedFlight = action.payload;
    },
    setSelectSeatLaterData: (state, action) => {
      state.selectSeatLater = action.payload;
    },
    setAcceptTermsConditions: (state, action) => {
      state.acceptTermsConditions = action.payload;
    },
    setModifyBookingSeatsData: (state, action) => {
      state.modifyBookingSeats = action.payload;
    },
    setPrepareCancelFlightData: (state, action) => {
      state.prepareCancelFlight = action.payload;
    },
    setModifyBookingFromBooking: (state, action) => {
      state.modifyDataFromBooking = action.payload;
    },
    setOriginToDestinationDates: (state, action) => {
      state.originToDestinationDates = action.payload;
    },
    setDestinationToOriginDates: (state, action) => {
      state.destinationToOriginDates = action.payload;
    },
    setExchangeCreateBookingData: (state, action) => {
      state.exchangeCreateBooking = action.payload;
    },
    setPrepareExchangeFlightData: (state, action) => {
      state.prepareExchangeFlight = action.payload;
    },
    setSelectedFlightCodesWithDate: (state, action) => {
      state.selectedFlightCodesWithDate = action.payload;
    },
    setPrepareBookingModificationData: (state, action) => {
      state.prepareBookingModification = action.payload;
    },
  },
});

export const {
  setYourCart,
  setFooterTC,
  setFareFamily,
  setModifyMeal,
  setModifySeat,
  setAllBooking,
  setUpdateCart,
  setModifyData,
  setModifyDates,
  setSelectedMeal,
  setChooseSeatData,
  setPaymentFormData,
  setFindBookingData,
  setCookiesSettings,
  setSearchFlightData,
  setCancelFlightData,
  setReviewFlightData,
  setPrepareFlightRef,
  setPaymentStatusData,
  setPrepareFlightData,
  setCreateBookingData,
  setModifyBookingData,
  setSelectedFlightData,
  setSelectSeatLaterData,
  setAcceptTermsConditions,
  setModifyBookingSeatsData,
  setPrepareCancelFlightData,
  setModifyBookingFromBooking,
  setOriginToDestinationDates,
  setDestinationToOriginDates,
  setPrepareExchangeFlightData,
  setExchangeCreateBookingData,
  setSelectedFlightCodesWithDate,
  setPrepareBookingModificationData,
} = flightDetailsSlice.actions;
export default flightDetailsSlice.reducer;
