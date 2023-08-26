import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setUpdateCart,
  setModifyMeal,
  setModifySeat,
  setModifyDates,
  setPaymentStatusData,
  setModifyBookingFromBooking,
} from 'src/redux/reducer/FlightDetails';
import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import PaymentGatewayLoader from '../Loader/PaymentGateway';
import { postCreateTicket } from 'src/redux/action/SearchFlights';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';
import { fieldsWithCode } from 'components/PassengerDetails/FieldsData';

const PaymentProcess = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const storedPassengerData = useSelector(
    (state: RootState) => state?.passenger?.passengersData?.details
  );
  const modifyDataFromBooking = useSelector(
    (state: RootState) => state?.flightDetails?.modifyDataFromBooking
  );
  const modifySeat = useSelector((state: RootState) => state?.flightDetails?.modifySeat);
  const modifyBookingSeats = useSelector(
    (state: RootState) => state?.flightDetails?.modifyBookingSeats
  );
  const createExchangeBookingInfo = useSelector(
    (state: RootState) => state?.flightDetails?.exchangeCreateBooking
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const passengerDetails = useSelector(
    (state: RootState) =>
      modifySeat
        ? state?.flightDetails?.prepareBookingModification?.Passengers?.map(
            (item: { NameElement: { Firstname: string; Surname: string } }, index: number) => {
              const otherFields = Object.fromEntries(
                state?.flightDetails?.prepareBookingModification?.PassengersDetails[
                  index
                ]?.fields.map((dt: { Code: string; Text: string }) => [
                  fieldsWithCode?.find((item1) => item1?.Code === dt?.Code)?.name,
                  dt.Text,
                ])
              );
              return {
                ...item?.NameElement,
                ...otherFields,
              };
            }
          )
        : // ?.map(({ undefined: {}, ...rest }) => ({ ...rest }))
          state?.flightDetails?.prepareExchangeFlight?.Passengers?.map(
            (item: { NameElement: { Firstname: string; Surname: string } }, index: number) => {
              const otherFields = Object.fromEntries(
                state?.flightDetails?.prepareExchangeFlight?.PassengersDetails[index]?.fields.map(
                  (dt: { Code: string; Text: string }) => [
                    fieldsWithCode?.find((item1) => item1?.Code === dt?.Code)?.name,
                    dt.Text,
                  ]
                )
              );
              return {
                ...item?.NameElement,
                ...otherFields,
              };
            }
          )
    // ?.map(({ undefined: {}, ...rest }) => ({ ...rest }))
  );
  const modifyMeal = useSelector((state: RootState) => state?.flightDetails?.modifyMeal);
  const updateCart = useSelector((state: RootState) => state?.flightDetails?.updateCart);
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const modifyDates = useSelector((state: RootState) => state?.flightDetails?.modifyDates);
  const paymentContent = useSelector((state: RootState) => state?.sitecore?.payment?.fields);
  const paymentStatus = useSelector((state: RootState) => state?.flightDetails?.paymentStatus);
  const createBookingInfo = useSelector((state: RootState) => state?.flightDetails?.createBooking);

  const [createTicket, setCreateTicket] = useState(true);

  useEffect(() => {
    if (router.query.status !== undefined) {
      dispatch(
        loader({
          show: true,
          name: 'payment',
        })
      );
      dispatch(setPaymentStatusData(String(router.query.status)));
      router.replace(router.pathname);
      setTimeout(() => {
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      }, 3000);
    }
  }, [dispatch, router]);

  const PaymentSuccess = ({ code }: { code: number }) => {
    if (code === 2001 && createTicket) {
      dispatch(
        loader({
          show: true,
          name: 'payment',
        })
      );
      setCreateTicket(false);
      dispatch(
        postCreateTicket(
          {
            ID: modifySeat
              ? modifyBookingSeats?.PnrInformation?.PnrCode
              : !modifyData && !modifyDataFromBooking
              ? createBookingInfo?.PnrInformation?.PnrCode
              : createExchangeBookingInfo?.PnrInformation?.PnrCode,
            PassengerName: modifySeat
              ? passengerDetails && passengerDetails?.length > 0 && passengerDetails[0]
                ? passengerDetails[0]?.Surname
                : ''
              : !modifyData && !modifyDataFromBooking
              ? storedPassengerData && storedPassengerData?.length > 0 && storedPassengerData[0]
                ? storedPassengerData[0]?.Surname
                : ''
              : passengerDetails && passengerDetails?.length > 0 && passengerDetails[0]
              ? passengerDetails[0]?.Surname
              : '',
            Amount: modifySeat
              ? modifyBookingSeats?.Amount?.TotalAmount
              : !modifyData && !modifyDataFromBooking
              ? createBookingInfo?.Amount?.TotalAmount
              : createExchangeBookingInfo?.Amount?.TotalAmount,
          },
          router
        ) as unknown as AnyAction
      );
      modifySeat && dispatch(setModifySeat(false));
      updateCart && dispatch(setUpdateCart(false));
      modifyMeal && dispatch(setModifyMeal(false));
      modifyDates && dispatch(setModifyDates(false));
      modifyDataFromBooking && dispatch(setModifyBookingFromBooking(false));
    }
    return (
      <Fragment>
        <div className="flex justify-center items-center h-screen ">
          <div className="text-2xl text-green ml-5 mr-3">
            {code === 2001 ? (
              <div></div>
            ) : (
              <div>{getFieldName(paymentContent, 'successfullyAuthorized')}</div>
            )}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <div>
      {!load?.show ? (
        <div>
          {paymentStatus?.length > 0 && (paymentStatus === '2001' || paymentStatus === '2000') && (
            <PaymentSuccess code={Number(paymentStatus)} />
          )}
        </div>
      ) : (
        <PaymentGatewayLoader open={load?.show} />
      )}
    </div>
  );
};

export default PaymentProcess;
