import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loader: [],
  header: [],
  footer: [],
  payment: [],
  cookies: [],
  stepInfo: [],
  dateModal: [],
  chooseSeat: [],
  reviewTrip: [],
  cancelModal: [],
  findBooking: [],
  newsInDetail: [],
  commonImages: [],
  searchFlight: [],
  searchAirport: [],
  cancelSuccess: [],
  promoCodeModal: [],
  passengerModal: [],
  bookingComplete: [],
  termsConditions: [],
  passengerDetails: [],
  landingPageSearch: [],
  flightAvailablity: [],
  furtherInformation: [],
  modifyBookingModal: [],
  compareFareFamilies: [],
  readNewsInDetails: false,
};

const sitecoreSlice = createSlice({
  name: 'sitecore',
  initialState: initialState,
  reducers: {
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    setHeader: (state, action) => {
      state.header = action.payload;
    },
    setFooter: (state, action) => {
      state.footer = action.payload;
    },
    setPayment: (state, action) => {
      state.payment = action.payload;
    },
    setCookies: (state, action) => {
      state.cookies = action.payload;
    },
    setStepInfo: (state, action) => {
      state.stepInfo = action.payload;
    },
    setDateModal: (state, action) => {
      state.dateModal = action.payload;
    },
    setReviewTrip: (state, action) => {
      state.reviewTrip = action.payload;
    },
    setChooseSeat: (state, action) => {
      state.chooseSeat = action.payload;
    },
    setCancelModal: (state, action) => {
      state.cancelModal = action.payload;
    },
    setFindBooking: (state, action) => {
      state.findBooking = action.payload;
    },
    setNewsInDetail: (state, action) => {
      state.newsInDetail = action.payload;
    },
    setCommonImages: (state, action) => {
      state.commonImages = action.payload;
    },
    setSearchFlight: (state, action) => {
      state.searchFlight = action.payload;
    },
    setSearchAirport: (state, action) => {
      state.searchAirport = action.payload;
    },
    setCancelSuccess: (state, action) => {
      state.cancelSuccess = action.payload;
    },
    setPromoCodeModal: (state, action) => {
      state.promoCodeModal = action.payload;
    },
    setPassengerModal: (state, action) => {
      state.passengerModal = action.payload;
    },
    setTermsConditions: (state, action) => {
      state.termsConditions = action.payload;
    },
    setBookingComplete: (state, action) => {
      state.bookingComplete = action.payload;
    },
    setPassengerDetails: (state, action) => {
      state.passengerDetails = action.payload;
    },
    setLandingPageSearch: (state, action) => {
      state.landingPageSearch = action.payload;
    },
    setReadNewsInDetails: (state, action) => {
      state.readNewsInDetails = action.payload;
    },
    setFlightAvailablity: (state, action) => {
      state.flightAvailablity = action.payload;
    },
    setFurtherInformation: (state, action) => {
      state.furtherInformation = action.payload;
    },
    setModifyBookingModal: (state, action) => {
      state.modifyBookingModal = action.payload;
    },
    setCompareFareFamilies: (state, action) => {
      state.compareFareFamilies = action.payload;
    },
  },
});

export const {
  setLoader,
  setFooter,
  setHeader,
  setPayment,
  setCookies,
  setStepInfo,
  setDateModal,
  setChooseSeat,
  setReviewTrip,
  setCancelModal,
  setFindBooking,
  setCommonImages,
  setNewsInDetail,
  setSearchFlight,
  setCancelSuccess,
  setSearchAirport,
  setPromoCodeModal,
  setPassengerModal,
  setTermsConditions,
  setBookingComplete,
  setPassengerDetails,
  setReadNewsInDetails,
  setFlightAvailablity,
  setLandingPageSearch,
  setModifyBookingModal,
  setFurtherInformation,
  setCompareFareFamilies,
} = sitecoreSlice.actions;
export default sitecoreSlice.reducer;
