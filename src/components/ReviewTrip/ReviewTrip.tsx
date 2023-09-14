import Image from 'next/image';
import { useState } from 'react';
import parse from 'html-react-parser';
// import { useRouter } from 'next/router'; //back button comment from reviewtrip
import { useDispatch, useSelector } from 'react-redux';
// import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'; //back button comment from reviewtrip
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';//back button comment from reviewtrip

import CodesInCurve from './CodesInCurve';
import { RootState } from 'src/redux/store';
import PriceBreakDown from './PriceBreakDown';
import FlightSchedule from './FlightSchedule';
import StepsInfo from '../SearchFlight/StepsInfo';
import SavingDataLoader from '../Loader/SavingData';
import SearchSeatLoader from '../Loader/SearchSeat';
import PassengerCount from '../Modal/PassengerCount';
import PaymentGatewayLoader from '../Loader/PaymentGateway';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import FareBaggageModal from 'components/Modal/FareBaggageModal';
import { setAcceptTermsConditions } from 'src/redux/reducer/FlightDetails';
import ModifyPassengerSeatFareFamily from './ModifyPassengerSeatFareFamily';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const ReviewTrip = () => {
  // const router = useRouter(); //back button comment from reviewtrip
  const dispatch = useDispatch();

  // const cancelBookingModalContent = useSelector(
  //   (state: RootState) => state?.sitecore?.cancelModal?.fields
  // );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  // const bookingCompleteContent = useSelector(
  //   (state: RootState) => state?.sitecore?.bookingComplete?.fields
  // );
  const storedPassengerData = useSelector(
    (state: RootState) => state?.passenger?.passengersData?.details
  );
  const termsConditionsAccepted = useSelector(
    (state: RootState) => state?.flightDetails?.acceptTermsConditions
  );
  // const modifyBookingDetailsModalContent = useSelector(
  //   (state: RootState) => state?.sitecore?.modifyBookingModal?.fields
  // );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const paymentForm = useSelector((state: RootState) => state?.flightDetails?.paymentForm);
  const flightInfo = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const selectedMeal = useSelector((state: RootState) => state?.flightDetails?.selectedMeal);
  // const cancelContent = useSelector((state: RootState) => state?.sitecore?.cancelSuccess?.fields);
  const createBookingInfo = useSelector((state: RootState) => state?.flightDetails?.createBooking);
  const reviewTripContent = useSelector((state: RootState) => state?.sitecore?.reviewTrip?.fields);

  const [showModal, setShowModal] = useState({
    passenger: false,
  });
  const [showFare, setFareModal] = useState(false);

  const [passengerCount, setPassengerCount] = useState({
    adult: createBookingInfo?.Passengers?.Adult ? createBookingInfo?.Passengers?.Adult : 1,
    children: createBookingInfo?.Passengers?.Children ? createBookingInfo?.Passengers?.Children : 0,
  });

  const flightData = createBookingInfo?.OriginDestination?.find(
    (item: object) => item !== undefined
  );

  const seatsOriginToDestination = createBookingInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields
        .filter((item: { Code: string }) => item?.Code === 'SEAT')
        ?.find((item, index) => item?.Code !== undefined && index === 0)
  );

  const seatsDestinationToOrigin = createBookingInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields
        .filter((item: { Code: string }) => item?.Code === 'SEAT')
        ?.find((item, index) => item?.Code !== undefined && index === 1)
  );

  const allSeats = createBookingInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields?.filter((item: { Code: string }) => item?.Code === 'SEAT')?.map((item) => item)
  );

  const TotalPricing = () => {
    return (
      <div>
        <div className="bg-white p-3 rounded-lg">
          {/* hide-flightPrice */}
          {/* <div className="flex justify-between my-1">
            <p className="text-slategray text-base font-medium">
              {getFieldName(reviewTripContent, 'flightPrice')}
            </p>
            <p className="font-medium text-base text-black">
              {(flightInfo?.details?.currency ? flightInfo?.details?.currency : '') +
                ' ' +
                (createBookingInfo?.Amount?.TotalAmount
                  ? createBookingInfo?.Amount?.TotalAmount?.toLocaleString('en-GB')
                  : '')}
            </p>
          </div> */}
          {/* hide-addOns */}
          {/* <div className="flex justify-between my-1">
            <p className="text-slategray text-base font-medium">
              {getFieldName(reviewTripContent, 'addons')}
            </p>
            <p className="font-medium text-base text-black">0</p>
          </div> */}
          <div className="flex justify-between mt-5">
            <p className="text-slategray text-lg font-medium">
              {getFieldName(reviewTripContent, 'totalPrice')}
            </p>
            <p className="font-black text-lg text-black">
              {(flightInfo?.details?.currency ? flightInfo?.details?.currency : '') +
                ' ' +
                (createBookingInfo?.Amount?.TotalAmount
                  ? createBookingInfo?.Amount?.TotalAmount?.toLocaleString('en-GB')
                  : '')}
            </p>
          </div>
          <div className="flex justify-between ">
            <p className="text-slategray text-sm font-medium">With Seats, Add-ons and Taxes </p>
          </div>
          <div className="flex items-center my-2">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={termsConditionsAccepted}
              onChange={(e) => {
                dispatch(setAcceptTermsConditions(e?.target?.checked));
              }}
              className="accent-orange-600	 text-white w-4 h-4 opacity-70"
            />

            <label className="ml-2 text-sm font-medium text-black">
              {getFieldName(reviewTripContent, 'iAcceptAll')}{' '}
              <a
                className="text-sm text-aqua font-medium cursor-pointer"
                href="https://edge.sitecorecloud.io/arabesquefl0f70-demoproject-demoenv-79bc/media/flightbooking/Legal-Docs/CoC_Beond_MS_080823_v2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                // onClick={() => router.push('/terms&conditions')}
              >
                {getFieldName(reviewTripContent, 'termsConditions')}
              </a>
              <span className="text-sm font-medium"> and </span>
              <span
                className="text-sm text-aqua font-medium cursor-pointer"
                onClick={() => {
                  setFareModal(true);
                  document.body.style.overflow = 'hidden';
                }}
              >
                Fare & Baggage Rules
              </span>
            </label>
          </div>
          <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
            <button
              type="submit"
              form="hpp"
              disabled={
                !termsConditionsAccepted || createBookingInfo?.Amount?.TotalAmount === undefined
              }
              className={`w-full xs:justify-center  xs:text-center text-white bg-aqua font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center ${
                !termsConditionsAccepted || createBookingInfo?.Amount?.TotalAmount === undefined
                  ? 'opacity-40 cursor-not-allowed'
                  : ''
              }`}
            >
              {getFieldName(reviewTripContent, 'confirmPayButton')}
            </button>
          </div>
        </div>
        {showFare && (
          <FareBaggageModal
            showFare={showFare}
            closeModal={() => {
              setFareModal(false);
              document.body.style.overflow = 'unset';
            }}
          />
        )}
      </div>
    );
  };

  const imageLoader = () => {
    return `https://ipac.ctnsnet.com/int/integration?pixel=79124021&nid=2142538&cont=i`
  }

  return (
    <main
      onClick={() => {
        const modalPassenger = document.getElementById('modal-passenger');
        window.onclick = function (event) {
          if (event.target === modalPassenger) {
            setShowModal({
              passenger: false,
            });
            document.body.style.overflow = 'unset';
          }
        };
      }}
    >
      <Image
        src={'https://ipac.ctnsnet.com/int/integration?pixel=79124021&nid=2142538&cont=i'}
        loader={imageLoader}
        width={1}
        height={1}
        alt="pixel"
      />
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
              <div className="fixed top-24 right-3.5  xl:m-auto price-modal  z-50	">
                <TotalPricing />
              </div>
            </div>
          </div>
          <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-16 ">
            <div className="xl:not-sr-only	xs:sr-only">
              <div className="xl:w-3/5 xl:m-auto xl:pl-12 xl:mt-12">
                <StepsInfo selected={3} />
              </div>
            </div>
            <div className="xl:w-2/4 xl:m-auto xs:w-full xl:pt-4 xs:pt-20">
              {/* back button comment from reviewtrip */}
              <div>
                <div className="flex justify-between items-center">
                  <div
                    className="xl:py-3 xs:py-3 cursor-pointer"
                    // onClick={() => {
                    //   router.push('/chooseseats');
                    // }}
                  >
                    {/* <FontAwesomeIcon
                      icon={faAngleLeft}
                      aria-hidden="true"
                      className="text-black text-sm font-black h-4 w-4"
                    />
                    <span className="px-2 text-black text-sm font-black">
                      {getFieldName(reviewTripContent, 'backButton')}
                    </span> */}
                  </div>
                </div>
                <div className="pt-2">
                  <h1 className="text-2xl font-black text-black">
                    {getFieldName(reviewTripContent, 'heading')}
                  </h1>
                </div>
                <div className="py-1">
                  <p className="font-medium text-base text-pearlgray">
                    {getFieldName(reviewTripContent, 'content')}
                  </p>
                </div>
              </div>
              <div>
                <div className=" xs:block gap-2 py-3">
                  <div className="bg-white  xl:w-full mb-1 rounded-2xl">
                    <CodesInCurve
                      originCity={flightData?.OriginCity}
                      originCode={flightData?.OriginCode}
                      destinationCity={flightData?.DestinationCity}
                      destinationCode={flightData?.DestinationCode}
                      oneway={createBookingInfo?.OriginDestination?.length < 2}
                    />
                    <div className="p-4">
                      {createBookingInfo?.OriginDestination?.map(
                        (item: bookingDetails, index: number) => {
                          return (
                            <div key={index}>
                              <FlightSchedule
                                index={index}
                                seats={true}
                                Stops={item?.Stops}
                                Remarks={item?.Remarks}
                                loungeAccess={item?.Lounge}
                                luxuryPickup={item?.Luxury}
                                originCode={item?.OriginCode}
                                arrivalDate={item?.ArrivalDate}
                                FlightNumber={item?.FlightNumber}
                                bagAllowances={item.BagAllowances}
                                departureDate={item?.DepartureDate}
                                destinationCode={item?.DestinationCode}
                                departureTime={item?.OrginDepartureTime}
                                arrivalTime={item?.DestinationArrivalTime}
                                seatsDestinationToOrigin={seatsDestinationToOrigin}
                                seatsOriginToDestination={seatsOriginToDestination}
                                originAirportName={
                                  flightInfo?.details?.FaireFamilies[index]?.originName
                                }
                                destinationAirportName={
                                  flightInfo?.details?.FaireFamilies[index]?.destinationName
                                }
                              />
                            </div>
                          );
                        }
                      )}
                      <PassengerCount
                        navigate={true}
                        id="modal-passenger"
                        name="flightAvailability"
                        closeModal={() => {
                          setShowModal({
                            passenger: false,
                          });
                          document.body.style.overflow = 'unset';
                        }}
                        adult={passengerCount?.adult}
                        flightDetails={passengerCount}
                        showModal={showModal?.passenger}
                        childrens={passengerCount?.children}
                        setFlightDetails={setPassengerCount}
                      />
                      <ModifyPassengerSeatFareFamily
                        mealsLabel={selectedMeal}
                        adult={passengerCount?.adult}
                        fareFamilyName={flightInfo?.name}
                        childrens={passengerCount?.children}
                        seatsLabel={
                          allSeats && allSeats?.length > 0 && allSeats[0] ? allSeats?.flat(1) : []
                        }
                      />
                    </div>
                    <PriceBreakDown
                      fareFamilyName={flightInfo?.name}
                      currency={flightInfo?.details?.currency}
                      passengerCount={storedPassengerData?.length}
                      taxAmount={createBookingInfo?.Amount?.TaxAmount?.toLocaleString('en-GB')}
                      baseAmount={createBookingInfo?.Amount?.BaseAmount?.toLocaleString('en-GB')}
                      totalAmount={createBookingInfo?.Amount?.TotalAmount?.toLocaleString('en-GB')}
                    />
                  </div>
                </div>
                <div className="xl:mb-0 xs:mb-48">
                  <div className="bg-white  xl:w-full mt-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl">
                    <Image
                      className="h-full w-full object-containt  rounded-tl-xl rounded-tr-xl"
                      src={getImageSrc(reviewTripContent, 'seatsImage')}
                      alt=""
                      height={1000}
                      width={1000}
                    />
                    <div className="p-4">
                      <h1 className="text-lg font-black text-black">
                        {getFieldName(reviewTripContent, 'flyInLuxuryWithBeond')}
                      </h1>
                      <p className="text-sm text-medium text-slategray">
                        {getFieldName(reviewTripContent, 'flyInLuxuryWithBeondContent')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xs:not-sr-only	xl:sr-only">
            <div className="fixed w-full left-0 bottom-0 z-40">
              <TotalPricing />
              <div className="hidden">
                {paymentForm !== undefined && paymentForm?.length > 0 ? parse(paymentForm) : ''}
              </div>
            </div>
          </div>
        </div>
      ) : load?.name === 'search' ? (
        <SearchFlightLoader open={load?.show} />
      ) : load?.name === 'createBooking' ? (
        <SearchSeatLoader open={load?.show} />
      ) : load?.name === 'payment' ? (
        <PaymentGatewayLoader open={load?.show} />
      ) : (
        load?.name === 'save' && <SavingDataLoader open={load?.show} />
      )}
    </main>
  );
};

export default ReviewTrip;