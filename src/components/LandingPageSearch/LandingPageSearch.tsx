import * as Yup from 'yup';
import moment from 'moment';
import Image from 'next/image';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik, ErrorMessage, Field } from 'formik';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useCallback, useEffect, useState } from 'react';
// import { faArrowRight, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

import clock from '../../assets/images/clock.png';
import land from '../../assets/images/plane-land.png';
import calendar from '../../assets/images/calendar.png';
import orangeplane from '../../assets/images/planeblue.png';
import takeoff from '../../assets/images/plane-takeoff.png';
// import DepartReturnDateModal from '../../Modal/DepartReturnDateModal';

import {
  postModifyBooking,
  postPrepareBookingModification,
  getEligibleDestinationsToOrigin,
  getEligibleOriginToDestinations,
} from 'src/redux/action/SearchFlights';
import {
  setYourCart,
  setModifySeat,
  setUpdateCart,
  setModifyMeal,
  setModifyDates,
  setSelectedMeal,
  setChooseSeatData,
  setSelectedFlightData,
  setSelectSeatLaterData,
  setAcceptTermsConditions,
  setModifyBookingFromBooking,
} from 'src/redux/reducer/FlightDetails';
import { RootState } from 'src/redux/store';
import { debounce } from '../Debounce/Debounce';
import { loader } from 'src/redux/reducer/Loader';
import SignInLoader from 'components/Loader/SignInLoader';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import SpecialOfferModal from 'components/Modal/SpecialOfferModal';
import { countryNames } from 'components/SearchFlight/CountryData';
import FindYourBookingLoader from 'components/Loader/FindYourBooking';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';
import { setPassengerDetails } from 'src/redux/reducer/PassengerDetails';
import { getSitecoreContent, getSitecoreData } from 'src/redux/action/Sitecore';
import LandingPageSearchBar from 'components/SearchFlight/Tabs/LandingPageSearchBar';
import { getDestinationDetails, getOriginDetails } from 'src/redux/action/AirportDetails';
import LandingPageOnewaySearchBar from 'components/SearchFlight/Tabs/LandingPageOnewaySearchBar';
// import DropdownModal from 'components/Modal/DropdownModal';
// import DepartReturnDateModal from 'components/Modal/DepartReturnDateModal';

const LandingPageSearch = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // const flightScheduleContent = useSelector(
  //   (state: RootState) => state?.sitecore?.commonImages?.fields
  // );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  // const createAccountContent = useSelector(
  //   (state: RootState) => state?.sitecore?.createAccount?.fields
  // );
  // const searchAirportContent = useSelector(
  //   (state: RootState) => state?.sitecore?.searchAirport?.fields
  // );
  // const passengerModalContent = useSelector(
  //   (state: RootState) => state?.sitecore?.passengerModal?.fields
  // );
  // const promocodeModalContent = useSelector(
  //   (state: RootState) => state?.sitecore?.promoCodeModal?.fields
  // );
  const findBookingContent = useSelector(
    (state: RootState) => state?.sitecore?.findBooking?.fields
  );
  const flightAvailabilityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const landingPageSearchContent = useSelector(
    (state: RootState) => state?.sitecore?.landingPageSearch?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const originToDestinationDates = useSelector(
    (state: RootState) => state?.flightDetails?.originToDestinationDates
  );
  const destinationToOriginDates = useSelector(
    (state: RootState) => state?.flightDetails?.destinationToOriginDates
  );
  const selectedFlightInfo = useSelector(
    (state: RootState) => state?.flightDetails?.selectedFlightCodesWithDate
  );
  // const landingPageSearchContent = useSelector(
  //   (state: RootState) => state?.sitecore?.landingPageSearch?.fields
  // );
  const { originDetails } = useSelector((state: RootState) => state?.airportDetails);
  const { destinationDetails } = useSelector((state: RootState) => state?.airportDetails);
  // const loaderContent = useSelector((state: RootState) => state?.sitecore?.loader?.fields);
  // const stepInfoContent = useSelector((state: RootState) => state?.sitecore?.stepInfo?.fields);
  // const dateModalContent = useSelector((state: RootState) => state?.sitecore?.dateModal?.fields);

  const { adult, children, departDate, returnDate, originCode, destinationCode } =
    selectedFlightInfo;

  const checkDate =
    new Date(departDate).valueOf() >= new Date(new Date().toJSON().split('T')[0]).valueOf();

  const [loading, setLoading] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showModal, setShowModal] = useState({
    depart: false,
    return: false,
    passenger: false,
    promoCode: false,
    destination: false,
  });
  const [tabName, setTabName] = useState('return');
  const [tabIndex, setTabIndex] = useState(0);
  const [flightDetails, setFlightDetails] = useState({
    adult: checkDate && adult ? adult : 1,
    children: checkDate && children ? children : 0,
    promoCode: '',
    originCode: checkDate && originCode ? originCode : '',
    dateFlexible: true,
    destinationCode: checkDate && destinationCode ? destinationCode : '',
    // departDate: checkDate && departDate ? new Date(departDate) : new Date(),
    // returnDate: checkDate && returnDate ? new Date(returnDate) : new Date(),
    departDate: checkDate && departDate ? new Date(departDate) : '',
    returnDate: checkDate && returnDate ? new Date(returnDate) : '',
  });
  const [errorMessage, setErrorMessage] = useState({
    departure: '',
    returnDate: '',
    arrival: '',
  });
  const [selectOptions, setSelectOptions] = useState<
    {
      country: string;
      code: string;
      Label: string;
    }[]
  >([]);
  const [openSelectModal, setOpenSelectModal] = useState(false);

  useEffect(() => {
    if (checkDate && originCode && destinationCode) {
      originToDestinationDates?.find(
        (item: { OriginCode: string; DestinationCode: string }) =>
          item?.OriginCode === originCode && item?.DestinationCode === destinationCode
      ) === undefined &&
        dispatch(
          getEligibleOriginToDestinations({
            OriginCode: originCode,
            DestinationCode: destinationCode,
          }) as unknown as AnyAction
        );

      destinationToOriginDates?.find(
        (item: { OriginCode: string; DestinationCode: string }) =>
          item?.OriginCode === destinationCode && item?.DestinationCode === originCode
      ) === undefined &&
        dispatch(
          getEligibleDestinationsToOrigin({
            DestinationCode: originCode,
            OriginCode: destinationCode,
          }) as unknown as AnyAction
        );
    }

    destinationCode?.length > 0 &&
      dropdownOptionDestination?.find((item: { code: string }) => item?.code === destinationCode)
        ?.Label === undefined &&
      dispatch(getDestinationDetails(originCode) as unknown as AnyAction);

    typeof departDate === 'object' && typeof returnDate === 'string' && setTabName('oneway');

    const timer = setTimeout(() => {
      setShowOffer(true);
      
    }, 5000);

    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setYourCart([]));
    dispatch(setSelectedMeal([]));
    dispatch(setModifySeat(false));
    dispatch(setModifyMeal(false));
    dispatch(setUpdateCart(false));
    dispatch(setModifyDates(false));
    dispatch(setChooseSeatData([]));
    dispatch(setPassengerDetails([]));
    dispatch(setSelectedFlightData([]));
    dispatch(setSelectSeatLaterData(false));
    dispatch(setAcceptTermsConditions(false));
    dispatch(setModifyBookingFromBooking(false));
    dispatch(getOriginDetails() as unknown as AnyAction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getSitecoreContent('Loader') as unknown as AnyAction);
    dispatch(getSitecoreContent('Payment') as unknown as AnyAction);
    dispatch(getSitecoreData('Choose-Meal') as unknown as AnyAction);
    dispatch(getSitecoreContent('Step-Info') as unknown as AnyAction);
    dispatch(getSitecoreContent('Date-Modal') as unknown as AnyAction);
    dispatch(getSitecoreContent('Review-Trip') as unknown as AnyAction);
    dispatch(getSitecoreContent('Choose-Seat') as unknown as AnyAction);
    dispatch(getSitecoreContent('Cancel-Modal') as unknown as AnyAction);
    dispatch(getSitecoreContent('Find-Booking') as unknown as AnyAction);
    dispatch(getSitecoreContent('Common-Images') as unknown as AnyAction);
    dispatch(getSitecoreContent('Search-Flight') as unknown as AnyAction);
    dispatch(getSitecoreContent('Search-Airport') as unknown as AnyAction);
    dispatch(getSitecoreContent('Create-Account') as unknown as AnyAction);
    dispatch(getSitecoreContent('Cancel-Success') as unknown as AnyAction);
    dispatch(getSitecoreContent('Passenger-Modal') as unknown as AnyAction);
    dispatch(getSitecoreContent('Promocode-Modal') as unknown as AnyAction);
    dispatch(getSitecoreContent('Booking-Complete') as unknown as AnyAction);
    dispatch(getSitecoreContent('Passenger-Details') as unknown as AnyAction);
    dispatch(getSitecoreContent('LandingPage-Search') as unknown as AnyAction);
    dispatch(getSitecoreContent('Flight-Availability') as unknown as AnyAction);
    dispatch(getSitecoreContent('Modify-Booking-Modal') as unknown as AnyAction);
  }, [dispatch]);

  const dropdownOptionOrigin = originDetails?.map(
    (item: { city: string; iata: string; country: string }) => {
      return {
        ...item,
        country: countryNames?.find((dt) => dt?.code === item?.country)?.name,
        code: item?.iata,
      };
    }
  );

  const dropdownOptionDestination = destinationDetails?.map(
    (item: { city: string; iata: string; country: string }) => {
      return {
        ...item,
        country: countryNames?.find((dt) => dt?.code === item?.country)?.name,
        code: item?.iata,
      };
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchDataWithDelay = useCallback(
    debounce((value: string) => {
      if (value?.length > 0) {
        const filterOptions = (
          !showModal?.destination && openSelectModal
            ? dropdownOptionOrigin
            : dropdownOptionDestination
        )?.filter((item: { Label: string }) => {
          return item && item.Label?.toLowerCase()?.includes(value?.toLowerCase());
        }) as {
          country: string;
          code: string;
          Label: string;
        }[];
        setSelectOptions(filterOptions);
      } else {
        setSelectOptions(
          !showModal?.destination && openSelectModal
            ? dropdownOptionOrigin
            : dropdownOptionDestination
        );
      }
      setLoading(false);
    }, 1000),
    [showModal?.destination, openSelectModal]
  );

  const getDate = (type: string) => {
    const formatDate = moment(
      type === 'depart' ? flightDetails?.departDate : flightDetails?.returnDate
    )
      .format('LL')
      ?.split(',')[0]
      ?.split(' ');
    const temp = formatDate[1];
    formatDate[1] = formatDate[0]?.slice(0, 3);
    formatDate[0] = temp;
    const finalDate =
      formatDate?.join(' ') +
      moment(type === 'depart' ? flightDetails?.departDate : flightDetails?.returnDate)
        .format('LL')
        ?.split(',')[1];
    // return finalDate === 'date Invundefined' ? 'Select Date' : finalDate;
    //new-added
    return type === 'depart'
      ? typeof flightDetails?.departDate === 'object'
        ? finalDate
        : 'Select Date'
      : typeof flightDetails?.returnDate === 'object'
      ? finalDate
      : 'Select Date';
  };

  const selectedFareFamily = flightAvailabilityContent?.find(
    (item: { name: string }) => item?.name === 'bliss'
  );

  return (
    <>
      {!load?.show ? (
        <Fragment key={tabIndex}>
          <section className="bg-pink xs:bg-white">
            <div className="container">
              <div className="relative">
                <div className="w-full md:m-auto p-4 bg-white rounded-xl xl:absolute xl:-top-32 xs:relative xs:-top-8 shadow-md">
                  <ul>
                    <div className="lg:flex xs:flex-wrap justify-between items-center">
                      <div className="md:flex xs:block lg:w-8/12 lg:pr-3">
                        <li className="w-full md:w-4/12">
                          <button
                            className={`xl:w-full xs:w-full border-b-2 inline-block px-2 py-2 font-medium text-md xl:border-aqua xs:border-t-2 xs:border-l-2 md:border-r-0 xs:border-r-2 xl:rounded-tl-md xs:rounded-tr-md md:rounded-tr-none md:rounded-bl-md xs:rounded-tl-md xs:rounded-bl-none  ${
                              tabIndex === 0
                                ? 'bg-white border-b-4 text-aqua xl:border-aqua'
                                : 'text-silvergray bg-white border-aqua xl:border-2'
                            } hover:blue font-medium text-md`}
                            type="button"
                            onClick={() => {
                              setTabIndex(0);
                            }}
                          >
                            <div className="flex items-center xl:justify-center xs:justify-start gap-2">
                              <div>
                                <Image src={orangeplane} className=" h-4 w-4" alt="" />
                              </div>
                              <p className="font-medium text-sm text-pearlgray">Flight Booking</p>
                            </div>
                          </button>
                        </li>
                        <li className="w-full md:w-4/12">
                          <button
                            className={`xl:w-full xs:w-full md:border-2s inline-block px-2 py-2 font-medium text-md border-aqua xl:border-t-2 lg:border-l-2 md:border-r-0 xs:border-r-2 md:border-t-2 border-b-2 xs:border-l-2 ${
                              tabIndex === 1
                                ? 'bg-white text-aqua border-b-4 md:border-b-4 xl:border-aqua'
                                : 'text-silvergray md:border-2 bg-white border-aqua'
                            }  hover:blue font-medium text-md`}
                            type="button"
                            onClick={() => {
                              setTabIndex(1);
                            }}
                          >
                            <div className="flex items-center  xl:justify-center xs:justify-start gap-2">
                              <div>
                                <Image src={calendar} className=" h-4 w-4" alt="" />
                              </div>
                              <p className="font-medium text-sm text-pearlgray">Manage Booking</p>
                            </div>
                          </button>
                        </li>
                        <li className="w-full md:w-4/12">
                          <button
                            className={`xl:w-full xs:w-full inline-block px-2 py-2 font-medium text-md xl:border-aqua xs:border-t-0 md:border-t-2 xs:border-l-2 xs:border-r-2  md:rounded-tr-md xs:rounded-tr-none xl:rounded-br-md md:rounded-bl-none xs:rounded-bl-md xs:rounded-br-md ${
                              tabIndex === 2
                                ? 'bg-white border-b-4 text-aqua xl:border-aqua'
                                : 'text-silvergray border-2 bg-white border-aqua '
                            }  hover:blue font-medium text-md`}
                            type="button"
                            onClick={() => {
                              setTabIndex(2);
                            }}
                          >
                            <div className="flex items-center xl:justify-center xs:justify-start gap-2">
                              <div>
                                <Image src={clock} className=" h-4 w-4" alt="" />
                              </div>
                              <p className="font-medium text-sm text-pearlgray">Flight Status</p>
                            </div>
                          </button>
                        </li>
                      </div>
                      <div className="w-full lg:w-4/12 flex justify-end items-center">
                        <div className="lg:my-0 xs:my-4 w-full">
                          <ul className="flex m-auto justify-evenly items-center gap-5 lg:border-0 xs:border-2 xs:border-aqua xs:py-2 xs:px-3 lg:py-0 lg:px-0 xs:rounded-md">
                            <li className=" ">
                              <button
                                className={`xl:w-full xs:w-full inline-block font-medium text-md ' ${
                                  tabName === 'return'
                                    ? ' bg-white text-aqua '
                                    : ' text-silvergray bg-white xs:border-cadetgray '
                                } font-medium text-md`}
                                type="button"
                                onClick={() => {
                                  flightDetails?.originCode?.length > 0 &&
                                    flightDetails?.destinationCode?.length > 0 &&
                                    originToDestinationDates?.find(
                                      (item: { OriginCode: string; DestinationCode: string }) =>
                                        item?.OriginCode === flightDetails?.originCode &&
                                        item?.DestinationCode === flightDetails?.destinationCode
                                    ) === undefined &&
                                    dispatch(
                                      getEligibleOriginToDestinations({
                                        OriginCode: flightDetails?.originCode,
                                        DestinationCode: flightDetails?.destinationCode,
                                      }) as unknown as AnyAction
                                    );
                                  flightDetails?.originCode?.length > 0 &&
                                    flightDetails?.destinationCode?.length > 0 &&
                                    destinationToOriginDates?.find(
                                      (item: { OriginCode: string; DestinationCode: string }) =>
                                        item?.OriginCode === flightDetails?.destinationCode &&
                                        item?.DestinationCode === flightDetails?.originCode
                                    ) === undefined &&
                                    dispatch(
                                      getEligibleDestinationsToOrigin({
                                        DestinationCode: flightDetails?.originCode,
                                        OriginCode: flightDetails?.destinationCode,
                                      }) as unknown as AnyAction
                                    );
                                  setTabName('return');
                                  setErrorMessage({
                                    departure: '',
                                    returnDate: '',
                                    arrival: '',
                                  });
                                  flightDetails?.promoCode?.length &&
                                    setFlightDetails({
                                      ...flightDetails,
                                      promoCode: '',
                                    });
                                }}
                              >
                                <div className="flex items-center justify-center ">
                                  <div className="mt-1">
                                    <input
                                      id="default-radio-1"
                                      type="radio"
                                      checked={tabName === 'return'}
                                      name="default-radio-1"
                                      className="accent-aqua	 text-white w-4 h-4 opacity-70"
                                    />
                                  </div>
                                  {/* <p className="font-medium text-sm text-pearlgray" >
                                          {getFieldName(searchFlightContent, 'return')}
                                        </p> */}
                                  <label
                                    htmlFor="default-radio-1"
                                    className="ml-2 text-sm font-medium text-black"
                                  >
                                    {getFieldName(searchFlightContent, 'return')}
                                  </label>
                                </div>
                              </button>
                            </li>
                            <li className="">
                              <button
                                className={`xl:w-full xs:w-full  inline-block font-medium text-md    ${
                                  tabName === 'oneway'
                                    ? 'bg-white    text-aqua '
                                    : 'text-silvergray  bg-white'
                                }   hover:blue  font-medium text-md`}
                                type="button"
                                onClick={() => {
                                  flightDetails?.originCode?.length > 0 &&
                                    flightDetails?.destinationCode?.length > 0 &&
                                    originToDestinationDates?.find(
                                      (item: { OriginCode: string; DestinationCode: string }) =>
                                        item?.OriginCode === flightDetails?.originCode &&
                                        item?.DestinationCode === flightDetails?.destinationCode
                                    ) === undefined &&
                                    dispatch(
                                      getEligibleOriginToDestinations({
                                        OriginCode: flightDetails?.originCode,
                                        DestinationCode: flightDetails?.destinationCode,
                                      }) as unknown as AnyAction
                                    );

                                  setTabName('oneway');
                                  setErrorMessage({
                                    departure: '',
                                    returnDate: '',
                                    arrival: '',
                                  });
                                  flightDetails?.promoCode?.length &&
                                    setFlightDetails({
                                      ...flightDetails,
                                      promoCode: '',
                                    });
                                }}
                              >
                                <div className="flex items-center justify-center">
                                  <div className="mt-1">
                                    <input
                                      id="default-radio-2"
                                      type="radio"
                                      checked={tabName === 'oneway'}
                                      name="default-radio-2"
                                      className="accent-aqua	 text-white w-4 h-4 opacity-70"
                                    />
                                  </div>
                                  <label
                                    htmlFor="default-radio-2"
                                    className="ml-2 text-sm font-medium text-black"
                                  >
                                    {getFieldName(searchFlightContent, 'oneway')}
                                  </label>
                                  {/* <p className="font-medium text-sm text-pearlgray">
                                          {getFieldName(searchFlightContent, 'oneway')}
                                        </p> */}
                                </div>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      {tabIndex === 0 && (
                        <main
                          className="mt-3"
                          id="landing-page-search"
                          onClick={() => {
                            const selectCity = document.getElementById('select-city');
                            const modalDepart = document.getElementById('modal-depart');
                            const modalReturn = document.getElementById('modal-return');
                            const modalPassenger = document.getElementById('modal-passenger');
                            const modalDepartOne = document.getElementById('modal-depart-one');
                            const modalPromoCode = document.getElementById('modal-promo-code');
                            const modalPassengerOne =
                              document.getElementById('modal-passenger-one');

                            window.onclick = function (event) {
                              if (
                                event.target === selectCity ||
                                event.target === modalDepart ||
                                event.target === modalReturn ||
                                event.target === modalPassenger ||
                                event.target === modalDepartOne ||
                                event.target === modalPromoCode ||
                                event.target === modalPassengerOne
                              ) {
                                if (openSelectModal) {
                                  setOpenSelectModal(false);
                                }
                                setShowModal({
                                  depart: false,
                                  return: false,
                                  passenger: false,
                                  promoCode: false,
                                  destination: false,
                                });
                                document.body.style.overflow = 'unset';
                              }
                            };
                          }}
                        >
                          <div>
                            <div className="xl:w-full xl:m-auto xs:bg-white">
                              <div className="relative">
                                <div className="xl:px-0 xs:px-0">
                                  <div className=" ">
                                    <div>
                                      {tabName === 'return' ? (
                                        //two-way-flights
                                        <LandingPageSearchBar
                                          name="return"
                                          tabName="return"
                                          getDate={getDate}
                                          loading={loading}
                                          showModal={showModal}
                                          setLoading={setLoading}
                                          errorMessage={errorMessage}
                                          setShowModal={setShowModal}
                                          adult={flightDetails?.adult}
                                          flightDetails={flightDetails}
                                          selectOptions={selectOptions}
                                          openSelectModal={openSelectModal}
                                          setErrorMessage={setErrorMessage}
                                          childrens={flightDetails?.children}
                                          setFlightDetails={setFlightDetails}
                                          setSelectOptions={setSelectOptions}
                                          promoCode={flightDetails?.promoCode}
                                          fareFamily={selectedFareFamily?.value}
                                          departDate={flightDetails?.departDate}
                                          returnDate={flightDetails?.returnDate}
                                          originCode={flightDetails?.originCode}
                                          dropdownOptions={dropdownOptionOrigin}
                                          setOpenSelectModal={setOpenSelectModal}
                                          searchDataWithDelay={searchDataWithDelay}
                                          dateFlexible={flightDetails?.dateFlexible}
                                          destinationCode={flightDetails?.destinationCode}
                                          dropdownOptionDestination={dropdownOptionDestination}
                                        />
                                      ) : (
                                        //one-way-flights
                                        <LandingPageOnewaySearchBar
                                          name="oneway"
                                          tabName="oneway"
                                          getDate={getDate}
                                          loading={loading}
                                          showModal={showModal}
                                          setLoading={setLoading}
                                          errorMessage={errorMessage}
                                          setShowModal={setShowModal}
                                          adult={flightDetails?.adult}
                                          flightDetails={flightDetails}
                                          selectOptions={selectOptions}
                                          openSelectModal={openSelectModal}
                                          setErrorMessage={setErrorMessage}
                                          childrens={flightDetails?.children}
                                          setFlightDetails={setFlightDetails}
                                          setSelectOptions={setSelectOptions}
                                          promoCode={flightDetails?.promoCode}
                                          fareFamily={selectedFareFamily?.value}
                                          departDate={flightDetails?.departDate}
                                          returnDate={flightDetails?.returnDate}
                                          originCode={flightDetails?.originCode}
                                          dropdownOptions={dropdownOptionOrigin}
                                          setOpenSelectModal={setOpenSelectModal}
                                          searchDataWithDelay={searchDataWithDelay}
                                          dateFlexible={flightDetails?.dateFlexible}
                                          destinationCode={flightDetails?.destinationCode}
                                          dropdownOptionDestination={dropdownOptionDestination}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </main>
                      )}
                      {tabIndex === 1 && (
                        <main>
                          <div className="relative">
                            <div className="pt-3">
                              <div className="xl:flex md:flex  xs:block  xl:m-auto gap-2 relative items-center ">
                                <div className="w-full ">
                                  <Formik
                                    initialValues={{
                                      PnrCode: '',
                                      PassengerName: '',
                                    }}
                                    validationSchema={Yup.object().shape({
                                      PassengerName: Yup.string().required(
                                        getFieldName(findBookingContent, 'errorMessage')
                                      ),
                                      PnrCode: Yup.string().required(
                                        getFieldName(findBookingContent, 'errorMessage')
                                      ),
                                    })}
                                    onSubmit={(values) => {
                                      dispatch(
                                        loader({
                                          show: true,
                                          name: 'findbooking',
                                        })
                                      );
                                      dispatch(
                                        postModifyBooking(
                                          { ...values, ID: values?.PnrCode },
                                          router
                                        ) as unknown as AnyAction
                                      );
                                      dispatch(
                                        postPrepareBookingModification({
                                          TypeCode: 'PnrCode',
                                          ID: values?.PnrCode,
                                          PassengerName: values?.PassengerName,
                                        }) as unknown as AnyAction
                                      );
                                    }}
                                  >
                                    {({ handleSubmit, values }) => (
                                      <Form onSubmit={handleSubmit}>
                                        <div className="my-row">
                                          <div className="col-75">
                                            <div className="my-row">
                                              <div className="col-6">
                                                <div className="bg-white p-2 rounded border border-cadetgray w-full">
                                                  <label className="block text-sm font-medium text-black">
                                                    {getFieldName(findBookingContent, 'lastName')}
                                                  </label>
                                                  <Field
                                                    type="text"
                                                    name="PassengerName"
                                                    value={values?.PassengerName}
                                                    className="bg-white border border-none text-black text-sm rounded-md w-full p-0 focus:outline-0"
                                                    placeholder={getFieldName(
                                                      findBookingContent,
                                                      'lastNamePlaceholder'
                                                    )}
                                                    autoComplete="off"
                                                  />
                                                </div>
                                                <div className="error">
                                                  <ErrorMessage
                                                    component="p"
                                                    name="PassengerName"
                                                    className="text-xs text-red"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-6">
                                                <div className="bg-white p-2 rounded border border-cadetgray w-full">
                                                  <label className="block text-sm font-medium text-black">
                                                    {getFieldName(
                                                      findBookingContent,
                                                      'bookingReferenceNumber'
                                                    )}
                                                  </label>
                                                  <Field
                                                    type="text"
                                                    name="PnrCode"
                                                    value={values?.PnrCode}
                                                    className="bg-white border border-none text-black text-sm rounded-md  w-full p-0 focus:outline-0  "
                                                    placeholder={getFieldName(
                                                      findBookingContent,
                                                      'bookingReferenceNumberPlaceholder'
                                                    )}
                                                    autoComplete="off"
                                                  />
                                                </div>
                                                <div className="error">
                                                  <ErrorMessage
                                                    component="p"
                                                    name="PnrCode"
                                                    className="text-xs text-red"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-3">
                                            <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                                              <button
                                                type="submit"
                                                className={`w-full text-md font-bold xs:justify-center xs:text-center text-white bg-aqua rounded-lg text-md inline-flex items-center md:py-4 xs:py-2 text-center ${
                                                  values?.PassengerName?.length > 0 &&
                                                  values?.PnrCode?.length > 0
                                                    ? ''
                                                    : 'opacity-50 cursor-not-allowed'
                                                }`}
                                              >
                                                {getFieldName(
                                                  findBookingContent,
                                                  'findBookingButton'
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </Form>
                                    )}
                                  </Formik>
                                </div>
                              </div>
                            </div>
                          </div>
                        </main>
                      )}
                      {tabIndex === 2 && (
                        <main>
                          <div className="pt-3">
                            <div className="my-row">
                              <div className="col-3">
                                <div className="bg-white p-2 rounded border border-cadetgray w-full">
                                  <div
                                  // onClick={() => {
                                  //   setOpenSelectModal(true);
                                  //   setLoading(true);
                                  //   setSelectOptions(dropdownOptionOrigin);
                                  //   setLoading(false);
                                  //   document.body.style.overflow = 'hidden';
                                  // }}
                                  >
                                    <div className="flex items-center relative px-6">
                                      <div className="absolute left-0 m-auto">
                                        <Image src={takeoff} className=" h-4 w-4" alt="" />
                                      </div>
                                      <div className="w-full">
                                        <div
                                          className={`font-medium text-sm ${
                                            originCode?.length > 0 ? 'text-slategray' : 'text-black'
                                          }`}
                                        >
                                          <p>{getFieldName(landingPageSearchContent, 'from')}</p>
                                        </div>
                                        <div className="flex justify-between">
                                          <div
                                            className={`block text-start dark:focus:ring-blue-800 ${
                                              originCode?.length > 0
                                                ? 'text-black'
                                                : 'text-slategray'
                                            } font-normal  text-sm  w-full`}
                                          >
                                            {getFieldName(
                                              searchFlightContent,
                                              'departFromPlaceholder'
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-black text-sm absolute right-0 m-auto">
                                        <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                                      </div>
                                    </div>
                                  </div>
                                  {/* {openSelectModal && (
                                            <DropdownModal
                                              name="return"
                                              textSize="sm"
                                              tabName={tabName}
                                              loading={loading}
                                              setLoading={setLoading}
                                              originCode={originCode}
                                              errorMessage={errorMessage}
                                              flightDetails={flightDetails}
                                              selectOptions={selectOptions}
                                              destinationCode={destinationCode}
                                              openSelectModal={openSelectModal}
                                              setErrorMessage={setErrorMessage}
                                              dropdownOptions={dropdownOptionOrigin}
                                              setFlightDetails={setFlightDetails}
                                              setSelectOptions={setSelectOptions}
                                              setOpenSelectModal={setOpenSelectModal}
                                              searchDataWithDelay={searchDataWithDelay}
                                            />
                                          )} */}
                                </div>
                                <div className="error">
                                  <p className="text-xs text-red">{errorMessage?.departure}</p>
                                </div>
                              </div>
                              <div className="col-3">
                                <div
                                  className={` bg-white p-2 rounded border border-cadetgray w-full ${
                                    flightDetails?.originCode?.length > 0
                                      ? 'cursor-pointer'
                                      : 'cursor-not-allowed'
                                  }`}
                                >
                                  <div
                                    className="flex items-center"
                                    // onClick={() => {
                                    //   if (flightDetails?.originCode?.length > 0) {
                                    //     setShowModal({
                                    //       destination: true,
                                    //       depart: false,
                                    //       return: false,
                                    //       passenger: false,
                                    //       promoCode: false,
                                    //     });
                                    //     document.body.style.overflow = 'hidden';
                                    //     setSelectOptions(dropdownOptionDestination);
                                    //   }
                                    // }}
                                  >
                                    <div className="w-full">
                                      <div className="flex items-center px-6 relative">
                                        <div className="absolute left-0 m-auto">
                                          <Image src={land} className=" h-4 w-4" alt="" />
                                        </div>
                                        <div className="w-full">
                                          <div
                                            className={`font-medium text-sm ${
                                              destinationCode?.length > 0
                                                ? 'text-slategray'
                                                : 'text-black'
                                            }`}
                                          >
                                            <p>
                                              {getFieldName(
                                                landingPageSearchContent,
                                                'destination'
                                              )}
                                            </p>
                                          </div>
                                          <div className="flex justify-between">
                                            <div
                                              className={`block text-start dark:focus:ring-blue-800 ${
                                                destinationCode?.length > 0
                                                  ? 'text-black'
                                                  : 'text-slategray'
                                              } font-normal text-sm w-full`}
                                            >
                                              {getFieldName(
                                                searchFlightContent,
                                                'departFromPlaceholder'
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-black text-sm absolute right-0 m-autos">
                                          <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* {showModal?.destination && (
                                          <div>
                                            <DropdownModal
                                              name="destination"
                                              textSize="sm"
                                              tabName={tabName}
                                              loading={loading}
                                              closeModal={() => {
                                                setShowModal({
                                                  destination: false,
                                                  depart: false,
                                                  return: false,
                                                  passenger: false,
                                                  promoCode: false,
                                                });
                                                document.body.style.overflow = 'unset';
                                              }}
                                              setLoading={setLoading}
                                              originCode={originCode}
                                              errorMessage={errorMessage}
                                              flightDetails={flightDetails}
                                              selectOptions={selectOptions}
                                              destinationCode={destinationCode}
                                              openSelectModal={openSelectModal}
                                              setErrorMessage={setErrorMessage}
                                              dropdownOptions={dropdownOptionOrigin}
                                              setFlightDetails={setFlightDetails}
                                              setSelectOptions={setSelectOptions}
                                              setOpenSelectModal={setOpenSelectModal}
                                              searchDataWithDelay={searchDataWithDelay}
                                            />
                                          </div>
                                        )} */}
                                </div>
                                <div className="error">
                                  <p className="text-xs text-red">
                                    {
                                      (
                                        errorMessage as {
                                          departure: string;
                                          returnDate: string;
                                          arrival: string;
                                        }
                                      )?.arrival
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="col-3">
                                <div className="flex items-center rounded border bg-white border-cadetgray p-2">
                                  <button
                                    className="relative font-semibold border-0 w-full block text-black text-sm text-left "
                                    type="button"
                                    // onClick={() => {
                                    //   setShowModal({
                                    //     destination: false,
                                    //     depart: true,
                                    //     return: false,
                                    //     passenger: false,
                                    //     promoCode: false,
                                    //   });
                                    //   document.body.style.overflow = 'hidden';
                                    // }}
                                  >
                                    <div className="flex items-center px-6 relative">
                                      <div className="absolute left-0 m-auto">
                                        <Image src={calendar} className=" h-4 w-4" alt="" />
                                      </div>
                                      <div className="w-full">
                                        <p className="font-medium text-sm text-slategray">
                                          {getFieldName(landingPageSearchContent, 'departOn')}
                                        </p>
                                        <p className=" font-normal text-sm text-black">
                                          {getDate('depart')}
                                        </p>
                                      </div>
                                      <div className="text-black text-sm absolute right-0 m-auto">
                                        <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                                      </div>
                                    </div>
                                  </button>
                                  {/* <DepartReturnDateModal
                                        id="modal-depart"
                                        name="Departure"
                                        closeModal={() => {
                                          setShowModal({
                                            destination: false,
                                            depart: false,
                                            return: false,
                                            passenger: false,
                                            promoCode: false,
                                          });
                                          document.body.style.overflow = 'unset';
                                        }}
                                        originCode={originCode}
                                        returnDate={returnDate}
                                        departDate={departDate}
                                        dateFlexible={flightDetails?.dateFlexible}
                                        setShowModal={setShowModal}
                                        errorMessage={errorMessage}
                                        showModal={showModal?.depart}
                                        flightDetails={flightDetails}
                                        destinationCode={destinationCode}
                                        setErrorMessage={setErrorMessage}
                                        setFlightDetails={setFlightDetails}
                                      /> */}
                                </div>
                              </div>
                              <div className="col-3">
                                <div className="lg:flex md:flex block h-full items-center justify-center relative w-full m-auto">
                                  <button
                                    type="submit"
                                    className="w-full text-md font-bold xs:justify-center xs:text-center text-white bg-aqua rounded-lg text-md inline-flex items-center md:py-4 xs:py-2 text-center  "
                                  >
                                    Check Status
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </main>
                      )}
                    </div>
                  </ul>
                </div>
              </div>
            </div>
            {showOffer && (
              <SpecialOfferModal
                showOffer={showOffer}
                closeModal={() => {
                  setShowOffer(false);
                  document.body.style.overflow = 'unset';
                }}
              />
            )}
          </section>
        </Fragment>
      ) : load?.name === 'search' ? (
        <SearchFlightLoader open={load?.show} />
      ) : load?.name === 'signin' ? (
        <SignInLoader open={load?.show} />
      ) : (
        load.name === 'findbooking' && <FindYourBookingLoader open={load?.show} />
      )}
      <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WHMT2ZS3"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
    </>
  );
};

export default LandingPageSearch;