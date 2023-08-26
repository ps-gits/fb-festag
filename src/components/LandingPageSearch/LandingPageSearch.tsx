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
    departDate: checkDate && departDate ? new Date(departDate) : new Date(),
    returnDate: checkDate && returnDate ? new Date(returnDate) : new Date(),
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
    if (
      checkDate &&
      originCode &&
      destinationCode &&
      originToDestinationDates?.find(
        (item: { OriginCode: string; DestinationCode: string }) =>
          item?.OriginCode === originCode && item?.DestinationCode === destinationCode
      ) === undefined
    ) {
      dispatch(
        getEligibleOriginToDestinations({
          OriginCode: originCode,
          DestinationCode: destinationCode,
        }) as unknown as AnyAction
      );
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
    return finalDate;
  };

  const selectedFareFamily = flightAvailabilityContent?.find(
    (item: { name: string }) => item?.name === 'delight'
  );

  return (
    <>
      {!load?.show ? (
        <Fragment key={tabIndex}>
          <section className="bg-pink xs:bg-white">
            <div className='container'>
                <div className="relative">
                  <div className="xl:px-0 xs:px-3">
                    <div className="xl:w-full md:w-5/6 md:m-auto p-4 bg-white rounded-xl xl:absolute xl:-top-32 xs:relative xs:-top-8 shadow-md">
                      <ul>
                        <div className="xl:flex xs:flex-wrap justify-between ">
                          <div className="xl:flex xs:block xl:w-3/5">
                            <li className="xl:w-1/4  ">
                              <button
                                className={`xl:w-full xs:w-full  inline-block px-2 py-2 font-medium text-md  xl:border-aqua  xs:border-t-2 xs:border-l-2 xl:border-r-0 xs:border-r-2 xl:rounded-tl-md xs:rounded-tr-md xl:rounded-tr-none xl:rounded-bl-md xs:rounded-tl-md xs:rounded-bl-none  ${tabIndex === 0
                                  ? 'bg-white  border-b-4 text-aqua xl:border-aqua'
                                  : 'text-silvergray  bg-white border-aqua xl:border-2'
                                  }   hover:blue  font-medium text-md`}
                                type="button"
                                onClick={() => {
                                  setTabIndex(0);
                                }}
                              >
                                <div className="flex items-center xl:justify-center xs:justify-start gap-2">
                                  <div>
                                    <Image src={orangeplane} className=" h-4 w-4" alt="" />
                                  </div>
                                  <p className="font-medium text-sm text-pearlgray">
                                    Flight Booking
                                  </p>
                                </div>
                              </button>
                            </li>
                            <li className=" xl:w-1/4">
                              <button
                                className={`xl:w-full xs:w-full  inline-block px-2 py-2 font-medium text-md  xl:border-aqua xl:border-t-2  xl:border-l-2 xl:border-r-0  xs:border-r-2 xs:border-t-2 xs:border-l-2  ${tabIndex === 1
                                  ? 'bg-white  text-aqua border-b-4 xl:border-aqua'
                                  : 'text-silvergray xl:border-2 bg-white border-aqua  '
                                  }   hover:blue  font-medium text-md`}
                                type="button"
                                onClick={() => {
                                  setTabIndex(1);
                                }}
                              >
                                <div className="flex items-center  xl:justify-center xs:justify-start gap-2">
                                  <div>
                                    <Image src={calendar} className=" h-4 w-4" alt="" />
                                  </div>
                                  <p className="font-medium text-sm text-pearlgray">
                                    Manage Booking
                                  </p>
                                </div>
                              </button>
                            </li>
                            <li className="xl:w-1/4 ">
                              <button
                                className={`xl:w-full xs:w-full  inline-block px-2 py-2 font-medium text-md  xl:border-aqua xs:border-t-2 xs:border-l-2 xs:border-r-2  xl:rounded-tr-md xs:rounded-tr-none xl:rounded-br-md xl:rounded-bl-none xs:rounded-bl-md xs:rounded-br-md ${tabIndex === 2
                                  ? 'bg-white   border-b-4 text-aqua xl:border-aqua'
                                  : 'text-silvergray border-2 bg-white border-aqua '
                                  }   hover:blue  font-medium text-md`}
                                type="button"
                                onClick={() => {
                                  setTabIndex(2);
                                }}
                              >
                                <div className="flex items-center xl:justify-center xs:justify-start gap-2">
                                  <div>
                                    <Image src={clock} className=" h-4 w-4" alt="" />
                                  </div>
                                  <p className="font-medium text-sm text-pearlgray">
                                    Flight Status
                                  </p>
                                </div>
                              </button>
                            </li>
                          </div>
                          <div>
                            <div className="xl:my-0 xs:my-4">
                              <ul className="flex items-center gap-5 xl:border-0 xs:border-2 xs:border-aqua xs:py-2 xs:px-3 xl:py-0 xl:px-0 xs:rounded-md">
                                <li className=" ">
                                  <button
                                    className={`xl:w-full xs:w-full  inline-block  font-medium text-md  ' ${tabName === 'return'
                                      ? '  bg-white   text-aqua '
                                      : ' text-silvergray  bg-white xs:border-cadetgray '
                                      }    font-medium text-md`}
                                    type="button"
                                    onClick={() => {
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
                                <li className=" ">
                                  <button
                                    className={`xl:w-full xs:w-full  inline-block font-medium text-md    ${tabName === 'oneway'
                                      ? 'bg-white    text-aqua '
                                      : 'text-silvergray  bg-white'
                                      }   hover:blue  font-medium text-md`}
                                    type="button"
                                    onClick={() => {
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
                                const modalPassenger =
                                  document.getElementById('modal-passenger');
                                const modalDepartOne =
                                  document.getElementById('modal-depart-one');
                                const modalPromoCode =
                                  document.getElementById('modal-promo-code');
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
                                <div className=" xl:w-full xl:m-auto  xs:bg-white">
                                  <div className="relative">
                                    <div className="xl:px-0 xs:px-0">
                                      <div className=" ">
                                        <div>
                                          {tabName === 'return' ? (
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
                                              dropdownOptionDestination={
                                                dropdownOptionDestination
                                              }
                                            />
                                          ) : (
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
                                              dropdownOptionDestination={
                                                dropdownOptionDestination
                                              }
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
                                <div className=" ">
                                  <div className="xl:flex md:flex  xs:block  xl:m-auto gap-2 relative items-center ">
                                    <div className="xl:w-full ">
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
                                            <div className="xl:mt-3 xs:mt-0 xl:flex xs:block gap-2">
                                              <div className="xl:flex xs:block w-full gap-2">
                                                <div className="xl:w-6/12 xs:w-full xl:mb-0 xs:mb-2 md:mb-0  rounded border bg-white  border-cadetgray  ">
                                                  <div className=" bg-white px-2 xl:py-2 xs:py-2 rounded border border-cadetgray w-full ">
                                                    <label className="block  text-sm font-medium text-black">
                                                      {getFieldName(
                                                        findBookingContent,
                                                        'lastName'
                                                      )}
                                                    </label>
                                                    <Field
                                                      type="text"
                                                      name="PassengerName"
                                                      value={values?.PassengerName}
                                                      className="bg-white border border-none text-black text-sm rounded-md  w-full p-0 focus:outline-0  "
                                                      placeholder={getFieldName(
                                                        findBookingContent,
                                                        'lastNamePlaceholder'
                                                      )}
                                                      autoComplete="off"
                                                    />
                                                  </div>
                                                  <div>
                                                    <ErrorMessage
                                                      component="p"
                                                      name="PassengerName"
                                                      className="text-xs text-red"
                                                    />
                                                  </div>
                                                </div>
                                                <div className="xl:w-6/12 xs:w-full xl:mb-0 xs:mb-2 md:mb-0  rounded border bg-white  border-cadetgray  ">
                                                  <div className="bg-white px-2 xl:py-2 xs:py-2 rounded border border-cadetgray w-full">
                                                    <label className="block  text-sm font-medium text-black">
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
                                                  <div>
                                                    <ErrorMessage
                                                      component="p"
                                                      name="PnrCode"
                                                      className="text-xs text-red"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="xl:w-1/3 xs:w-full xl:mb-0 xs:mb-2 md:mb-0">
                                                <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                                                  <button
                                                    type="submit"
                                                    className={`w-full text-md font-black xs:justify-center xs:text-center text-white bg-aqua  rounded-sm text-md inline-flex items-center px-4 xl:py-4 xs:py-2 text-center  ${values?.PassengerName?.length > 0 &&
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
                              <div className="mt-3">
                                <div className="xl:flex md:flex xs:block w-full gap-2">
                                  <div className="xl:w-1/4 xs:w-full xl:mb-0 xs:mb-2 md:mb-0">
                                    <div>
                                      <div className=" bg-white px-2 xl:py-0 xs:py-2 rounded border border-cadetgray w-full ">
                                        <div
                                          className="flex gap-3 items-center py-2 cursor-pointer"
                                        // onClick={() => {
                                        //   setOpenSelectModal(true);
                                        //   setLoading(true);
                                        //   setSelectOptions(dropdownOptionOrigin);
                                        //   setLoading(false);
                                        //   document.body.style.overflow = 'hidden';
                                        // }}
                                        >
                                          <div className="w-full">
                                            <div className="flex items-center gap-2">
                                              <div>
                                                <Image
                                                  src={takeoff}
                                                  className=" h-4 w-4"
                                                  alt=""
                                                />
                                              </div>
                                              <div>
                                                <div
                                                  className={`font-medium text-sm ${originCode?.length > 0
                                                    ? 'text-slategray'
                                                    : 'text-black'
                                                    }`}
                                                >
                                                  <p>
                                                    {getFieldName(
                                                      landingPageSearchContent,
                                                      'from'
                                                    )}
                                                  </p>
                                                </div>
                                                <div className="flex justify-between">
                                                  <div
                                                    className={`block text-start dark:focus:ring-blue-800 ${originCode?.length > 0
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
                                            </div>
                                          </div>
                                          <div className="text-black text-sm">
                                            <FontAwesomeIcon
                                              icon={faAngleDown}
                                              aria-hidden="true"
                                            />
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
                                      <div className="	xl:sr-only xs:not-sr-only">
                                        <p className="text-xs text-red">
                                          {errorMessage?.departure}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="xl:w-1/4 xs:w-full xl:mb-0 xs:mb-2 md:mb-0">
                                    <div
                                      className={` bg-white px-2 xl:py-0 rounded border border-cadetgray w-full ${flightDetails?.originCode?.length > 0
                                        ? 'cursor-pointer'
                                        : 'cursor-not-allowed'
                                        }`}
                                    >
                                      <div
                                        className="flex gap-3 items-center py-2"
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
                                          <div className="flex items-center gap-2">
                                            <div>
                                              <Image src={land} className=" h-4 w-4" alt="" />
                                            </div>
                                            <div>
                                              <div
                                                className={`font-medium text-sm ${destinationCode?.length > 0
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
                                                  className={`block text-start dark:focus:ring-blue-800 ${destinationCode?.length > 0
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
                                          </div>
                                        </div>
                                        <div className="text-black text-sm">
                                          <FontAwesomeIcon
                                            icon={faAngleDown}
                                            aria-hidden="true"
                                          />
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
                                    <div className="	xl:sr-only xs:not-sr-only">
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
                                  <div className="xl:w-1/4 md:w-full xs:full rounded border bg-white border-cadetgray xl:mb-0 xs:mb-2">
                                    <div className="flex items-center xl:py-2 xs:py-2">
                                      <button
                                        className="relative  px-2 font-semibold  border-0 w-full block text-black  text-sm  text-left "
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
                                        <div className="flex items-center gap-2">
                                          <div>
                                            <Image src={calendar} className=" h-4 w-4" alt="" />
                                          </div>
                                          <div>
                                            <p className="font-medium text-sm text-slategray">
                                              {getFieldName(
                                                landingPageSearchContent,
                                                'departOn'
                                              )}
                                            </p>
                                            <div className="flex justify-between">
                                              <p className=" font-normal text-sm text-black">
                                                {getDate('depart')}
                                              </p>
                                              <div className="absolute right-2 top-4 text-black text-sm">
                                                <FontAwesomeIcon
                                                  icon={faAngleDown}
                                                  aria-hidden="true"
                                                />
                                              </div>
                                            </div>
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
                                  <div className="xl:w-1/4 xs:w-full xl:mb-0 xs:mb-2 md:mb-0">
                                    <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                                      <button
                                        type="submit"
                                        className="w-full text-md font-black xs:justify-center xs:text-center text-white bg-aqua  rounded-lg text-md inline-flex items-center xl:py-4 xs:py-2 text-center  "
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
            </div>
          </section>
        </Fragment>
      ) : load?.name === 'search' ? (
        <SearchFlightLoader open={load?.show} />
      ) : load?.name === 'signin' ? (
        <SignInLoader open={load?.show} />
      ) : (
        load.name === 'findbooking' && <FindYourBookingLoader open={load?.show} />
      )}
    </>
  );
};

export default LandingPageSearch;
