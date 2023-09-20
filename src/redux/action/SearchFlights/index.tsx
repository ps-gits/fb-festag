import axios from 'axios';
import { SetStateAction } from 'react';
import { NextRouter } from 'next/router';
import { AnyAction, Dispatch } from 'redux';

import {
  setModifyMeal,
  setUpdateCart,
  setModifySeat,
  setFareFamily,
  setAllBooking,
  setModifyData,
  setModifyDates,
  setSelectedMeal,
  setChooseSeatData,
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
  setModifyBookingFromBooking,
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
    // flightDetails?: {
    //   departDate: Date | string; //new-added
    //   returnDate: Date | string; //new-added
    //   adult: number;
    //   children: number;
    //   originCode: string;
    //   destinationCode: string;
    // },
    // setFlightDetails?: {
    //   (
    //     value: SetStateAction<{
    //       adult: number;
    //       children: number;
    //       promoCode: string;
    //       originCode: string;
    //       dateFlexible: boolean;
    //       destinationCode: string;
    //       departDate: Date | string; //new-added
    //       returnDate: Date | string; //new-added
    //     }>
    //   ): void;
    //   (arg0: {
    //     adult: number;
    //     children: number;
    //     promoCode: string;
    //     originCode: string;
    //     dateFlexible: boolean;
    //     destinationCode: string;
    //     departDate: Date;
    //     returnDate: Date;
    //   }): void;
    // },
    tabName?: string
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
        dispatch(setOriginToDestinationDates(res?.data?.data));
        if (editDate && res?.data?.data && res?.data?.data?.length > 0) {
          // const findFirstDepartDate = res?.data?.data?.find(
          //   (item: { TargetDate: string | number | Date }) =>
          //     new Date().valueOf() <= new Date(item.TargetDate).valueOf()
          // );
          // const targetDate = new Date(findFirstDepartDate?.TargetDate);
          // const utcDate = new Date(
          //   targetDate.getUTCFullYear(),
          //   targetDate.getUTCMonth(),
          //   targetDate.getUTCDate(),
          //   targetDate.getUTCHours(),
          //   targetDate.getUTCMinutes(),
          //   targetDate.getUTCSeconds(),
          //   targetDate.getUTCMilliseconds()
          // );
          if (tabName === 'return') {
            dispatch(
              getEligibleDestinationsToOrigin(
                {
                  DestinationCode: originDestination?.OriginCode,
                  OriginCode: originDestination?.DestinationCode,
                },
                true
                // flightDetails,
                // setFlightDetails
                // targetDate,
                // utcDate
              ) as unknown as AnyAction
            );
          } else {
            dispatch(
              loader({
                show: false,
                name: '',
              })
            );
            // setFlightDetails &&
            //   setFlightDetails({
            //     ...(flightDetails as {
            //       adult: number;
            //       children: number;
            //       promoCode: string;
            //       originCode: string;
            //       dateFlexible: boolean;
            //       destinationCode: string;
            //       departDate: Date;
            //       returnDate: Date;
            //     }),
            //      departDate: utcDate,
            //   });
          }
        } else {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
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
  (
    originDestination: getEligibleOriginDestinationDates,
    editDate?: boolean
    // flightDetails?: {
    //   departDate: Date;
    //   returnDate: Date;
    //   adult: number;
    //   children: number;
    //   originCode: string;
    //   destinationCode: string;
    // },
    // setFlightDetails?: {
    //   (
    //     value: SetStateAction<{
    //       adult: number;
    //       children: number;
    //       promoCode: string;
    //       originCode: string;
    //       dateFlexible: boolean;
    //       destinationCode: string;
    //       departDate: Date;
    //       returnDate: Date;
    //     }>
    //   ): void;
    //   (arg0: {
    //     adult: number;
    //     children: number;
    //     promoCode: string;
    //     originCode: string;
    //     dateFlexible: boolean;
    //     destinationCode: string;
    //     departDate: Date;
    //     returnDate: Date;
    //   }): void;
    // }
    // departDate?: Date,
    // departDateToSet?: Date
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
        dispatch(setDestinationToOriginDates(res?.data?.data));
        if (editDate && res?.data?.data && res?.data?.data?.length > 0) {
          // const findFirstDepartDate = res?.data?.data?.find(
          //   (item: { TargetDate: string | number | Date }) =>
          //     (departDate as Date)?.valueOf() < new Date(item.TargetDate).valueOf()
          // );
          // const targetDate = new Date(findFirstDepartDate?.TargetDate);
          // const utcDate = new Date(
          //   targetDate.getUTCFullYear(),
          //   targetDate.getUTCMonth(),
          //   targetDate.getUTCDate(),
          //   targetDate.getUTCHours(),
          //   targetDate.getUTCMinutes(),
          //   targetDate.getUTCSeconds(),
          //   targetDate.getUTCMilliseconds()
          // );
          // setFlightDetails &&
          //   setFlightDetails({
          //     ...(flightDetails as {
          //       adult: number;
          //       children: number;
          //       promoCode: string;
          //       originCode: string;
          //       dateFlexible: boolean;
          //       destinationCode: string;
          //       departDate: Date;
          //       returnDate: Date;
          //     }),
          //     departDate: departDateToSet as Date,
          //     returnDate: utcDate,
          //   });
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
        dispatch(setModifyBookingFromBooking(false));
        navigate && router?.push('/flightavailability');
        dispatch(getFareFamilyDetails() as unknown as AnyAction);
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
        const findIndex =
          flightDetails?.OriginDestinations?.length > 1
            ? res?.data?.data[fareFamily?.toLowerCase()]?.findIndex(
                (item: object) => item === findDetails
              )
            : res?.data?.data[fareFamily?.toLowerCase()]?.findIndex(
                (item: object) => item === findDetails
              );
        dispatch(
          setSelectedFlightData({
            display: true,
            name: fareFamily,
            index: findIndex,
            details: findDetails,
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
        router.asPath !== '/bookingcomplete'
          ? (dispatch(setModifyData(true)), dispatch(setModifyBookingFromBooking(false)))
          : dispatch(setModifyBookingFromBooking(true));
        dispatch(setSelectedMeal([]));
        dispatch(setModifySeat(false));
        dispatch(setChooseSeatData([]));
        dateFlexible && dispatch(getFareFamilyDetails() as unknown as AnyAction);
        dateFlexible ? router.push('/flightavailability') : router.push('/reviewchange');
        const findDetails =
          flightDetails?.OriginDestinations?.length > 1
            ? res?.data?.data[fareFamilyName?.toLowerCase() as string]?.find(
                (item: { Otr: string; Dtr: string }) =>
                  item?.Otr?.split('T')[0] ===
                    flightDetails?.OriginDestinations[0]?.TargetDate.toJSON()?.split('T')[0] &&
                  item?.Dtr?.split('T')[0] ===
                    flightDetails?.OriginDestinations[1]?.TargetDate.toJSON()?.split('T')[0]
              )
            : res?.data?.data[fareFamilyName?.toLowerCase() as string]?.find(
                (item: { Otr: string }) =>
                  item?.Otr?.split('T')[0] ===
                  flightDetails?.OriginDestinations[0]?.TargetDate.toJSON()?.split('T')[0]
              );
        const findIndex =
          flightDetails?.OriginDestinations?.length > 1
            ? res?.data?.data[fareFamilyName?.toLowerCase() as string]?.findIndex(
                (item: object) => item === findDetails
              )
            : res?.data?.data[fareFamilyName?.toLowerCase() as string]?.findIndex(
                (item: object) => item === findDetails
              );
        dispatch(
          setSelectedFlightData({
            display: true,
            name: fareFamilyValue,
            index: findIndex,
            details: findDetails,
          })
        );
        if (
          !dateFlexible &&
          fareFamilyName &&
          fareFamilyName?.length > 0 &&
          res?.data?.data[fareFamilyName?.toLowerCase() as string]?.length > 0
        ) {
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
          setTimeout(() => {
            dispatch(
              loader({
                show: false,
                name: '',
              })
            );
          }, 1000);
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
  (
    data: postPrepareFlight,
    router: NextRouter,
    setShowToast?: {
      (value: SetStateAction<{ show: boolean; status: number; message: string }>): void;
      (arg0: { show: boolean; status: number; message: string }): void;
    }
  ) =>
  (dispatch: Dispatch) => {
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
        setShowToast &&
          setShowToast({
            show: true,
            status: err?.response?.status,
            message: err?.response?.data?.message?.message
              ? err?.response?.data?.message?.message
              : err?.response?.data?.message,
          });
      });
  };

export const postPrepareExchangeFlights =
  (
    data: postPrepareFlight,
    router: NextRouter,
    setShowToast?: {
      (value: SetStateAction<{ show: boolean; status: number; message: string }>): void;
      (arg0: { show: boolean; status: number; message: string }): void;
    }
  ) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}prepareExchangeFlights`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        dispatch(setModifyDates(true));
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
        setShowToast &&
          setShowToast({
            show: true,
            status: err?.response?.status,
            message: err?.response?.data?.message?.message
              ? err?.response?.data?.message?.message
              : err?.response?.data?.message,
          });
      });
  };

export const postCreateBooking =
  (
    data: postCreateBooking,
    router: NextRouter,
    cpd_code: string,
    setShowToast?: {
      (value: SetStateAction<{ show: boolean; status: number; message: string }>): void;
      (arg0: { show: boolean; status: number; message: string }): void;
    }
  ) =>
  (dispatch: Dispatch) => {
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
          res?.data?.data?.Amount?.TotalAmount !== null &&
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
        setShowToast &&
          setShowToast({
            show: true,
            status: err?.response?.status,
            message: err?.response?.data?.message?.message
              ? err?.response?.data?.message?.message
              : err?.response?.data?.message,
          });
      });
  };

export const postExchangeCreateBooking =
  (
    data: postCreateBooking,
    router: NextRouter,
    cpd_code: string,
    setShowToast?: {
      (value: SetStateAction<{ show: boolean; status: number; message: string }>): void;
      (arg0: { show: boolean; status: number; message: string }): void;
    }
  ) =>
  (dispatch: Dispatch) => {
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
          res?.data?.data?.Amount?.TotalAmount !== null &&
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
        setShowToast &&
          setShowToast({
            show: true,
            status: err?.response?.status,
            message: err?.response?.data?.message?.message
              ? err?.response?.data?.message?.message
              : err?.response?.data?.message,
          });
      });
  };

export const postModifyBookingSeats =
  (
    data: postCreateBooking,
    router: NextRouter,
    cpd_code: string,
    ancillaryUpdate?: boolean,
    setShowToast?: {
      (value: SetStateAction<{ show: boolean; status: number; message: string }>): void;
      (arg0: { show: boolean; status: number; message: string }): void;
    }
  ) =>
  (dispatch: Dispatch) => {
    axios
      .post(`${url}modifyBooking`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        if (
          res?.data?.data?.Amount?.TotalAmount !== null &&
          res?.data?.data?.Amount?.TotalAmount === 0
        ) {
          dispatch(
            postPrepareBookingModification({
              TypeCode: 'PnrCode',
              ID: data?.PnrCode as string,
              PassengerName: data?.PassengerName as string,
            }) as unknown as AnyAction
          );
          dispatch(setModifyMeal(false));
          dispatch(setModifySeat(false));
          router.push('/bookingcomplete');
          dispatch(setModifyBookingFromBooking(false));
          dispatch(setModifyBookingData(res?.data?.data));
        } else {
          router.push('/reviewchange');
          ancillaryUpdate && dispatch(setUpdateCart(true));
          dispatch(setModifyBookingSeatsData(res?.data?.data));
          res?.data?.data?.Amount?.TotalAmount &&
            res?.data?.data?.Amount?.TotalAmount !== null &&
            dispatch(
              postPaymentAmount({
                amount: +res?.data?.data?.Amount?.TotalAmount,
                PnrCode: res?.data?.data?.PnrInformation?.PnrCode,
                cpd_code: cpd_code ? cpd_code : '',
              }) as unknown as AnyAction
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
        setShowToast &&
          setShowToast({
            show: true,
            status: err?.response?.status,
            message: err?.response?.data?.message?.message
              ? err?.response?.data?.message?.message
              : err?.response?.data?.message,
          });
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
        dispatch(
          postPrepareBookingModification({
            TypeCode: 'PnrCode',
            ID: createTicket?.ID,
            PassengerName: createTicket?.PassengerName,
          }) as unknown as AnyAction
        );
        dispatch(setModifyBookingData(res?.data?.data));
      })
      .catch((err) => {
        console.warn(err);
        router.push(
          {
            pathname: '/bookingcomplete',
            query: { error: 'failed' },
          },
          '/bookingcomplete'
        );
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 2000);
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

export const getAllBooking = () => (dispatch: Dispatch) => {
  axios
    .get(`${url}users/bookingHistory/9201201`, {
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
      dispatch(setAllBooking(res?.data?.data));
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

export const getFareFamilyDetails = () => (dispatch: Dispatch) => {
  axios
    .get(`${url}compareFairFamily`, {
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
      dispatch(setFareFamily(res?.data?.data));
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