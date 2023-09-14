// import axios from 'axios';
import moment from 'moment';
import Image from 'next/image';
import { useState } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import {
  setModifyMeal,
  setModifySeat,
  setSelectedMeal,
  setModifyBookingFromBooking,
} from 'src/redux/reducer/FlightDetails';
import { RootState } from 'src/redux/store';
import { getDate } from '../ReviewTrip/GetDate';
import { loader } from 'src/redux/reducer/Loader';
import PassengerCount from '../Modal/PassengerCount';
import CodesInCurve from '../ReviewTrip/CodesInCurve';
import FlightSchedule from '../ReviewTrip/FlightSchedule';
import PriceBreakDown from '../ReviewTrip/PriceBreakDown';
import PaymentGatewayLoader from '../Loader/PaymentGateway';
import SearchSeatLoader from 'components/Loader/SearchSeat';
import ModifyBookingModal from '../Modal/ModifyBookingModal';
// import FeaturedAddOns from '../ModifyBooking/FeaturedAddOns';
import GettingDataLoader from 'components/Loader/GettingData';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import CancelBookingLoader from '../Loader/CancelBookingLoader';
// import { graphQLToken, graphQLUrl } from 'components/Api/ApiUrl';
import DepartReturnDateModal from '../Modal/DepartReturnDateModal';
import { postPrepareCancelFlight } from 'src/redux/action/SearchFlights';
// import { setMealList, setNumberOfMeals } from 'src/redux/reducer/Sitecore';
import ModifyBookingDetailsModal from '../Modal/ModifyBookingDetailsModal';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';
import ModifyPassengerSeatFareFamily from '../ReviewTrip/ModifyPassengerSeatFareFamily';

const BookingComplete = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const bookingCompleteInfo = useSelector(
    (state: RootState) => state?.flightDetails?.modifyBooking
  );
  const createBookingInfo = useSelector((state: RootState) => state?.flightDetails?.createBooking);
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const bookingCompleteContent = useSelector(
    (state: RootState) => state?.sitecore?.bookingComplete?.fields
  );
  const passengerDetails = useSelector(
    (state: RootState) => state?.passenger?.passengersData?.details
  );
  const storedPassengerData = useSelector((state: RootState) =>
    !modifyData
      ? state?.passenger?.passengersData?.details
      : state?.flightDetails?.modifyBooking?.PassengersDetails
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const savedMealsData = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification
  );
  const selectedDetailsForFlight = useSelector(
    (state: RootState) => state?.flightDetails?.selectedFlightCodesWithDate
  );
  // const mealsList = useSelector((state: RootState) => state?.sitecore?.mealList);
  const cartData = useSelector((state: RootState) => state?.flightDetails?.yourCart);
  const allMealData = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification?.MealsDetails
  );
  // const numberOfMeals = useSelector((state: RootState) => state?.sitecore?.numberOfMeals);
  const flightInfo = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const findBookingInfo = useSelector((state: RootState) => state?.flightDetails?.findBooking);
  // const chooseMealContent = useSelector((state: RootState) => state?.sitecore?.chooseMeal?.fields);

  const flightData = bookingCompleteInfo?.OriginDestination?.find(
    (item: object) => item !== undefined
  );

  const { departDate, returnDate } = selectedDetailsForFlight;

  const [showModal, setShowModal] = useState({
    depart: false,
    return: false,
    passenger: false,
    modifyBookingDetails: false,
  });
  const [copyText, setCopyText] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    departure: '',
    returnDate: '',
  });
  // const [featuredAddons, setFeaturedAddons] = useState<
  //   { name: string; amount: number; quantity: number }[]
  // >(cartData ? cartData : []);
  const [featuredAddons] = useState<{ name: string; amount: number; quantity: number }[]>(
    cartData ? cartData : []
  );
  const [flightDetails, setFlightDetails] = useState({
    departDate: new Date(moment(departDate).format('LL')),
    returnDate: new Date(moment(returnDate).format('LL')),
    dateFlexible: true,
  });

  const [passengerModify, setPassengerModify] = useState(false);
  const [passengerCount, setPassengerCount] = useState({
    adult: bookingCompleteInfo?.Passengers?.Adult ? bookingCompleteInfo?.Passengers?.Adult : 1,
    children: bookingCompleteInfo?.Passengers?.Children
      ? bookingCompleteInfo?.Passengers?.Children
      : 0,
  });

  // useEffect(() => {
  //   chooseMealContent !== undefined && getMealsList();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chooseMealContent]);

  const seatsOriginToDestination = bookingCompleteInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields
        .filter((item: { Code: string }) => item?.Code === 'SEAT')
        ?.find((item, index) => item?.Code !== undefined && index === 0)
  )?.filter((item: object) => item);

  const seatsDestinationToOrigin = bookingCompleteInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields
        .filter((item: { Code: string }) => item?.Code === 'SEAT')
        ?.find((item, index) => item?.Code !== undefined && index === 1)
  )?.filter((item: object) => item);

  const allSeats = bookingCompleteInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields?.filter((item: { Code: string }) => item?.Code === 'SEAT')?.map((item) => item)
  );

  // const getMealsList = async () => {
  //   const mealParentIds = getFieldName(chooseMealContent, 'dietaryMealData')?.split('|');

  //   const allMealsIds: string[] = [];

  //   const mealsInfo = [];
  //   let mealListData: {
  //     name: string;
  //     fields: { id: string; name: string; value: string }[];
  //   }[] = [];

  //   mealParentIds?.map(async (item, index) => {
  //     const response = await axios.post(
  //       `${graphQLUrl}`,
  //       {
  //         query: `{item(path: "${item}",language: "EN") {name\nfields{id\nname\nvalue\n}\n}\n}`,
  //       },
  //       {
  //         headers: {
  //           'x-gql-token': graphQLToken,
  //         },
  //       }
  //     );

  //     const mealsIds = await response?.data?.data?.item?.fields
  //       ?.find((item: { name: string }) => item?.name === 'items')
  //       ?.value?.split('|');

  //     mealsInfo.push({
  //       length: mealsIds?.length,
  //       index: index,
  //     });

  //     mealsIds?.map((dt: string) => allMealsIds.push(dt));

  //     if (
  //       (index === mealParentIds?.length - 1 &&
  //         numberOfMeals !== allMealsIds?.length &&
  //         mealsInfo?.length === mealParentIds?.length) ||
  //       (mealsInfo?.length === mealParentIds?.length && mealsList?.length === 0)
  //     ) {
  //       allMealsIds?.map(async (mealId) => {
  //         const response = await axios.post(
  //           `${graphQLUrl}`,
  //           {
  //             query: `{item(path: "${mealId}",language: "EN") {name\nfields{id\nname\nvalue\n}\n}\n}`,
  //           },
  //           {
  //             headers: {
  //               'x-gql-token': graphQLToken,
  //             },
  //           }
  //         );
  //         mealListData.push(response?.data?.data?.item);
  //         mealListData = mealListData?.filter(
  //           (item, index) => index === mealListData?.findIndex((dt) => dt?.name === item?.name)
  //         );
  //         if (mealListData?.length === allMealsIds?.length) {
  //           const finalList = mealListData?.map((item) => {
  //             return item?.fields.reduce(
  //               (obj, item) => Object.assign(obj, { [item.name]: item.value }),
  //               {}
  //             );
  //           });
  //           dispatch(setMealList(finalList));
  //           dispatch(setNumberOfMeals(allMealsIds?.length));
  //         }
  //       });
  //     }
  //   });
  // };
  const mealsDetails = () => {
    // if (mealsList?.length > 0 && mealsList?.length === numberOfMeals) {
    // const filterMealList = allMealData?.map((item: { fields: { Code: string }[] }) => {
    //   const list = item?.fields?.filter(
    //     (dt: { Code: string }) =>
    //       mealsList?.find((ml: { code: string }) => ml?.code === dt?.Code) !== undefined
    //   );
    //   return {
    //     fields: list?.filter(
    //       (dt, index) => index === list?.findIndex((ml) => ml?.Code === dt?.Code)
    //     ),
    //   };
    // });
    const mealList = allMealData[0]?.fields
      ?.map((item: { fields: { Code: string; Label: string }[] }) => item)
      ?.flat(1);

    const refSegmentDeparture = savedMealsData?.SeatMaps?.find(
      (item: object, index: number) => item !== undefined && index === 0
    )?.RefSegment;

    const filterMealList = mealList?.filter(
      (item: { RefSegment: string }) => item?.RefSegment === refSegmentDeparture
    );

    const mealsResponse = savedMealsData?.PassengersDetails?.map(
      (item: { fields: { Code: string }[] }, index: number) =>
        item?.fields
          ?.filter(
            (item: { Code: string }) =>
              filterMealList !== undefined &&
              filterMealList[index] !== undefined &&
              filterMealList?.find((dt: { Code: string }) => dt?.Code === item?.Code)
          )
          ?.map((item) => item)
    );

    return mealsResponse?.map(
      (
        item: {
          Code: string;
          Data: string;
          Label: string;
          Text: string;
          type: string;
        }[],
        index: number
      ) => {
        const mealData: {
          originMeal: string;
          returnMeal: string;
          passengerName: string;
          originMealCode: string;
          returnMealCode: string;
          passengerIndex: number;
        } = {
          originMeal: '',
          returnMeal: '',
          originMealCode: '',
          returnMealCode: '',
          passengerIndex: index,
          passengerName: savedMealsData?.Passengers[index]?.NameElement?.Firstname,
        };
        if (item?.length === 0) {
          mealData['originMeal'] = 'Regular Meal';
          mealData['originMealCode'] = '';
          mealData['returnMeal'] =
            bookingCompleteInfo?.OriginDestination?.length === 1 ? '' : 'Regular Meal';
          mealData['returnMealCode'] = '';
        }
        item.map((meal: { type: string; Code: string }) => {
          if (meal?.type?.toLowerCase() === 'departure') {
            mealData['originMeal'] = 'Dietary Meal';
            mealData['originMealCode'] = meal.Code;
            if (item.length === 1) {
              mealData['returnMeal'] =
                bookingCompleteInfo?.OriginDestination?.length === 1 ? '' : 'Regular Meal';
              mealData['returnMealCode'] = '';
            }
          } else {
            mealData['returnMeal'] = 'Dietary Meal';
            mealData['returnMealCode'] = meal.Code;
            if (item.length === 1) {
              mealData['originMeal'] = 'Regular Meal';
              mealData['originMealCode'] = '';
            }
          }
        });
        return mealData;
      }
    );
    // } else {
    //   return [];
    // }
  };

  const imageLoader = () => {
    return `https://ipac.ctnsnet.com/int/integration?pixel=79124023&nid=2142538&cont=i`
  }

  return (
    <main
      onClick={() => {
        const modalModifyBookingDetails = document.getElementById('modify-booking-details');
        const modalDepart = document.getElementById('modal-depart');
        const modalReturn = document.getElementById('modal-return');
        const modalPassenger = document.getElementById('modal-passenger');

        window.onclick = function (event) {
          if (
            event.target === modalDepart ||
            event.target === modalReturn ||
            event.target === modalPassenger ||
            event.target === modalModifyBookingDetails
          ) {
            setShowModal({
              depart: false,
              return: false,
              passenger: false,
              modifyBookingDetails: false,
            });
            document.body.style.overflow = 'unset';
            passengerModify && setPassengerModify(false);
          }
        };
      }}
    >
      <Image
        src={'https://ipac.ctnsnet.com/int/integration?pixel=79124023&nid=2142538&cont=i'}
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
            {router?.query?.error !== undefined && router?.query?.error?.length > 0 ? (
              ''
            ) : (
              <div className="xl:not-sr-only	xs:sr-only">
                <div className="fixed top-24 right-3.5  xl:m-auto price-modal  z-50	">
                  <ModifyBookingModal
                    openModal={() => {
                      setShowModal({
                        depart: false,
                        return: false,
                        passenger: false,
                        modifyBookingDetails: true,
                      });
                      document.body.style.overflow = 'hidden';
                    }}
                    mealDetails={mealsDetails()}
                    featuredAddons={featuredAddons}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-20 ">
            <div className="xl:w-2/4 xl:m-auto xs:w-full xl:pt-6 xs:pt-24">
              <div className="flex justify-between items-center"></div>
              <div>
                <h1 className="text-2xl font-black text-black">
                  {!modifyData
                    ? getFieldName(bookingCompleteContent, 'heading')
                    : getFieldName(bookingCompleteContent, 'paymentSuccess')}
                </h1>
              </div>
              {router?.query?.error !== undefined && router?.query?.error?.length > 0 ? (
                ''
              ) : (
                <div className="py-1">
                  <p className="font-medium text-base text-pearlgray">
                    {!modifyData
                      ? getFieldName(bookingCompleteContent, 'content')
                      : getFieldName(bookingCompleteContent, 'paymentSuccessContent')}
                  </p>
                </div>
              )}
              <div className="py-2 xl:w-2/4 md:w-6/12 xs:w-64 ">
                <div className="text-aqua text-sm font-normal p-2 border-aqua border bg-lightaqua rounded-lg flex gap-2 items-center justify-between">
                  <div className="text-aqua text-base font-black">
                    {getFieldName(bookingCompleteContent, 'bookingRef')}:{' '}
                    {router?.query?.error !== undefined && router?.query?.error?.length > 0
                      ? createBookingInfo?.PnrInformation?.PnrCode
                      : bookingCompleteInfo?.PnrInformation?.PnrCode}
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (bookingCompleteInfo?.PnrInformation?.PnrCode) {
                        navigator.clipboard.writeText(bookingCompleteInfo?.PnrInformation?.PnrCode);
                        setCopyText(true);
                        setTimeout(() => {
                          setCopyText(false);
                        }, 1000);
                      }
                    }}
                  >
                    <Image
                      className="h-6 w-6 object-cover"
                      src={getImageSrc(bookingCompleteContent, 'copyLogo')}
                      alt=""
                      height={60}
                      width={60}
                    />
                  </div>
                </div>
                {copyText && (
                  <div className="text-black">{getFieldName(bookingCompleteContent, 'copied')}</div>
                )}
              </div>
              {router?.query?.error !== undefined && router?.query?.error?.length > 0 ? (
                <div className=" xs:block gap-2 py-3 text-black">
                  <p>
                    It seems processing of your payment is taking a bit longer, please get in touch
                    with our{' '}
                    <a href="/contact" target="_blank" rel="noopener noreferrer">
                      <span className="text-aqua"> Contact centre</span>
                    </a>
                  </p>
                </div>
              ) : (
                <div>
                  <div className=" xs:block gap-2 py-3 pb-40">
                    <div className="bg-white  xl:w-full mb-1 rounded-2xl">
                      <CodesInCurve
                        originCity={flightData?.OriginCity}
                        originCode={flightData?.OriginCode}
                        destinationCity={flightData?.DestinationCity}
                        destinationCode={flightData?.DestinationCode}
                        oneway={bookingCompleteInfo?.OriginDestination?.length < 2}
                      />
                      <div className="p-4">
                        {bookingCompleteInfo?.OriginDestination?.map(
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
                          modifyBooking={true}
                          name="flightAvailability"
                          closeModal={() => {
                            setShowModal({
                              depart: false,
                              return: false,
                              passenger: false,
                              modifyBookingDetails: passengerModify ? false : true,
                            });
                            passengerModify && setPassengerModify(false);
                            passengerModify
                              ? (document.body.style.overflow = 'unset')
                              : (document.body.style.overflow = 'hidden');
                          }}
                          adult={passengerCount?.adult}
                          flightDetails={passengerCount}
                          showModal={showModal?.passenger}
                          childrens={passengerCount?.children}
                          setFlightDetails={setPassengerCount}
                        />
                        <DepartReturnDateModal
                          editDate={true}
                          closeModal={() => {
                            setShowModal({
                              depart: false,
                              return: false,
                              passenger: false,
                              modifyBookingDetails: true,
                            });
                            document.body.style.overflow = 'hidden';
                          }}
                          modifyBooking={true}
                          setShowModal={setShowModal}
                          errorMessage={errorMessage}
                          flightDetails={flightDetails}
                          fareFamilyName={flightInfo?.name ? flightInfo?.name : 'bliss'}
                          fareFamilyValue={flightInfo?.name ? flightInfo?.name : 'Bliss'}
                          setErrorMessage={setErrorMessage}
                          setFlightDetails={setFlightDetails}
                          setOldDates={() => {
                            setFlightDetails({
                              departDate: new Date(departDate),
                              returnDate: new Date(returnDate),
                              dateFlexible: true,
                            });
                          }}
                          returnDate={flightDetails.returnDate}
                          departDate={flightDetails.departDate}
                          dateFlexible={flightDetails?.dateFlexible}
                          name={showModal?.depart ? 'Departure' : 'Return'}
                          oneway={
                            bookingCompleteInfo?.OriginDestination?.length === 1 ? true : false
                          }
                          id={showModal?.depart ? 'modal-depart' : 'modal-return'}
                          showModal={showModal?.depart ? showModal?.depart : showModal?.return}
                          originCode={
                            showModal?.depart ? flightData?.OriginCode : flightData?.DestinationCode
                          }
                          destinationCode={
                            showModal?.depart ? flightData?.DestinationCode : flightData?.OriginCode
                          }
                        />
                        <ModifyPassengerSeatFareFamily
                          // passengerModify={() => {
                          //   setShowModal({
                          //     depart: false,
                          //     return: false,
                          //     passenger: true,
                          //     modifyBookingDetails: false,
                          //   });
                          //   setPassengerModify(true);
                          //   document.body.style.overflow = 'hidden';
                          // }}
                          seatsModify={() => {
                            router.push('/chooseseats');
                            dispatch(
                              loader({
                                show: true,
                                name: 'seats',
                              })
                            );
                            dispatch(setModifySeat(true));
                            dispatch(setModifyBookingFromBooking(true));
                            setTimeout(() => {
                              dispatch(
                                loader({
                                  show: false,
                                  name: '',
                                })
                              );
                            }, 2000);
                          }}
                          mealsModify={() => {
                            router.push('/passengerdetails');
                            dispatch(
                              loader({
                                show: true,
                                name: 'get',
                              })
                            );
                            dispatch(setModifyMeal(true));
                            dispatch(setSelectedMeal(mealsDetails()));
                            setTimeout(() => {
                              dispatch(
                                loader({
                                  show: false,
                                  name: '',
                                })
                              );
                            }, 2000);
                          }}
                          mealsLabel={mealsDetails()}
                          adult={passengerCount?.adult}
                          fareFamilyName={flightInfo?.name ? flightInfo?.name : 'bliss'}
                          childrens={passengerCount?.children}
                          seatsLabel={
                            allSeats && allSeats?.length > 0 && allSeats[0] ? allSeats?.flat(1) : []
                          }
                        />
                      </div>
                      <PriceBreakDown
                        fareFamilyName={flightInfo?.name ? flightInfo?.name : 'bliss'}
                        currency={
                          bookingCompleteInfo?.Amount?.SaleCurrencyCode
                            ? bookingCompleteInfo?.Amount?.SaleCurrencyCode
                            : flightInfo?.details?.currency
                        }
                        passengerCount={storedPassengerData?.length}
                        taxAmount={bookingCompleteInfo?.Amount?.TaxAmount?.toLocaleString('en-GB')}
                        baseAmount={bookingCompleteInfo?.Amount?.BaseAmount?.toLocaleString(
                          'en-GB'
                        )}
                        totalAmount={bookingCompleteInfo?.Amount?.TotalAmount?.toLocaleString(
                          'en-GB'
                        )}
                      />
                    </div>
                    {/* <FeaturedAddOns
                      featuredAddons={featuredAddons}
                      setFeaturedAddons={setFeaturedAddons}
                    /> */}
                  </div>
                </div>
              )}
              <ModifyBookingDetailsModal
                id="modify-booking-details"
                closeModal={() => {
                  setShowModal({
                    depart: false,
                    return: false,
                    passenger: false,
                    modifyBookingDetails: false,
                  });
                  document.body.style.overflow = 'unset';
                }}
                // passengerModify={() => {
                //   setShowModal({
                //     depart: false,
                //     return: false,
                //     passenger: true,
                //     modifyBookingDetails: false,
                //   });
                //   document.body.style.overflow = 'hidden';
                // }}
                datesModify={() => {
                  setShowModal({
                    depart: true,
                    return: false,
                    passenger: false,
                    modifyBookingDetails: false,
                  });
                  document.body.style.overflow = 'hidden';
                }}
                seatsModify={() => {
                  router.push('/chooseseats');
                  dispatch(
                    loader({
                      show: true,
                      name: 'seats',
                    })
                  );
                  dispatch(setModifySeat(true));
                  dispatch(setModifyBookingFromBooking(true));
                  setTimeout(() => {
                    dispatch(
                      loader({
                        show: false,
                        name: '',
                      })
                    );
                  }, 2000);
                  document.body.style.overflow = 'unset';
                }}
                cancelBooking={() => {
                  dispatch(
                    loader({
                      show: true,
                      name: 'cancel',
                    })
                  );
                  dispatch(
                    postPrepareCancelFlight(
                      {
                        PnrCode: !modifyData
                          ? bookingCompleteInfo?.PnrInformation?.PnrCode
                          : findBookingInfo?.ID,
                        PassengerName: !modifyData
                          ? passengerDetails && passengerDetails?.length > 0
                            ? passengerDetails[0].Surname
                            : ''
                          : findBookingInfo?.PassengerName,
                      },
                      router
                    ) as unknown as AnyAction
                  );
                  document.body.style.overflow = 'unset';
                }}
                seatsLabel={
                  allSeats && allSeats?.length > 0 && allSeats[0] ? allSeats?.flat(1) : []
                }
                // adult={passengerCount?.adult}
                // fareFamilyName={flightInfo?.name}
                // childrens={passengerCount?.children}
                showModal={showModal?.modifyBookingDetails}
                returnDate={getDate(flightDetails?.returnDate?.toJSON())}
                departDate={getDate(flightDetails?.departDate?.toJSON())}
              />
              {router?.query?.error !== undefined && router?.query?.error?.length > 0 ? (
                ''
              ) : (
                <div className="xs:not-sr-only	xl:sr-only">
                  <div
                    className={`fixed w-full left-0 bottom-0 ${
                      showModal?.depart ||
                      showModal?.return ||
                      showModal?.modifyBookingDetails ||
                      showModal?.passenger
                        ? ''
                        : 'z-50'
                    }`}
                  >
                    <ModifyBookingModal
                      openModal={() => {
                        setShowModal({
                          depart: false,
                          return: false,
                          passenger: false,
                          modifyBookingDetails: true,
                        });
                        document.body.style.overflow = 'hidden';
                      }}
                      mealDetails={mealsDetails()}
                      featuredAddons={featuredAddons}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : load?.name === 'search' ? (
        <SearchFlightLoader open={load?.show} />
      ) : load?.name === 'cancel' ? (
        <CancelBookingLoader open={load?.show} />
      ) : load?.name === 'seats' ? (
        <SearchSeatLoader open={load?.show} />
      ) : load?.name === 'get' ? (
        <GettingDataLoader open={load?.show} />
      ) : (
        load?.name === 'payment' && <PaymentGatewayLoader open={load?.show} />
      )}
    </main>
  );
};

export default BookingComplete;