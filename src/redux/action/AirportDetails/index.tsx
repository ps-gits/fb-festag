import axios from 'axios';
import { AnyAction, Dispatch } from 'redux';

import { loader } from '../../reducer/Loader';
import { url } from 'src/components/Api/ApiUrl';
import { getEligibleOriginToDestinations } from '../SearchFlights';
import { setOriginDetails, setDestinationDetails } from '../../reducer/AirportDetails';

export const getOriginDetails = () => (dispatch: Dispatch) => {
  axios
    .get(`${url}getOrigin`, {
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
      dispatch(setOriginDetails(res?.data?.data));
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

export const getDestinationDetails =
  (
    originCode: string,
    name?: string,
    destinationCode?: string,
    flightDetails?: {
      departDate: Date | string; //new-added
      returnDate: Date | string; //new-added
      adult: number;
      dateFlexible: boolean;
      children: number;
      originCode: string;
      destinationCode: string;
    },
    setFlightDetails?: (arg0: {
      departDate: string;
      returnDate: string;
      originCode: string;
      destinationCode: string;
      adult: number;
      dateFlexible: boolean;
      children: number;
    }) => void,
    errorMessage?: {
      departure: string;
      returnDate: string;
    },
    setErrorMessage?: (arg0: { departure: string; returnDate: string }) => void,
    setOpenSelectModal?: (arg0: boolean) => void
  ) =>
  (dispatch: Dispatch) => {
    axios
      .post(
        `${url}getDestinations`,
        {
          OriginCode: originCode,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then((res) => {
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
        dispatch(setDestinationDetails(res?.data?.data));
        if (name !== undefined) {
          const findDestination = res?.data?.data?.find(
            (item: { Code: string }) => item?.Code === destinationCode
          );
          setFlightDetails &&
            setFlightDetails({
              ...(flightDetails as {
                departDate: Date | string;
                returnDate: Date | string;
                adult: number;
                dateFlexible: boolean;
                children: number;
                originCode: string;
                destinationCode: string;
              }),
              departDate: '',
              returnDate: '',
              originCode: originCode as string,
              destinationCode:
                destinationCode !== undefined &&
                (destinationCode as string)?.length > 0 &&
                findDestination !== undefined
                  ? destinationCode
                  : '',
            });
          errorMessage?.departure?.length &&
            setErrorMessage &&
            setErrorMessage({
              ...errorMessage,
              departure: '',
            });
          setOpenSelectModal && setOpenSelectModal(false);
          document.body.style.overflow = 'unset';
          (destinationCode as string)?.length > 0 &&
            findDestination !== undefined &&
            dispatch(
              getEligibleOriginToDestinations(
                {
                  OriginCode: originCode,
                  DestinationCode: destinationCode as string,
                },
                true,
                name
              ) as unknown as AnyAction
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