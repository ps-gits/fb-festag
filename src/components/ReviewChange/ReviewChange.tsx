import Image from 'next/image';
import { useState, useEffect } from 'react';
import { AnyAction } from 'redux';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  setUpdateCart,
  setModifyDates,
  setAcceptTermsConditions,
  setModifyBookingFromBooking,
} from 'src/redux/reducer/FlightDetails';
import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import SavingDataLoader from '../Loader/SavingData';
import SearchSeatLoader from '../Loader/SearchSeat';
import FlightSchedule from '../ReviewTrip/FlightSchedule';
import FareBaggageModal from 'components/Modal/FareBaggageModal';
import { postCreateTicket } from 'src/redux/action/SearchFlights';
import SearchFlightLoader from 'components/Loader/SearchFlightLoader';
import { fieldsWithCode } from 'components/PassengerDetails/FieldsData';
import DepartReturnDateModal from 'components/Modal/DepartReturnDateModal';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const ReviewChange = () => {

  
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    
    console.log("Webclass", modifyBookingSeats?.OriginDestination)
    console.log("Web",selectedFlight?.details?.FaireFamilies)
    const vala = (modifyMeal || modifySeat || updateCart
      ? modifyBookingSeats?.OriginDestination
      : selectedFlight?.details?.FaireFamilies
    )
    console.log("Webclass", vala)
  }, []); 

  const reviewChangeContent = useSelector(
    (state: RootState) => state?.sitecore?.reviewTrip?.fields
  );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const modifyBookingSeats = useSelector(
    (state: RootState) => state?.flightDetails?.modifyBookingSeats
  );
  const termsConditionsAccepted = useSelector(
    (state: RootState) => state?.flightDetails?.acceptTermsConditions
  );
  const createExchangeBookingInfo = useSelector(
    (state: RootState) => state?.flightDetails?.exchangeCreateBooking
  );
  const modifyDataFromBooking = useSelector(
    (state: RootState) => state?.flightDetails?.modifyDataFromBooking
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const selectedDetailsForFlight = useSelector(
    (state: RootState) => state?.flightDetails?.selectedFlightCodesWithDate
  );
  const searchFlightPayload = useSelector(
    (state: RootState) => state?.flightDetails?.reviewFlight?.OriginDestinations
  );
  const passengerDetails = useSelector(
    (state: RootState) => state?.flightDetails?.prepareExchangeFlight?.Passengers
  );
  const createTicketPassenger = useSelector((state: RootState) =>
    state?.flightDetails?.prepareExchangeFlight?.Passengers?.map(
      (item: { NameElement: { Firstname: string; Surname: string } }, index: number) => {
        const otherFields = Object.fromEntries(
          (state?.flightDetails?.prepareExchangeFlight?.PassengersDetails[index]?.fields || [])
            .map((dt: { Code: string; Text: string }) => {
              const matchingItem = fieldsWithCode?.find((item1) => item1?.Code === dt?.Code);
              return matchingItem ? [matchingItem?.name, dt?.Text] : null;
            })
            ?.filter(Boolean)
        );
        return {
          ...item?.NameElement,
          ...otherFields,
        };
      }
    )
  );
  const storedPassengerData = useSelector(
    (state: RootState) => state?.passenger?.passengersData?.details
  );
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const updateCart = useSelector((state: RootState) => state?.flightDetails?.updateCart);
  const modifySeat = useSelector((state: RootState) => state?.flightDetails?.modifySeat);
  const modifyMeal = useSelector((state: RootState) => state?.flightDetails?.modifyMeal);
  const modifyDates = useSelector((state: RootState) => state?.flightDetails?.modifyDates);
  const paymentForm = useSelector((state: RootState) => state?.flightDetails?.paymentForm);
  const chooseSeats = useSelector((state: RootState) => state?.flightDetails?.chooseSeats);
  const selectedFlight = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const selectSeatLater = useSelector((state: RootState) => state?.flightDetails?.selectSeatLater);
  // const chooseSeatsContent = useSelector((state: RootState) => state?.sitecore?.chooseSeat?.fields);

  const { returnDate, departDate, dateFlexible, originCode, destinationCode } =
    selectedDetailsForFlight;

  const [showModal, setShowModal] = useState({
    depart: false,
    return: false,
  });
  const [showFare, setFareModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    departure: '',
    returnDate: '',
  });
  const [flightDetails, setFlightDetails] = useState({
    departDate: new Date(departDate),
    returnDate: new Date(returnDate),
    dateFlexible: dateFlexible,
  });

  const cityCodes = modifyBookingSeats?.OriginDestination?.find(
    (item: { OriginCode: string; DestinationCode: string }) =>
      item && item?.OriginCode !== undefined && item?.DestinationCode !== undefined
  );

  const TotalPrice = () => {
    return (
      <div className="bg-white p-3 rounded-lg">
        <div className="flex justify-between my-1">
          <p className="text-slategray text-lg font-medium">
            {getFieldName(reviewChangeContent, 'numberOfPassengers')}
          </p>
          <p className="font-black text-lg text-black">
            {modifyMeal || modifySeat || updateCart
              ? (modifyBookingSeats?.Passengers?.Adult
                  ? modifyBookingSeats?.Passengers?.Adult
                  : 1) +
                (modifyBookingSeats?.Passengers?.Children
                  ? modifyBookingSeats?.Passengers?.Children
                  : 0)
              : passengerDetails?.length}
          </p>
        </div>
        <div className="flex justify-between mt-5">
          <p className="text-slategray text-lg font-medium">
            {getFieldName(reviewChangeContent, 'totalPrice')}
          </p>
          <p className="font-black text-lg text-black">
            {((modifyMeal || modifySeat || updateCart) &&
            modifyBookingSeats?.Amount?.SaleCurrencyCode
              ? modifyBookingSeats?.Amount?.SaleCurrencyCode
              : selectedFlight?.details?.currency
              ? selectedFlight?.details?.currency
              : '') +
              ' ' +
              (modifyMeal || modifySeat || updateCart
                ? modifyBookingSeats?.Amount?.TotalAmount
                  ? modifyBookingSeats?.Amount?.TotalAmount?.toLocaleString('en-GB')
                  : '0'
                : !selectSeatLater && chooseSeats?.length === 0
                ? selectedFlight?.details?.TotalAmount
                  ? selectedFlight?.details?.TotalAmount?.toLocaleString('en-GB')
                  : '0'
                : createExchangeBookingInfo?.Amount?.TotalAmount
                ? createExchangeBookingInfo?.Amount?.TotalAmount?.toLocaleString('en-GB')
                : '0')}
          </p>
        </div>
        <div className="flex justify-between ">
          <p className="text-slategray text-sm font-medium">With Seats, Add-ons and Taxes </p>
        </div>
        {!updateCart && !modifyMeal && !selectSeatLater && chooseSeats?.length === 0 ? (
          <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
            <div className="flex md:flex block h-full items-center justify-center relative gap-3 py-3 xs:w-full  ">
              {/* <button
                type="button"
                className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 "
                onClick={() => {
                  setShowModal({
                    depart: true,
                    return: false,
                  });
                  document.body.style.overflow = 'hidden';
                }}
              >
                {getFieldName(reviewChangeContent, 'editDatesButton')}
              </button> */}
              <button
                type="button"
                className="xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center py-2 text-center w-full "
                onClick={() => {
                  dispatch(
                    loader({
                      name: 'save',
                      show: true,
                    })
                  );
                  router.push('/passengerdetails');
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
                {/* {getFieldName(reviewChangeContent, 'chooseSeatsButton')} */}
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <>
            {(modifyData || modifyDataFromBooking) &&
            createExchangeBookingInfo?.Amount?.TotalAmount === 0 ? (
              <>
                <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                  <div className="flex md:flex block h-full items-center justify-center relative gap-3 py-3 xs:w-full  ">
                    <button
                      type="button"
                      className="xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center py-2 text-center w-full "
                      onClick={() => {
                        dispatch(
                          loader({
                            show: true,
                            name: 'payment',
                          })
                        );
                        dispatch(
                          postCreateTicket(
                            {
                              ID: modifySeat
                                ? modifyBookingSeats?.PnrInformation?.PnrCode
                                : !modifyData && !modifyDataFromBooking
                                ? createExchangeBookingInfo?.PnrInformation?.PnrCode
                                : createExchangeBookingInfo?.PnrInformation?.PnrCode,
                              PassengerName: modifySeat
                                ? createTicketPassenger &&
                                  createTicketPassenger?.length > 0 &&
                                  createTicketPassenger[0]
                                  ? createTicketPassenger[0]?.Surname
                                  : ''
                                : !modifyData && !modifyDataFromBooking
                                ? storedPassengerData &&
                                  storedPassengerData?.length > 0 &&
                                  storedPassengerData[0]
                                  ? storedPassengerData[0]?.Surname
                                  : ''
                                : createTicketPassenger &&
                                  createTicketPassenger?.length > 0 &&
                                  createTicketPassenger[0]
                                ? createTicketPassenger[0]?.Surname
                                : '',
                              Amount: modifySeat
                                ? modifyBookingSeats?.Amount?.TotalAmount
                                : !modifyData && !modifyDataFromBooking
                                ? createExchangeBookingInfo?.Amount?.TotalAmount
                                : createExchangeBookingInfo?.Amount?.TotalAmount,
                            },
                            router
                          ) as unknown as AnyAction
                        );
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                    I accept the{' '}
                    <a
                      className="text-sm text-aqua font-medium cursor-pointer"
                      href="https://edge.sitecorecloud.io/arabesquefl0f70-demoproject-demoenv-79bc/media/flightbooking/Legal-Docs/CoC_Beond_MS_080823_v2.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* {getFieldName(reviewTripContent, 'termsConditions')} */}
                      Conditions of Carriage
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
                      !termsConditionsAccepted ||
                      (modifyMeal || modifySeat || updateCart
                        ? modifyBookingSeats
                        : createExchangeBookingInfo
                      )?.Amount?.TotalAmount === 0
                    }
                    className={`w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center ${
                      !termsConditionsAccepted ||
                      (modifyMeal || modifySeat || updateCart
                        ? modifyBookingSeats
                        : createExchangeBookingInfo
                      )?.Amount?.TotalAmount === 0
                        ? 'opacity-40'
                        : ''
                    }`}
                  >
                    {getFieldName(reviewChangeContent, 'confirmPayButton')}
                  </button>
                </div>
              </>
            )}
          </>
        )}
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
              <div className="fixed top-10 right-3.5  xl:m-auto price-modal z-50">
                <div className="mt-14">
                  <TotalPrice />
                </div>
              </div>
            </div>
          </div>
          <DepartReturnDateModal
            editDate={true}
            closeModal={() => {
              setShowModal({
                depart: false,
                return: false,
              });
              document.body.style.overflow = 'unset';
            }}
            modifyBooking={true}
            setShowModal={setShowModal}
            errorMessage={errorMessage}
            flightDetails={flightDetails}
            setErrorMessage={setErrorMessage}
            setFlightDetails={setFlightDetails}
            returnDate={flightDetails.returnDate}
            setOldDates={() => {
              setFlightDetails({
                departDate: new Date(departDate),
                returnDate: new Date(returnDate),
                dateFlexible: true,
              });
            }}
            fareFamilyName="bliss"
            fareFamilyValue="Bliss"
            // fareFamilyName={flightInfo?.name}
            departDate={flightDetails.departDate}
            dateFlexible={flightDetails?.dateFlexible}
            name={showModal?.depart ? 'Departure' : 'Return'}
            oneway={searchFlightPayload?.length === 1 ? true : false}
            id={showModal?.depart ? 'modal-depart' : 'modal-return'}
            showModal={showModal?.depart ? showModal?.depart : showModal?.return}
            originCode={showModal?.depart ? originCode : destinationCode}
            destinationCode={showModal?.depart ? destinationCode : originCode}
          />
          <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-24 xl:mt-0 xs:pt-20 ">
            <div className="xl:w-2/4 xl:m-auto xs:w-full ">
              <div className="flex justify-between items-center xl:py-0 xs:py-3">
                <div
                  className="xl:py-3  xs:py-0 cursor-pointer"
                  onClick={() => {
                    modifyDates && (chooseSeats?.length > 0 || selectSeatLater)
                      ? router.push('/chooseseats')
                      : modifyDates
                      ? dateFlexible
                        ? router.push('/flightavailability')
                        : modifyDataFromBooking
                        ? router.push('/bookingcomplete')
                        : router.push('/modifybooking')
                      : modifySeat && chooseSeats?.length > 0
                      ? router.push('/chooseseats')
                      : router.back();
                    if (
                      modifyDates &&
                      chooseSeats?.length === 0 &&
                      !selectSeatLater &&
                      (modifyDataFromBooking || modifyData)
                    ) {
                      dispatch(setModifyDates(false));
                      !dateFlexible && dispatch(setModifyBookingFromBooking(false));
                    } else {
                      updateCart && dispatch(setUpdateCart(false));
                    }
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
                <div className=" xs:block gap-2 py-3 ">
                  {(modifyMeal || modifySeat || updateCart
                    ? modifyBookingSeats?.OriginDestination
                    : selectedFlight?.details?.FaireFamilies
                  )?.map((item: selectedFareFamily, index: number) => {
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
                          AircraftType={item?.AircraftType}
                          Remarks={item?.Remarks}
                          bagAllowances={item.BagAllowances}
                          originAirportName={item?.originName}
                          FlightNumber={item?.FlightNumber}
                          originCode={
                            index === 0
                              ? modifyMeal || modifySeat || updateCart
                                ? cityCodes?.OriginCode
                                : selectedFlight?.details?.OriginCode
                              : modifyMeal || modifySeat || updateCart
                              ? cityCodes?.DestinationCode
                              : selectedFlight?.details?.DestinationCode
                          }
                          destinationCode={
                            index === 0
                              ? modifyMeal || modifySeat || updateCart
                                ? cityCodes?.DestinationCode
                                : selectedFlight?.details?.DestinationCode
                              : modifyMeal || modifySeat || updateCart
                              ? cityCodes?.OriginCode
                              : selectedFlight?.details?.OriginCode
                          }
                          departureDate={item?.orginDepartureDate}
                          departureTime={item?.orginDepartureTime}
                          arrivalDate={item?.destinationArrivalDate}
                          arrivalTime={item?.destinationArrivalTime}
                          destinationAirportName={item?.destinationName}
                          OriginAirportTerminal={item?.OriginAirportTerminal}
                          DestinationAirportTerminal={item?.DestinationAirportTerminal}
                          WebClass={item?.WebClass ? item?.WebClass : 'Bliss'}
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
      ) : load?.name === 'save' ? (
        <SavingDataLoader open={load?.show} />
      ) : (
        load?.name === 'search' && <SearchFlightLoader open={load?.show} />
      )}
    </>
  );
};

export default ReviewChange;