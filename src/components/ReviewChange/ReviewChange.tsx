import Image from 'next/image';
import { useEffect } from 'react';
import { AnyAction } from 'redux';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import SavingDataLoader from '../Loader/SavingData';
import SearchSeatLoader from '../Loader/SearchSeat';
import FlightSchedule from '../ReviewTrip/FlightSchedule';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const ReviewChange = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const reviewChangeContent = useSelector(
    (state: RootState) => state?.sitecore?.reviewTrip?.fields
  );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const modifyBookingSeats = useSelector(
    (state: RootState) => state?.flightDetails?.modifyBookingSeats
  );
  const createExchangeBookingInfo = useSelector(
    (state: RootState) => state?.flightDetails?.exchangeCreateBooking
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const passengerDetails = useSelector(
    (state: RootState) => state?.flightDetails?.prepareExchangeFlight?.Passengers
  );
  const modifySeat = useSelector((state: RootState) => state?.flightDetails?.modifySeat);
  const paymentForm = useSelector((state: RootState) => state?.flightDetails?.paymentForm);
  const chooseSeats = useSelector((state: RootState) => state?.flightDetails?.chooseSeats);
  const selectedFlight = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const selectSeatLater = useSelector((state: RootState) => state?.flightDetails?.selectSeatLater);
  const chooseSeatsContent = useSelector((state: RootState) => state?.sitecore?.chooseSeat?.fields);

  useEffect(() => {
    if (chooseSeatsContent === undefined) {
      dispatch(getSitecoreContent('Choose-Seat') as unknown as AnyAction);
    }
  }, [chooseSeatsContent, dispatch]);

  const cityCodes = modifyBookingSeats?.OriginDestination?.find(
    (item: { OriginCode: string; DestinationCode: string }) =>
      item && item?.OriginCode !== undefined && item?.DestinationCode !== undefined
  );

  const TotalPrice = () => {
    return (
      <div className="bg-white p-3 rounded-lg">
        <div className="flex justify-between my-1">
          <p className="text-slategray text-base font-medium">
            {getFieldName(reviewChangeContent, 'numberOfPassengers')}
          </p>
          <p className="font-black text-base text-black">
            {modifySeat
              ? (modifyBookingSeats?.Passengers?.Adult
                  ? modifyBookingSeats?.Passengers?.Adult
                  : 1) +
                (modifyBookingSeats?.Passengers?.Children
                  ? modifyBookingSeats?.Passengers?.Children
                  : 0)
              : passengerDetails?.length}
          </p>
        </div>
        <div className="flex justify-between my-1">
          <p className="text-slategray text-base font-medium">
            {getFieldName(reviewChangeContent, 'totalPrice')}
          </p>
          <p className="font-black text-base text-black">
            {(selectedFlight?.details?.currency ? selectedFlight?.details?.currency : '') +
              ' ' +
              (modifySeat
                ? modifyBookingSeats?.Amount?.TotalAmount
                  ? modifyBookingSeats?.Amount?.TotalAmount
                  : ''
                : !selectSeatLater && chooseSeats?.length === 0
                ? selectedFlight?.details?.TotalAmount
                  ? selectedFlight?.details?.TotalAmount
                  : ''
                : createExchangeBookingInfo?.Amount?.TotalAmount
                ? createExchangeBookingInfo?.Amount?.TotalAmount
                : '')}
          </p>
        </div>
        {!selectSeatLater && chooseSeats?.length === 0 ? (
          <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
            <div className="flex md:flex block h-full items-center justify-center relative gap-3 py-3 xs:w-full  ">
              <button
                type="button"
                className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 "
              >
                {getFieldName(reviewChangeContent, 'editDatesButton')}
              </button>
              <button
                type="button"
                className="xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12"
                onClick={() => {
                  dispatch(
                    loader({
                      name: 'seats',
                      show: true,
                    })
                  );
                  router.push('/chooseseats');
                  setTimeout(() => {
                    dispatch(
                      loader({
                        name: '',
                        show: false,
                      })
                    );
                  }, 1000);
                }}
              >
                {getFieldName(reviewChangeContent, 'chooseSeatsButton')}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
            <button
              type="submit"
              form="hpp"
              disabled={
                (modifySeat ? modifyBookingSeats : createExchangeBookingInfo)?.Amount
                  ?.TotalAmount === undefined
              }
              className={`w-full xs:justify-center  xs:text-center text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center ${
                (modifySeat ? modifyBookingSeats : createExchangeBookingInfo)?.Amount
                  ?.TotalAmount === undefined
                  ? 'opacity-40'
                  : ''
              }`}
            >
              {getFieldName(reviewChangeContent, 'confirmPayButton')}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {!load?.show ? (
        <div className="relative">
          <div className="xl:not-sr-only	xs:sr-only">
            <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
              <Image
                src={getImageSrc(searchFlightContent, 'desktopBanner') as string}
                className="xs:absolute  inset-0 h-full w-full object-cover"
                alt=""
                height={200}
                width={160}
              />
            </div>
            <div className="xl:not-sr-only	xs:sr-only">
              <div className="fixed top-10 right-3.5  xl:m-auto price-modal ">
                <div className="mt-14">
                  <TotalPrice />
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-24 xl:mt-0 xs:pt-20 ">
            <div className="xl:w-2/4 xl:m-auto xs:w-full ">
              <div className="flex justify-between items-center xl:py-0 xs:py-3">
                <div
                  className="xl:py-3  xs:py-0 cursor-pointer"
                  onClick={() => {
                    router.back();
                  }}
                >
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    aria-hidden="true"
                    className="text-black text-sm font-black h-4 w-4"
                  />
                  <span className="px-2 text-black text-sm font-black">
                    {getFieldName(reviewChangeContent, 'backButton')}
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-black">
                  {getFieldName(reviewChangeContent, 'reviewChanges')}
                </h1>
              </div>
              <div>
                <div className=" xs:block gap-2 py-3">
                  {(modifySeat
                    ? modifyBookingSeats?.OriginDestination
                    : selectedFlight?.details?.FaireFamilies
                  )?.map((item: selectedFareFamily, index: number) => {
                    return (
                      <div className="bg-white p-4  xl:w-full rounded-lg mb-4" key={index}>
                        <FlightSchedule
                          index={index}
                          seats={false}
                          loungeAccess={true}
                          luxuryPickup={true}
                          bagAllowances={item.BagAllowances}
                          originAirportName={item?.originName}
                          originCode={
                            index === 0
                              ? modifySeat
                                ? cityCodes?.OriginCode
                                : selectedFlight?.details?.OriginCode
                              : modifySeat
                              ? cityCodes?.DestinationCode
                              : selectedFlight?.details?.DestinationCode
                          }
                          destinationCode={
                            index === 0
                              ? modifySeat
                                ? cityCodes?.DestinationCode
                                : selectedFlight?.details?.DestinationCode
                              : modifySeat
                              ? cityCodes?.OriginCode
                              : selectedFlight?.details?.OriginCode
                          }
                          departureDate={item?.orginDepartureDate}
                          departureTime={item?.orginDepartureTime}
                          arrivalDate={item?.destinationArrivalDate}
                          arrivalTime={item?.destinationArrivalTime}
                          destinationAirportName={item?.destinationName}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="xs:not-sr-only	xl:sr-only">
              <div className="fixed w-full left-0 bottom-0 z-50">
                <div className="mt-6">
                  <TotalPrice />
                  <div className="hidden">
                    {paymentForm !== undefined && paymentForm?.length > 0 ? parse(paymentForm) : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : load?.name === 'seats' ? (
        <SearchSeatLoader open={load?.show} />
      ) : (
        load?.name === 'save' && <SavingDataLoader open={load?.show} />
      )}
    </>
  );
};

export default ReviewChange;
