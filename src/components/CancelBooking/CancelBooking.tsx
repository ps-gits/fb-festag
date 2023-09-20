import Image from 'next/image';
import { useState } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import FlightSchedule from '../ReviewTrip/FlightSchedule';
import CancelBookingModal from '../Modal/CancelBookingModal';
import CancelBookingLoader from '../Loader/CancelBookingLoader';
import { postCancelFlight } from 'src/redux/action/SearchFlights';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const CancelBooking = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const cancelBookingContent = useSelector(
    (state: RootState) => state?.sitecore?.reviewTrip?.fields
  );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const cancelBookingInfo = useSelector(
    (state: RootState) => state?.flightDetails?.prepareCancelFlight
  );

  const load = useSelector((state: RootState) => state?.loader?.loader);
  const flightInfo = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const bookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);
  const findBookingInfo = useSelector((state: RootState) => state?.flightDetails?.findBooking);

  const [showModal, setShowModal] = useState(false);

  const TotalRefundPrice = () => {
    return (
      <div>
        <div className="bg-white p-3 rounded-lg">
          <div className="flex justify-between my-1">
            <p className="text-slategray text-lg font-medium">
              {getFieldName(cancelBookingContent, 'numberOfPassengers')}
            </p>
            <p className="font-black text-lg text-black">
              {cancelBookingInfo?.Passengers?.Adult +
                (cancelBookingInfo?.Passengers?.Children
                  ? cancelBookingInfo?.Passengers?.Children
                  : 0)}
            </p>
          </div>
          <div className="flex justify-between my-1">
            <p className="text-slategray text-lg font-medium">
              {getFieldName(cancelBookingContent, 'taxes')}
            </p>
            <p className="font-black text-lg text-black">
              {(bookingInfo?.Amount?.SaleCurrencyCode
                ? bookingInfo?.Amount?.SaleCurrencyCode
                : flightInfo?.details?.currency
                ? flightInfo?.details?.currency
                : '') +
                ' ' +
                cancelBookingInfo?.Amount?.TaxAmount?.toLocaleString('en-GB')}
            </p>
          </div>
          <div className="flex justify-between my-1">
            <p className="text-slategray text-lg font-medium">
              {getFieldName(cancelBookingContent, 'refundPrice')}
            </p>
            <p className="font-black text-lg text-black">
              {(bookingInfo?.Amount?.SaleCurrencyCode
                ? bookingInfo?.Amount?.SaleCurrencyCode
                : flightInfo?.details?.currency
                ? flightInfo?.details?.currency
                : '') +
                ' ' +
                cancelBookingInfo?.Amount?.TotalAmount?.toLocaleString('en-GB')}
            </p>
          </div>
          <CancelBookingModal
            id="modal-cancel-booking"
            showModal={showModal}
            setShowModal={setShowModal}
            cancelBooking={() => {
              dispatch(
                loader({
                  show: true,
                  name: 'cancel',
                })
              );
              dispatch(
                postCancelFlight(
                  {
                    PnrCode: findBookingInfo?.ID,
                    PassengerName: findBookingInfo?.PassengerName,
                  },
                  router
                ) as unknown as AnyAction
              );
              document.body.style.overflow = 'unset';
            }}
          />
          <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
            <div className="flex md:flex block h-full items-center justify-center relative gap-3 py-3 xs:w-full  ">
              <button
                type="button"
                className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 "
                onClick={() => {
                  router.back();
                }}
              >
                {getFieldName(cancelBookingContent, 'goBackButton')}
              </button>
              <button
                type="button"
                className="xs:justify-center  xs:text-center text-white bg-red  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12"
                onClick={() => {
                  setShowModal(true);
                  document.body.style.overflow = 'hidden';
                }}
              >
                {getFieldName(cancelBookingContent, 'cancelButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main
      onClick={() => {
        const modalCancelBooking = document.getElementById('modal-cancel-booking');
        window.onclick = function (event) {
          if (event.target === modalCancelBooking) {
            setShowModal(false);
            document.body.style.overflow = 'unset';
          }
        };
      }}
    >
      {!load?.show ? (
        <div>
          <div>
            <CancelBookingModal
              id="modal-cancel-booking"
              showModal={showModal}
              setShowModal={setShowModal}
              cancelBooking={() => {
                dispatch(
                  loader({
                    show: true,
                    name: 'cancel',
                  })
                );
                dispatch(
                  postCancelFlight(
                    {
                      PnrCode: findBookingInfo?.ID,
                      PassengerName: findBookingInfo?.PassengerName,
                    },
                    router
                  ) as unknown as AnyAction
                );
                document.body.style.overflow = 'unset';
              }}
            />
          </div>
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
                <div className="fixed top-24 right-3.5  xl:m-auto price-modal  z-50	">
                  <TotalRefundPrice />
                </div>
              </div>
            </div>
            <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-24 xl:mt-0 xs:pt-20 ">
              {' '}
              <div className="xl:w-2/4 xl:m-auto xs:w-full ">
                <div
                  className="flex justify-between items-center xl:py-0 xs:py-3"
                  onClick={() => {
                    router.back();
                  }}
                >
                  <div className="xl:py-3 xs:py-0 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      aria-hidden="true"
                      className="text-black text-sm font-black h-4 w-4"
                    />
                    <span className="px-2 text-black text-sm font-black">
                      {getFieldName(cancelBookingContent, 'backButton')}
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-black">
                    {getFieldName(cancelBookingContent, 'cancelBooking')}
                  </h1>
                  <div className="py-1">
                    <p className="font-medium text-base text-pearlgray">
                      {getFieldName(cancelBookingContent, 'cancelBookingContent')}
                    </p>
                  </div>
                </div>
                <div>
                  <div className=" xs:block gap-2 py-3">
                    {/* <div className="bg-white  xl:w-full mb-1 rounded-2xl"> */}
                    <div>
                      {cancelBookingInfo?.OriginDestination?.map(
                        (item: bookingDetails, index: number) => {
                          return (
                            <div className="bg-white p-4  xl:w-full rounded-lg mb-4" key={index}>
                              <FlightSchedule
                                index={index}
                                seats={false}
                                meals={false}
                                special={false}
                                loungeAccess={true}
                                luxuryPickup={true}
                                Stops={item?.Stops}
                                Duration={item?.Duration}
                                Remarks={item?.Remarks}
                                AircraftType={item?.AircraftType}
                                originCode={item?.OriginCode}
                                arrivalDate={item?.ArrivalDate}
                                bagAllowances={item.BagAllowances}
                                departureDate={item?.DepartureDate}
                                originAirportName={item?.OriginName}
                                destinationCode={item?.DestinationCode}
                                departureTime={item?.OrginDepartureTime}
                                arrivalTime={item?.DestinationArrivalTime}
                                destinationAirportName={item?.DestinationName}
                                OriginAirportTerminal={item?.OriginAirportTerminal}
                                DestinationAirportTerminal={item?.DestinationAirportTerminal}
                                WebClass={item?.WebClass ? item?.WebClass : flightInfo?.name}
                              />
                            </div>
                          );
                        }
                      )}
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="xs:not-sr-only	xl:sr-only">
                <TotalRefundPrice />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CancelBookingLoader open={load?.show} />
      )}
    </main>
  );
};

export default CancelBooking;