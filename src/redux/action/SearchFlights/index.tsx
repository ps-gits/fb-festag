import axios from 'axios';
import { SetStateAction } from 'react';
import { NextRouter } from 'next/router';
import { AnyAction, Dispatch } from 'redux';

import {
  setModifyData,
  setFindBookingData,
  setPaymentFormData,
  setSearchFlightData,
  setPrepareFlightRef,
  setCancelFlightData,
  setModifyBookingData,
  setPrepareFlightData,
  setCreateBookingData,
  setSelectedFlightData,
  setModifyBookingSeatsData,
  setPrepareCancelFlightData,
  setDestinationToOriginDates,
  setOriginToDestinationDates,
  setPrepareExchangeFlightData,
  setExchangeCreateBookingData,
  setSelectedFlightCodesWithDate,
  setPrepareBookingModificationData,
} from '../../reducer/FlightDetails';
import { loader } from '../../reducer/Loader';
import { url } from 'src/components/Api/ApiUrl';

export const getEligibleOriginToDestinations =
  (
    originDestination: getEligibleOriginDestinationDates,
    editDate?: boolean,
    flightDetails?: {
      departDate: Date;
      returnDate: Date;
      adult: number;
      children: number;
      originCode: string;
      destinationCode: string;
    },
    setFlightDetails?: {
      (
        value: SetStateAction<{
          adult: number;
          children: number;
          promoCode: string;
          originCode: string;
          dateFlexible: boolean;
          destinationCode: string;
          departDate: Date;
          returnDate: Date;
        }>
      ): void;
      (arg0: {
        adult: number;
        children: number;
        promoCode: string;
        originCode: string;
        dateFlexible: boolean;
        destinationCode: string;
        departDate: Date;
        returnDate: Date;
      }): void;
    }
  ) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}getEligibleOriginDestinations`, originDestination, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
        dispatch(setOriginToDestinationDates(res?.data?.data));
        if (editDate && res?.data?.data && res?.data?.data?.length > 0) {
          const findFirstDepartDate = res?.data?.data?.find(
            (item: { TargetDate: string | number | Date }) =>
              new Date().valueOf() <= new Date(item.TargetDate).valueOf()
          );
          const targetDate = new Date(findFirstDepartDate?.TargetDate);
          const utcDate = new Date(
            targetDate.getUTCFullYear(),
            targetDate.getUTCMonth(),
            targetDate.getUTCDate(),
            targetDate.getUTCHours(),
            targetDate.getUTCMinutes(),
            targetDate.getUTCSeconds(),
            targetDate.getUTCMilliseconds()
          );
          setFlightDetails &&
            setFlightDetails({
              ...(flightDetails as {
                adult: number;
                children: number;
                promoCode: string;
                originCode: string;
                dateFlexible: boolean;
                destinationCode: string;
                departDate: Date;
                returnDate: Date;
              }),
              departDate: utcDate,
            });
        }
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const getEligibleDestinationsToOrigin =
  (originDestination: getEligibleOriginDestinationDates) => (dispatch: Dispatch) => {
    axios
      .post(`${url}getEligibleOriginDestinations`, originDestination, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
        dispatch(setDestinationToOriginDates(res?.data?.data));
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postSearchFlights =
  (flightDetails: searchFlights, navigate: boolean, fareFamily: string, router: NextRouter) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}searchFlight`, flightDetails, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        dispatch(setModifyData(false));
        navigate && router?.push('/flightavailability');
        dispatch(
          setSelectedFlightCodesWithDate({
            departDate: flightDetails?.OriginDestinations[0].TargetDate,
            originCode: flightDetails?.OriginDestinations[0]?.OriginCode,
            destinationCode: flightDetails?.OriginDestinations[0]?.DestinationCode,
            returnDate:
              flightDetails?.OriginDestinations?.length > 1
                ? flightDetails?.OriginDestinations[1].TargetDate
                : '',
            adult: flightDetails?.Passengers[0].PassengerQuantity,
            children:
              flightDetails?.Passengers?.length > 1
                ? flightDetails?.Passengers[1].PassengerQuantity
                : 0,
            dateFlexible: flightDetails?.DateFlexible,
          })
        );
        dispatch(setSearchFlightData(res?.data?.data));
        if (
          navigate &&
          flightDetails?.DateFlexible !== undefined &&
          !flightDetails?.DateFlexible &&
          fareFamily &&
          fareFamily?.length > 0
        ) {
          const findDetails =
            flightDetails?.OriginDestinations?.length > 1
              ? res?.data?.data[fareFamily?.toLowerCase()]?.find(
                  (item: { Otr: string; Dtr: string }) =>
                    item?.Otr?.split('T')[0] ===
                      flightDetails?.OriginDestinations[0].TargetDate.toJSON()?.split('T')[0] &&
                    item?.Dtr?.split('T')[0] ===
                      flightDetails?.OriginDestinations[1].TargetDate.toJSON()?.split('T')[0]
                )
              : res?.data?.data[fareFamily?.toLowerCase()]?.find(
                  (item: { Otr: string }) =>
                    item?.Otr?.split('T')[0] ===
                    flightDetails?.OriginDestinations[0].TargetDate.toJSON()?.split('T')[0]
                );
          dispatch(
            setSelectedFlightData({
              display: true,
              name: fareFamily,
              index: 0,
              details: findDetails,
            })
          );
        }
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postSearchExchangeFlights =
  (
    flightDetails: searchFlights,
    router: NextRouter,
    dateFlexible: boolean,
    fareFamilyName?: string,
    fareFamilyValue?: string
  ) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}searchExchangeFlight`, flightDetails, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        dispatch(setModifyData(true));
        dateFlexible ? router.push('/flightavailability') : router.push('/reviewchange');
        if (
          !dateFlexible &&
          fareFamilyName &&
          fareFamilyName?.length > 0 &&
          res?.data?.data[fareFamilyName]?.length > 0
        ) {
          const findDetails =
            flightDetails?.OriginDestinations?.length > 1
              ? res?.data?.data[fareFamilyName]?.find(
                  (item: { Otr: string; Dtr: string }) =>
                    item?.Otr?.split('T')[0] ===
                      flightDetails?.OriginDestinations[0]?.TargetDate.toJSON()?.split('T')[0] &&
                    item?.Dtr?.split('T')[0] ===
                      flightDetails?.OriginDestinations[1]?.TargetDate.toJSON()?.split('T')[0]
                )
              : res?.data?.data[fareFamilyName]?.find(
                  (item: { Otr: string }) =>
                    item?.Otr?.split('T')[0] ===
                    flightDetails?.OriginDestinations[0]?.TargetDate.toJSON()?.split('T')[0]
                );
          dispatch(
            setSelectedFlightData({
              display: true,
              name: fareFamilyValue,
              index: 0,
              details: findDetails,
            })
          );
          dispatch(
            postPrepareExchangeFlights(
              {
                PassangerLastname: flightDetails?.PassangerLastname,
                PnrCode: flightDetails?.PnrCode,
                RefItinerary:
                  findDetails !== undefined && Object.keys(findDetails).length > 0
                    ? findDetails?.RefItinerary
                    : '',
                Ref:
                  findDetails !== undefined && Object.keys(findDetails).length > 0
                    ? findDetails?.Ref
                    : '',
                FareFamily: fareFamilyValue as string,
              },
              router
            ) as unknown as AnyAction
          );
        } else {
          dispatch(setSelectedFlightData([]));
        }
        dispatch(setSearchFlightData(res?.data?.data));
        dispatch(
          setSelectedFlightCodesWithDate({
            departDate: flightDetails?.OriginDestinations[0].TargetDate,
            originCode: flightDetails?.OriginDestinations[0]?.OriginCode,
            destinationCode: flightDetails?.OriginDestinations[0]?.DestinationCode,
            returnDate:
              flightDetails?.OriginDestinations?.length > 1
                ? flightDetails?.OriginDestinations[1].TargetDate
                : '',
            adult: flightDetails?.Passengers[0].PassengerQuantity,
            children:
              flightDetails?.Passengers?.length > 1
                ? flightDetails?.Passengers[1].PassengerQuantity
                : 0,
            dateFlexible: flightDetails?.DateFlexible,
          })
        );
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postPrepareFlights =
  (data: postPrepareFlight, router: NextRouter) => (dispatch: Dispatch) => {
    axios
      .post(`${url}prepareFlights`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/passengerdetails');
        dispatch(setPrepareFlightRef(data));
        dispatch(setPrepareFlightData(res?.data?.data));
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postPrepareExchangeFlights =
  (data: postPrepareFlight, router: NextRouter) => (dispatch: Dispatch) => {
    axios
      .post(`${url}prepareExchangeFlights`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/reviewchange');
        dispatch(setPrepareFlightRef(data));
        dispatch(setPrepareExchangeFlightData(res?.data?.data));
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postCreateBooking =
  (data: postCreateBooking, router: NextRouter, cpd_code: string) => (dispatch: Dispatch) => {
    axios
      .post(`${url}createBooking`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/reviewtrip');
        dispatch(setCreateBookingData(res?.data?.data));
        res?.data?.data?.Amount?.TotalAmount &&
          dispatch(
            postPaymentAmount({
              amount: +res?.data?.data?.Amount?.TotalAmount,
              PnrCode: res?.data?.data?.PnrInformation?.PnrCode,
              cpd_code: cpd_code,
            }) as unknown as AnyAction
          );
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postExchangeCreateBooking =
  (data: postCreateBooking, router: NextRouter, cpd_code: string) => (dispatch: Dispatch) => {
    axios
      .post(`${url}exchangeCreateBooking`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/reviewchange');
        dispatch(setExchangeCreateBookingData(res?.data?.data));
        res?.data?.data?.Amount?.TotalAmount &&
          dispatch(
            postPaymentAmount({
              amount: +res?.data?.data?.Amount?.TotalAmount,
              PnrCode: res?.data?.data?.PnrInformation?.PnrCode,
              cpd_code: cpd_code,
            }) as unknown as AnyAction
          );
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postModifyBookingSeats =
  (data: postCreateBooking, router: NextRouter, cpd_code?: string) => (dispatch: Dispatch) => {
    axios
      .post(`${url}modifyBooking`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/reviewchange');
        dispatch(setModifyBookingSeatsData(res?.data?.data));
        res?.data?.data?.Amount?.TotalAmount &&
          dispatch(
            postPaymentAmount({
              amount: +res?.data?.data?.Amount?.TotalAmount,
              PnrCode: res?.data?.data?.PnrInformation?.PnrCode,
              cpd_code: cpd_code ? cpd_code : '',
            }) as unknown as AnyAction
          );
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postModifyBooking =
  (bookingDetails: { ID: string; PassengerName: string; PnrCode: string }, router: NextRouter) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}LoadBooking`, bookingDetails, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/modifybooking');
        dispatch(setModifyData(true));
        dispatch(setFindBookingData(bookingDetails));
        dispatch(setModifyBookingData(res?.data?.data));
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postCreateTicket =
  (createTicket: postCreateTicket, router: NextRouter) => (dispatch: Dispatch) => {
    axios
      .post(`${url}createTicket`, createTicket, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/bookingcomplete');
        dispatch(
          setFindBookingData({
            TypeCode: 'PnrCode',
            ID: createTicket?.ID,
            PassengerName: createTicket?.PassengerName,
          })
        );
        dispatch(setModifyBookingData(res?.data?.data));
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postPrepareCancelFlight =
  (
    cancelTicket: {
      PnrCode: string;
      PassengerName: string;
    },
    router: NextRouter
  ) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}prepareCancelBooking`, cancelTicket, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/cancelbooking');
        dispatch(setPrepareCancelFlightData(res?.data?.data));
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postCancelFlight =
  (
    cancelTicket: {
      PnrCode: string;
      PassengerName: string;
    },
    router: NextRouter
  ) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}cancelBooking`, cancelTicket, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        router.push('/cancelsuccess');
        dispatch(setCancelFlightData(res?.data?.data));
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };

export const postPaymentAmount =
  (data: { amount: number; PnrCode: string; cpd_code: string }) => (dispatch: Dispatch) => {
    axios
      .post(`${url}paymentRequest`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => dispatch(setPaymentFormData(res?.data?.data?.html)));
  };

export const postPrepareBookingModification =
  (bookingData: { ID: string; PassengerName: string; TypeCode: string }) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}prepareBookingModification`, bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        dispatch(setPrepareBookingModificationData(res?.data?.data));
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
      })
      .catch((err) => {
        console.warn(err);
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      });
  };
