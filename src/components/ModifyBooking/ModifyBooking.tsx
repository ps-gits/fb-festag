import axios from 'axios';
import Image from 'next/image';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  postPrepareCancelFlight,
  getEligibleDestinationsToOrigin,
  getEligibleOriginToDestinations,
} from 'src/redux/action/SearchFlights';
import { RootState } from 'src/redux/store';
// import FeaturedAddOns from './FeaturedAddOns';
import { getDate } from '../ReviewTrip/GetDate';
import { loader } from 'src/redux/reducer/Loader';
import PassengerCount from '../Modal/PassengerCount';
import CodesInCurve from '../ReviewTrip/CodesInCurve';
import FlightSchedule from '../ReviewTrip/FlightSchedule';
import PriceBreakDown from '../ReviewTrip/PriceBreakDown';
import SavingDataLoader from 'components/Loader/SavingData';
import SearchSeatLoader from 'components/Loader/SearchSeat';
import ModifyBookingModal from '../Modal/ModifyBookingModal';
import FindYourBookingLoader from '../Loader/FindYourBooking';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import GettingDataLoader from 'components/Loader/GettingData';
import CancelBookingLoader from '../Loader/CancelBookingLoader';
import { graphQLToken, graphQLUrl } from 'components/Api/ApiUrl';
import DepartReturnDateModal from '../Modal/DepartReturnDateModal';
import ModifyBookingDetailsModal from '../Modal/ModifyBookingDetailsModal';
import { setMealList, setNumberOfMeals } from 'src/redux/reducer/Sitecore';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';
import ModifyPassengerSeatFareFamily from '../ReviewTrip/ModifyPassengerSeatFareFamily';
import { setModifyMeal, setModifySeat, setSelectedMeal } from 'src/redux/reducer/FlightDetails';

const ModifyBooking = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const modifyBookingContent = useSelector(
    (state: RootState) => state?.sitecore?.bookingComplete?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const originToDestinationDates = useSelector(
    (state: RootState) => state?.flightDetails?.originToDestinationDates
  );
  const savedMealsData = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification
  );
  const mealsList = useSelector((state: RootState) => state?.sitecore?.mealList);
  const cartData = useSelector((state: RootState) => state?.flightDetails?.yourCart);
  const allMealData = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification?.MealsDetails
  );
  const numberOfMeals = useSelector((state: RootState) => state?.sitecore?.numberOfMeals);
  const flightInfo = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const findBookingInfo = useSelector((state: RootState) => state?.flightDetails?.findBooking);
  const chooseMealContent = useSelector((state: RootState) => state?.sitecore?.chooseMeal?.fields);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);
  const reviewTripContent = useSelector((state: RootState) => state?.sitecore?.reviewTrip?.fields);

  const departDate = modifyBookingInfo?.OriginDestination?.find(
    (item: object, index: number) => item !== undefined && index === 0
  )?.DepartureDate;

  const returnDate = modifyBookingInfo?.OriginDestination?.find(
    (item: object, index: number) => item !== undefined && index === 1
  )?.ArrivalDate;

  const flightData = modifyBookingInfo?.OriginDestination?.find(
    (item: object) => item !== undefined
  );

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
  const [featuredAddons] = useState<{ name: string; amount: number; quantity: number }[]>(
    cartData ? cartData : []
  );
  // const [featuredAddons, setFeaturedAddons] = useState<
  //   { name: string; amount: number; quantity: number }[]
  // >(cartData ? cartData : []);
  const [passengerModify, setPassengerModify] = useState(false);
  const [flightDetails, setFlightDetails] = useState({
    departDate: new Date(new Date(departDate).setDate(new Date(departDate).getUTCDate())),
    returnDate: new Date(new Date(returnDate).setDate(new Date(returnDate).getUTCDate())),
    dateFlexible: true,
  });
  const [passengerCount, setPassengerCount] = useState({
    adult: modifyBookingInfo?.Passengers?.Adult ? modifyBookingInfo?.Passengers?.Adult : 1,
    children: modifyBookingInfo?.Passengers?.Children ? modifyBookingInfo?.Passengers?.Children : 0,
  });

  useEffect(() => {
    if (
      flightData?.OriginCode &&
      flightData?.DestinationCode &&
      originToDestinationDates?.find(
        (item: { OriginCode: string; DestinationCode: string }) =>
          item?.OriginCode === flightData?.OriginCode &&
          item?.DestinationCode === flightData?.DestinationCode
      ) === undefined
    ) {
      dispatch(
        getEligibleOriginToDestinations({
          OriginCode: flightData?.OriginCode,
          DestinationCode: flightData?.DestinationCode,
        }) as unknown as AnyAction
      );
      dispatch(
        getEligibleDestinationsToOrigin({
          DestinationCode: flightData?.OriginCode,
          OriginCode: flightData?.DestinationCode,
        }) as unknown as AnyAction
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chooseMealContent !== undefined && getMealsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chooseMealContent]);

  const getMealsList = async () => {
    const mealParentIds = getFieldName(chooseMealContent, 'dietaryMealData')?.split('|');

    const allMealsIds: string[] = [];

    const mealsInfo = [];
    let mealListData: {
      name: string;
      fields: { id: string; name: string; value: string }[];
    }[] = [];

    mealParentIds?.map(async (item, index) => {
      const response = await axios.post(
        `${graphQLUrl}`,
        {
          query: `{item(path: "${item}",language: "EN") {name\nfields{id\nname\nvalue\n}\n}\n}`,
        },
        {
          headers: {
            'x-gql-token': graphQLToken,
          },
        }
      );

      const mealsIds = await response?.data?.data?.item?.fields
        ?.find((item: { name: string }) => item?.name === 'items')
        ?.value?.split('|');

      mealsInfo.push({
        length: mealsIds?.length,
        index: index,
      });

      mealsIds?.map((dt: string) => allMealsIds.push(dt));

      if (
        (index === mealParentIds?.length - 1 &&
          numberOfMeals !== allMealsIds?.length &&
          mealsInfo?.length === mealParentIds?.length) ||
        (mealsInfo?.length === mealParentIds?.length && mealsList?.length === 0)
      ) {
        allMealsIds?.map(async (mealId) => {
          const response = await axios.post(
            `${graphQLUrl}`,
            {
              query: `{item(path: "${mealId}",language: "EN") {name\nfields{id\nname\nvalue\n}\n}\n}`,
            },
            {
              headers: {
                'x-gql-token': graphQLToken,
              },
            }
          );
          mealListData.push(response?.data?.data?.item);
          mealListData = mealListData?.filter(
            (item, index) => index === mealListData?.findIndex((dt) => dt?.name === item?.name)
          );
          if (mealListData?.length === allMealsIds?.length) {
            const finalList = mealListData?.map((item) => {
              return item?.fields.reduce(
                (obj, item) => Object.assign(obj, { [item.name]: item.value }),
                {}
              );
            });
            dispatch(setMealList(finalList));
            dispatch(setNumberOfMeals(allMealsIds?.length));
          }
        });
      }
    });
  };

  const seatsOriginToDestination = modifyBookingInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields
        .filter((item: { Code: string }) => item?.Code === 'SEAT')
        ?.find((item, index) => item?.Code !== undefined && index === 0)
  );

  const seatsDestinationToOrigin = modifyBookingInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields
        .filter((item: { Code: string }) => item?.Code === 'SEAT')
        ?.find((item, index) => item?.Code !== undefined && index === 1)
  );

  const allSeats = modifyBookingInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields?.filter((item: { Code: string }) => item?.Code === 'SEAT')?.map((item) => item)
  );

  const mealsDetails = () => {
    if (mealsList?.length > 0 && mealsList?.length === numberOfMeals) {
      const filterMealList = allMealData?.map((item: { fields: { Code: string }[] }) => {
        const list = item?.fields?.filter(
          (dt: { Code: string }) =>
            mealsList?.find((ml: { code: string }) => ml?.code === dt?.Code) !== undefined
        );
        return {
          fields: list?.filter(
            (dt, index) => index === list?.findIndex((ml) => ml?.Code === dt?.Code)
          ),
        };
      });

      const mealsResponse = savedMealsData?.PassengersDetails?.map(
        (item: { fields: { Code: string }[] }, index: number) =>
          item?.fields
            ?.filter(
              (item: { Code: string }) =>
                filterMealList !== undefined &&
                filterMealList[index] !== undefined &&
                filterMealList[index]?.fields?.find(
                  (dt: { Code: string }) => dt?.Code === item?.Code
                )
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
              modifyBookingInfo?.OriginDestination?.length === 1 ? '' : 'Regular Meal';
            mealData['returnMealCode'] = '';
          }
          item.map((meal: { type: string; Code: string }) => {
            if (meal?.type?.toLowerCase() === 'departure') {
              mealData['originMeal'] = 'Dietary Meal';
              mealData['originMealCode'] = meal.Code;
              if (item.length === 1) {
                mealData['returnMeal'] =
                  modifyBookingInfo?.OriginDestination?.length === 1 ? '' : 'Regular Meal';
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
    } else {
      return [];
    }
  };

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
              <div className="fixed top-24 right-3.5  xl:m-auto price-modal">
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
          </div>
          <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-24 xl:mt-0 xs:pt-20 ">
            <div className="xl:w-2/4 xl:m-auto xs:w-full">
              <div className="flex justify-between items-center xl:py-0 xs:py-3">
                <div
                  className="xl:py-3 xs:py-0 cursor-pointer"
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    aria-hidden="true"
                    className="text-black text-sm font-black h-4 w-4"
                  />
                  <span className="px-2 text-black text-sm font-black">
                    {getFieldName(reviewTripContent, 'backButton')}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-black">
                  {getFieldName(modifyBookingContent, 'manageBooking')}
                </h1>
              </div>
              <div className="py-1">
                <p className="font-medium text-base text-pearlgray">
                  {getFieldName(modifyBookingContent, 'content')}
                </p>
              </div>
              <div className="py-2 xl:w-2/4 md:w-6/12 xs:w-64 ">
                <div className="text-aqua text-sm font-normal p-2 border-aqua border bg-lightaqua rounded-lg flex gap-2 items-center justify-between">
                  <div className="text-aqua text-base font-black">
                    {getFieldName(modifyBookingContent, 'bookingRef')}:{' '}
                    {modifyBookingInfo?.PnrInformation?.PnrCode}
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (modifyBookingInfo?.PnrInformation?.PnrCode) {
                        navigator.clipboard.writeText(modifyBookingInfo?.PnrInformation?.PnrCode);
                        setCopyText(true);
                        setTimeout(() => {
                          setCopyText(false);
                        }, 1000);
                      }
                    }}
                  >
                    <Image
                      className="h-6 w-6 object-cover"
                      src={getImageSrc(modifyBookingContent, 'copyLogo')}
                      alt=""
                      width={60}
                      height={60}
                    />
                  </div>
                </div>
                {copyText && (
                  <div className="text-black">{getFieldName(modifyBookingContent, 'copied')}</div>
                )}
              </div>
              <div>
                <div className=" xs:block gap-2 py-3 pb-40">
                  <div className="bg-white  xl:w-full mb-1 rounded-2xl">
                    <CodesInCurve
                      originCity={flightData?.OriginCity}
                      originCode={flightData?.OriginCode}
                      destinationCity={flightData?.DestinationCity}
                      destinationCode={flightData?.DestinationCode}
                      oneway={modifyBookingInfo?.OriginDestination?.length < 2}
                    />
                    <div className="p-4">
                      {modifyBookingInfo?.OriginDestination?.map(
                        (item: bookingDetails, index: number) => {
                          return (
                            <div key={index}>
                              <FlightSchedule
                                index={index}
                                seats={true}
                                loungeAccess={item?.Lounge}
                                luxuryPickup={item?.Luxury}
                                originCode={item?.OriginCode}
                                arrivalDate={item?.ArrivalDate}
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
                        adult={passengerCount?.adult}
                        flightDetails={passengerCount}
                        showModal={showModal?.passenger}
                        childrens={passengerCount?.children}
                        setFlightDetails={setPassengerCount}
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
                        oneway={modifyBookingInfo?.OriginDestination?.length === 1 ? true : false}
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
                        mealsModify={() => {
                          router.push('/passengerdetails');
                          dispatch(
                            loader({
                              show: true,
                              name: 'get',
                            })
                          );
                          dispatch(setSelectedMeal(mealsDetails()));
                          dispatch(setModifyMeal(true));
                          setTimeout(() => {
                            dispatch(
                              loader({
                                show: false,
                                name: '',
                              })
                            );
                          }, 2000);
                        }}
                        adult={passengerCount?.adult}
                        fareFamilyName="Bliss"
                        // fareFamilyName={flightInfo?.name}
                        childrens={passengerCount?.children}
                        mealsLabel={mealsDetails()}
                        seatsLabel={
                          allSeats && allSeats?.length > 0 && allSeats[0] ? allSeats?.flat(1) : []
                        }
                      />
                    </div>
                    <PriceBreakDown
                      currency={modifyBookingInfo?.Amount?.SaleCurrencyCode}
                      passengerCount={1}
                      fareFamilyName="Bliss"
                      // fareFamilyName={flightInfo?.name}
                      taxAmount={modifyBookingInfo?.Amount?.TaxAmount?.toLocaleString('en-GB')}
                      baseAmount={modifyBookingInfo?.Amount?.BaseAmount?.toLocaleString('en-GB')}
                      totalAmount={modifyBookingInfo?.Amount?.TotalAmount?.toLocaleString('en-GB')}
                    />
                  </div>
                  {/* <FeaturedAddOns
                    featuredAddons={featuredAddons}
                    setFeaturedAddons={setFeaturedAddons}
                  /> */}
                </div>
              </div>
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
                        PnrCode: findBookingInfo?.ID,
                        PassengerName: findBookingInfo?.PassengerName,
                      },
                      router
                    ) as unknown as AnyAction
                  );
                  document.body.style.overflow = 'unset';
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
                  dispatch(setSelectedMeal(mealsDetails()));
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
                // fareFamilyName="Bliss"
                // adult={passengerCount?.adult}
                // fareFamilyName={flightInfo?.name}
                // childrens={passengerCount?.children}
                showModal={showModal?.modifyBookingDetails}
                returnDate={getDate(flightDetails?.returnDate?.toJSON())}
                departDate={getDate(flightDetails?.departDate?.toJSON())}
                seatsLabel={
                  allSeats && allSeats?.length > 0 && allSeats[0] ? allSeats?.flat(1) : []
                }
              />
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
            </div>
          </div>
        </div>
      ) : load?.name === 'search' ? (
        <SearchFlightLoader open={load?.show} />
      ) : load?.name === 'cancel' ? (
        <CancelBookingLoader open={load?.show} />
      ) : load.name === 'findbooking' ? (
        <FindYourBookingLoader open={load?.show} />
      ) : load?.name === 'seats' ? (
        <SearchSeatLoader open={load?.show} />
      ) : load?.name === 'get' ? (
        <GettingDataLoader open={load?.show} />
      ) : (
        <SavingDataLoader open={load?.show} />
      )}
    </main>
  );
};

export default ModifyBooking;
