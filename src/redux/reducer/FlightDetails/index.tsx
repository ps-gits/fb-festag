import { createSlice } from '@reduxjs/toolkit';

const initalState = {
  yourCart: [],
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
  paymentStatus: '',
  modifyData: false,
  modifySeat: false,
  selectedFlight: [],
  prepareFlightRef: [],
  selectSeatLater: false,
  modifyBookingSeats: [],
  prepareCancelFlight: [],
  exchangeCreateBooking: [],
  prepareExchangeFlight: [],
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
    setModifyData: (state, action) => {
      state.modifyData = action.payload;
    },
    setSelectedMeal: (state, action) => {
      state.selectedMeal = action.payload;
    },
    setChooseSeatData: (state, action) => {
      state.chooseSeats = action.payload;
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
  setModifySeat,
  setModifyData,
  setSelectedMeal,
  setChooseSeatData,
  setPaymentFormData,
  setFindBookingData,
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
  setOriginToDestinationDates,
  setDestinationToOriginDates,
  setPrepareExchangeFlightData,
  setExchangeCreateBookingData,
  setSelectedFlightCodesWithDate,
  setPrepareBookingModificationData,
} = flightDetailsSlice.actions;
export default flightDetailsSlice.reducer;
