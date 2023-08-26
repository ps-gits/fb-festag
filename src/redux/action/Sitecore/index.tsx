import axios from 'axios';
import { Dispatch } from 'redux';

import {
  setHeader,
  setLoader,
  setCookies,
  setPayment,
  setStepInfo,
  setDateModal,
  setChooseMeal,
  setChooseSeat,
  setReviewTrip,
  setCancelModal,
  setFindBooking,
  setSearchFlight,
  setCommonImages,
  setSearchAirport,
  setCreateAccount,
  setCancelSuccess,
  setPassengerModal,
  setPromoCodeModal,
  setBookingComplete,
  setTermsConditions,
  setPassengerDetails,
  setLandingPageSearch,
  setFlightAvailablity,
  setModifyBookingModal,
  setCompareFareFamilies,
} from 'src/redux/reducer/Sitecore';
import { graphQLToken, graphQLUrl } from 'components/Api/ApiUrl';

export const getSitecoreContent = (folderName: string) => (dispatch: Dispatch) => {
  axios
    .post(
      `${graphQLUrl}`,
      {
        query: `{\n  item(path: "/sitecore/content/flight-booking/flight-booking/Home/Data/${folderName}", language: "EN") {\n    name\n    fields {\n      id(format: "B")\n      name\n      value\n      jsonValue\n    }\n  }\n}\n`,
      },
      {
        headers: {
          'x-gql-token': graphQLToken,
        },
      }
    )
    .then((res) => {
      folderName === 'Flight-Availability'
        ? dispatch(setFlightAvailablity(res?.data?.data?.item))
        : folderName === 'Passenger-Modal'
        ? dispatch(setPassengerModal(res?.data?.data?.item))
        : folderName === 'Booking-Complete'
        ? dispatch(setBookingComplete(res?.data?.data?.item))
        : folderName === 'Cancel-Modal'
        ? dispatch(setCancelModal(res?.data?.data?.item))
        : folderName === 'Cancel-Success'
        ? dispatch(setCancelSuccess(res?.data?.data?.item))
        : folderName === 'Choose-Seat'
        ? dispatch(setChooseSeat(res?.data?.data?.item))
        : folderName === 'Common-Images'
        ? dispatch(setCommonImages(res?.data?.data?.item))
        : folderName === 'Compare-Fare-Families'
        ? dispatch(setCompareFareFamilies(res?.data?.data?.item))
        : folderName === 'Date-Modal'
        ? dispatch(setDateModal(res?.data?.data?.item))
        : folderName === 'Find-Booking'
        ? dispatch(setFindBooking(res?.data?.data?.item))
        : folderName === 'Loader'
        ? dispatch(setLoader(res?.data?.data?.item))
        : folderName === 'Modify-Booking-Modal'
        ? dispatch(setModifyBookingModal(res?.data?.data?.item))
        : folderName === 'Passenger-Details'
        ? dispatch(setPassengerDetails(res?.data?.data?.item))
        : folderName === 'Review-Trip'
        ? dispatch(setReviewTrip(res?.data?.data?.item))
        : folderName === 'Search-Airport'
        ? dispatch(setSearchAirport(res?.data?.data?.item))
        : folderName === 'Step-Info'
        ? dispatch(setStepInfo(res?.data?.data?.item))
        : folderName === 'Payment'
        ? dispatch(setPayment(res?.data?.data?.item))
        : folderName === 'Promocode-Modal'
        ? dispatch(setPromoCodeModal(res?.data?.data?.item))
        : folderName === 'LandingPage-Search'
        ? dispatch(setLandingPageSearch(res?.data?.data?.item))
        : folderName === 'Header'
        ? dispatch(setHeader(res?.data?.data?.item))
        : folderName === 'Terms-Conditions'
        ? dispatch(setTermsConditions(res?.data?.data?.item))
        : folderName === 'Create-Account'
        ? dispatch(setCreateAccount(res?.data?.data?.item))
        : dispatch(setSearchFlight(res?.data?.data?.item));
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const getSitecoreData = (folderName: string) => (dispatch: Dispatch) => {
  axios
    .post(
      `${graphQLUrl}`,
      {
        query: `{\n  item(path: "/sitecore/content/flight-booking/flight-booking/Data/${folderName}", language: "EN") {\n    name\n    fields {\n      id(format: "B")\n      name\n      value\n      jsonValue\n    }\n  }\n}\n`,
      },
      {
        headers: {
          'x-gql-token': graphQLToken,
        },
      }
    )
    .then((res) => {
      folderName === 'Cookies'
        ? dispatch(setCookies(res?.data?.data?.item))
        : dispatch(setChooseMeal(res?.data?.data?.item));
    })
    .catch((err) => {
      console.warn(err);
    });
};
