import Image from 'next/image';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import Bliss from './Tabs/Bliss';
import Delight from './Tabs/Delight';
import Opulence from './Tabs/Opulence';
import {
  setSelectedFlightData,
  setModifyBookingFromBooking,
  setSelectedFlightCodesWithDate,
} from 'src/redux/reducer/FlightDetails';
import FlightInfo from './Tabs/FlightInfo';
import { RootState } from 'src/redux/store';
import StepsInfo from '../SearchFlight/StepsInfo';
import { loader } from 'src/redux/reducer/Loader';
import ErrorMessages from 'components/Toaster/ErrorMessages';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import SavingExpLoader from 'components/Loader/SavingExpLoader';
import { completeFlightDetails } from './Tabs/MatrixFunctions';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';
import { postPrepareExchangeFlights, postPrepareFlights } from 'src/redux/action/SearchFlights';

const FlightAvailability = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const passengerContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerModal?.fields
  );
  // const passengerDetailsContent = useSelector(
  //   (state: RootState) => state?.sitecore?.passengerDetails?.fields
  // );
  const flightAvailabilityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const modifyDataFromBooking = useSelector(
    (state: RootState) => state?.flightDetails?.modifyDataFromBooking
  );
  // const compareFareFamiliesContent = useSelector(
  //   (state: RootState) => state?.sitecore?.compareFareFamilies?.fields
  // );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const selectedFlightInfo = useSelector(
    (state: RootState) => state?.flightDetails?.selectedFlightCodesWithDate
  );
  const selectedDetailsForFlight = useSelector(
    (state: RootState) => state?.flightDetails?.reviewFlight?.OriginDestinations
  );
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);

  const findBookingInfo = useSelector((state: RootState) => state?.flightDetails?.findBooking);
  const fareFamilyData = useSelector((state: RootState) => state?.flightDetails?.searchFlight);
  const fareFamilyDetails = useSelector((state: RootState) => state?.flightDetails?.fareFamily);
  const selectedFlight = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);

  const { adult, children, dateFlexible, originCode, destinationCode } = selectedFlightInfo;

  const [tabIndex, setTabIndex] = useState(0);
  const [showToast, setShowToast] = useState({
    show: false,
    status: 0,
    message: '',
  });
  const [showModal, setShowModal] = useState({
    depart: false,
    return: false,
    passenger: false,
    compareFareFamily: false,
  });
  const [selectFlight, setSelectFlight] = useState({
    display: false,
    name: '',
    index: 0,
    details: completeFlightDetails,
  });
  const [passengerCount, setPassengerCount] = useState({
    adult: adult ? adult : 1,
    children: children ? children : 0,
  });
  const [showFlightInfo, setShowFlightInfo] = useState(false);

  useEffect(() => {
    dispatch(getSitecoreContent('Compare-Fare-Families') as unknown as AnyAction);
  }, [dispatch]);

  useEffect(() => {
    if (
      selectedFlight !== undefined &&
      selectedFlight?.details !== undefined &&
      Array.isArray(selectedFlight) === false
    ) {
      !modifyDataFromBooking && !modifyData && !dateFlexible && setShowFlightInfo(true);
      setSelectFlight(selectedFlight);
      const findFareFamilyInfo = flightAvailabilityContent?.find(
        (item: { value: string }) => item?.value === selectedFlight?.name
      );
      if (findFareFamilyInfo !== undefined) {
        findFareFamilyInfo?.name === 'delight'
          ? setTabIndex(0)
          : findFareFamilyInfo?.name === 'bliss'
          ? setTabIndex(1)
          : setTabIndex(2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFlexible, selectedFlight, flightAvailabilityContent]);

  const previousDepartDate = modifyBookingInfo?.OriginDestination?.find(
    (item: object, index: number) => item !== undefined && index === 0
  )?.DepartureDate;

  const previousReturnDate = modifyBookingInfo?.OriginDestination?.find(
    (item: object, index: number) => item !== undefined && index === 1
  )?.ArrivalDate;

  const tabClicked = (index: number, name: string) => {
    setTabIndex(index);
    const findFareFamilyInfo = flightAvailabilityContent?.find(
      (item: { name: string }) => item.name === name
    );
    const findFlightInfo = fareFamilyData[findFareFamilyInfo?.name]?.find(
      (item: { Dtr: string; Otr: string }) =>
        selectedDetailsForFlight?.length > 1
          ? item?.Dtr === selectFlight?.details?.Dtr && item?.Otr === selectFlight?.details?.Otr
          : item?.Otr === selectFlight?.details?.Otr
    );
    if (selectFlight?.name !== findFareFamilyInfo?.value && showFlightInfo && findFlightInfo) {
      setSelectFlight({
        display: true,
        name: findFareFamilyInfo?.value,
        index: selectFlight?.index,
        details: findFlightInfo,
      });
      dispatch(
        setSelectedFlightData({
          display: true,
          name: findFareFamilyInfo?.value,
          index: selectFlight?.index,
          details: findFlightInfo,
        })
      );
    } else if (selectFlight?.name !== findFareFamilyInfo?.value) {
      const flightInfo = fareFamilyData[findFareFamilyInfo?.name]?.find(
        (item: { Dtr: string; Otr: string }) =>
          selectedDetailsForFlight?.length > 1
            ? item?.Dtr?.split('T')[0] === selectFlight?.details?.Dtr &&
              item?.Otr?.split('T')[0] === selectFlight?.details?.Otr
            : item?.Otr?.split('T')[0] === selectFlight?.details?.Otr
      );
      const findIndex = fareFamilyData[findFareFamilyInfo?.name]?.findIndex(
        (item: object) => item === flightInfo
      );
      setSelectFlight({
        display: true,
        name:
          findFareFamilyInfo?.name?.charAt(0)?.toUpperCase() + findFareFamilyInfo?.name?.slice(1),
        index: findIndex,
        details: flightInfo,
      });
      setShowFlightInfo(false);
      dispatch(setSelectedFlightData([]));
    }
  };

  const findTotalAmount = (fareFamilyName: string) => {
    const findFlightInfo = fareFamilyData[fareFamilyName]?.find(
      (item: { Dtr: string; Otr: string }) =>
        selectedDetailsForFlight?.length > 1
          ? item?.Dtr?.split('T')[0] === selectFlight?.details?.Dtr &&
            item?.Otr?.split('T')[0] === selectFlight?.details?.Otr
          : item?.Otr?.split('T')[0] === selectFlight?.details?.Otr
    );
    return (
      (findFlightInfo?.currency ? findFlightInfo?.currency : '') +
      ' ' +
      (!Number.isNaN(Math.floor(findFlightInfo?.TotalAmount))
        ? Math.floor(findFlightInfo?.TotalAmount)?.toLocaleString('en-GB')
        : '')
    );
  };

  const displayAmount = (fareFamilyName: string) => {
    return selectFlight?.name !== getFieldName(flightAvailabilityContent, fareFamilyName)
      ? findTotalAmount(getFieldName(flightAvailabilityContent, fareFamilyName)?.toLowerCase())
      : (selectFlight?.details?.currency ? selectFlight?.details?.currency : '') +
          ' ' +
          (!Number.isNaN(Math.floor(selectFlight?.details?.TotalAmount))
            ? Math.floor(selectFlight?.details?.TotalAmount)?.toLocaleString('en-GB')
            : '');
  };

  const updateFareFamily = (fareFamilyName: string) => {
    const flightInfo = fareFamilyData[fareFamilyName?.toLowerCase()]?.find(
      (item: { Dtr: string; Otr: string }) =>
        selectedDetailsForFlight?.length > 1
          ? item?.Dtr?.split('T')[0] === selectFlight?.details?.Dtr &&
            item?.Otr?.split('T')[0] === selectFlight?.details?.Otr
          : item?.Otr?.split('T')[0] === selectFlight?.details?.Otr
    );
    const findIndex = fareFamilyData[fareFamilyName?.toLowerCase()]?.findIndex(
      (item: object) => item === flightInfo
    );
    if (flightInfo && findIndex !== -1) {
      dispatch(
        setSelectedFlightData({
          display: true,
          name: fareFamilyName,
          index: findIndex,
          details: flightInfo,
        })
      );
      setSelectFlight({
        display: true,
        name: fareFamilyName,
        index: findIndex,
        details: flightInfo,
      });
    }
  };

  const continueButton = () => {
    if (selectFlight?.display && selectFlight?.details?.OriginCode?.length > 1) {
      dispatch(
        loader({
          show: true,
          name: 'search',
        })
      );
      if (modifyData || modifyDataFromBooking) {
        dispatch(setSelectedFlightData(selectFlight));
        dispatch(
          postPrepareExchangeFlights(
            {
              PassangerLastname: findBookingInfo?.PassengerName,
              PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
              RefItinerary: selectFlight?.details?.RefItinerary,
              Ref: selectFlight?.details?.Ref,
              FareFamily: selectFlight?.name,
            },
            router,
            setShowToast
          ) as unknown as AnyAction
        );
      } else {
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
        setShowFlightInfo(true);
        dispatch(setSelectedFlightData(selectFlight));
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <main
      onClick={() => {
        const modalPassengerDelight = document.getElementById('modal-passenger-delight');
        const modalPassengerBliss = document.getElementById('modal-passenger-bliss');
        const modalPassengerOpulence = document.getElementById('modal-passenger-opulence');
        const modalDepart = document.getElementById('modal-depart');
        const modalReturn = document.getElementById('modal-return');
        const compareFareFamily = document.getElementById('compare-fare');

        window.onclick = function (event) {
          if (
            event.target == modalDepart ||
            event.target == modalReturn ||
            event.target == modalPassengerBliss ||
            event.target == modalPassengerOpulence ||
            event.target === modalPassengerDelight ||
            event.target === compareFareFamily
          ) {
            setShowModal({
              depart: false,
              return: false,
              passenger: false,
              compareFareFamily: false,
            });
            document.body.style.overflow = 'unset';
          }
        };
      }}
    >
      {!load?.show ? (
        <Fragment>
          <div className="relative">
            <ErrorMessages showToast={showToast} setShowToast={setShowToast} />
            <div className="xl:not-sr-only	xs:sr-only">
              <div className="xl:w-1/4 xs:w-full">
                <div>
                  {showFlightInfo && (
                    <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                      <Image
                        src={getImageSrc(searchFlightContent, 'desktopBanner') as string}
                        className="xs:absolute  inset-0 h-full w-full object-cover"
                        alt=""
                        height={200}
                        width={160}
                      />
                    </div>
                  )}
                  <div className="xl:not-sr-only	xs:sr-only">
                    <div className="fixed top-24 right-3.5  xl:m-auto price-modal">
                      <div className="">
                        {showFlightInfo && (
                          <div>
                            <div className="bg-white p-3 rounded-lg ">
                              {/* <div className="flex justify-between my-1">
                                <p className="text-slategray text-lg font-medium">
                                  {getFieldName(flightAvailabilityContent, 'numberOfPassengers')}
                                </p>
                                <p className="font-black text-lg text-black">
                                  {passengerCount?.adult + passengerCount?.children}
                                </p>
                              </div> */}
                              {/* <div className="flex justify-between my-1">
                                <p className="text-slategray text-lg font-medium">
                                  {getFieldName(flightAvailabilityContent, 'totalPrice')}
                                </p>
                                <p className="font-black text-lg text-black">
                                  {(selectFlight?.details?.currency
                                    ? selectFlight?.details?.currency
                                    : '') +
                                    ' ' +
                                    (selectFlight?.details?.TotalAmount
                                      ? selectFlight?.details?.TotalAmount.toLocaleString('en-GB')
                                      : '')}
                                </p>
                              </div> */}
                              <div className="mb-2">
                                <h1 className="text-lg font-black text-black">
                                  {getFieldName(flightAvailabilityContent, 'bookingSummary')}
                                </h1>
                              </div>
                              <div className="flex gap-3 p-3 border border-cadetgray rounded-lg mb-3">
                                <div className="flex justify-center items-center">
                                  <Image
                                    className="h-5 w-5 object-containt"
                                    src={getImageSrc(passengerContent, 'passengerLogo') as string}
                                    alt=""
                                    height={57}
                                    width={57}
                                  />
                                </div>
                                <div>
                                  <p className="text-black font-medium text-lg">
                                    {getFieldName(flightAvailabilityContent, 'passengersLabel')}
                                  </p>
                                  <p className="text-sm font-medium text-pearlgray">
                                    {`${adult} ${
                                      adult > 1
                                        ? getFieldName(passengerContent, 'adults')
                                        : getFieldName(passengerContent, 'adult')
                                    } ${
                                      children && children > 0
                                        ? `, ${children} ${
                                            children > 1
                                              ? getFieldName(passengerContent, 'children')
                                              : getFieldName(passengerContent, 'child')
                                          }`
                                        : ''
                                    }`}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-purpal p-4 rounded-lg">
                                <h1 className="font-black text-base black text-black">
                                  {getFieldName(flightAvailabilityContent, 'summary')}
                                </h1>
                                <div className="flex justify-between py-1">
                                  <p className="font-medium text-xs text-pearlgray">
                                    {selectFlight?.name}{' '}
                                    {getFieldName(flightAvailabilityContent, 'xTicket')}
                                    {(adult ? adult : 1) + (children ? children : 0)}
                                  </p>
                                  <p className="font-medium text-xs text-pearlgray">
                                    {(selectFlight?.details?.currency
                                      ? selectFlight?.details?.currency
                                      : '') +
                                      ' ' +
                                      (selectFlight?.details?.BaseAmount
                                        ? selectFlight?.details?.BaseAmount.toLocaleString('en-GB')
                                        : '')}
                                  </p>
                                </div>
                                <div className="flex justify-between py-1">
                                  <p className="font-medium text-xs text-pearlgray">
                                    {getFieldName(flightAvailabilityContent, 'charges')}
                                  </p>
                                  <p className="font-medium text-xs text-pearlgray">
                                    {(selectFlight?.details?.currency
                                      ? selectFlight?.details?.currency
                                      : '') +
                                      ' ' +
                                      (selectFlight?.details?.TaxAmount
                                        ? selectFlight?.details?.TaxAmount.toLocaleString('en-GB')
                                        : '')}
                                  </p>
                                </div>
                                <div className="flex justify-between py-1">
                                  <p className="font-black text-md text-black">
                                    {getFieldName(flightAvailabilityContent, 'totalPrice')}
                                  </p>
                                  <p className="font-black text-md text-black">
                                    {(selectFlight?.details?.currency
                                      ? selectFlight?.details?.currency
                                      : '') +
                                      ' ' +
                                      (selectFlight?.details?.TotalAmount
                                        ? selectFlight?.details?.TotalAmount.toLocaleString('en-GB')
                                        : '')}
                                  </p>
                                </div>
                              </div>
                              {/* <div className="pt-3 pb-1">
                                <p className="text-aqua underline cursor-pointer">
                                  {getFieldName(flightAvailabilityContent, 'baggageRules')}
                                </p>
                              </div> */}
                              <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                                <div className="xl:flex md:flex xs:block h-full items-center justify-center relative gap-3 py-3 xs:w-full">
                                  {/* <button
                                    type="button"
                                    className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 "
                                    onClick={() => {
                                      setShowModal({
                                        depart: true,
                                        return: false,
                                        passenger: false,
                                        compareFareFamily: false,
                                      });
                                      document.body.style.overflow = 'hidden';
                                    }}
                                  >
                                    {getFieldName(flightAvailabilityContent, 'editDateButton')}
                                  </button> */}
                                  <button
                                    type="button"
                                    className="xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center py-2 text-center  xl:w-full"
                                    onClick={() => {
                                      dispatch(
                                        loader({
                                          show: true,
                                          name: 'exp',
                                        })
                                      );
                                      dispatch(
                                        postPrepareFlights(
                                          {
                                            RefItinerary: selectFlight?.details?.RefItinerary,
                                            Ref: selectFlight?.details?.Ref,
                                            FareFamily: selectFlight?.name,
                                          },
                                          router,
                                          setShowToast
                                        ) as unknown as AnyAction
                                      );
                                    }}
                                  >
                                    {getFieldName(flightAvailabilityContent, 'confirmButton')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                !showFlightInfo
                  ? 'xl:bg-cadetgray xl:h-screen  xl:rounded-none rounded-lg inherit   w-full  xl:py-16 index-style'
                  : 'px-3  bg-cadetgray  xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute   w-full  xl:w-3/4  index-style'
              }`}
            >
              <div className="xl:not-sr-only	xs:sr-only">
                <div
                  className={`${
                    !showFlightInfo
                      ? 'xl:w-5/6 xl:m-auto xl:pl-0 xl:pt-8 gap-10'
                      : 'xl:w-5/6 xl:m-auto xl:pl-0 xl:pt-24 gap-10'
                  }`}
                >
                  <StepsInfo selected={2} />
                </div>
              </div>
              <div className="xl:w-5/6 xs:w-full m-auto  xl:py-0 xs:pt-24 xs:pb-3">
                <div
                  className={`${
                    !showFlightInfo
                      ? 'flex items-center justify-between xl:px-0 xs:px-3'
                      : 'flex items-center justify-between xl:px-0 xs:px-0'
                  }`}
                >
                  <div
                    className=" xl:py-3 xs:py-2 cursor-pointer"
                    onClick={() => {
                      showFlightInfo && dateFlexible
                        ? setShowFlightInfo(false)
                        : modifyDataFromBooking
                        ? router.push('/bookingcomplete')
                        : modifyData
                        ? router.push('/modifybooking')
                        : router?.push('/');
                      if (!showFlightInfo && (modifyBookingInfo || modifyData)) {
                        dispatch(
                          setSelectedFlightCodesWithDate({
                            departDate: previousDepartDate ? previousDepartDate : '',
                            returnDate: previousReturnDate ? previousReturnDate : '',
                            ...selectedFlightInfo,
                          })
                        );
                        modifyBookingInfo && dispatch(setModifyBookingFromBooking(false));
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      aria-hidden="true"
                      className="text-black text-sm font-black h-4 w-4"
                    />
                    <span className="px-2 text-black text-sm font-black">
                      {getFieldName(flightAvailabilityContent, 'backButton')}
                    </span>
                  </div>
                  {/* hide-modify-button */}
                  {/* <div className="border-aqua border py-2 px-3 rounded-md flex gap-2">
                    <FontAwesomeIcon
                      icon={faEdit}
                      aria-hidden="true"
                      className="text-aqua text-sm font-black h-4 w-4"
                    />
                    <span className="font-extrabold text-xs text-aqua">
                      {getFieldName(flightAvailabilityContent, 'modifyButton') +
                        ' ' +
                        getFieldName(flightAvailabilityContent, 'search')}
                    </span>
                  </div> */}
                </div>
              </div>
              <div>
                <div
                  className={`${
                    !showFlightInfo
                      ? 'xl:bg-white   xl:w-5/6 m-auto  xs:w-full xl:py-4  px-3 rounded-2xl xl:mt-1 xs:mt-0 xl:mb-10 xs:mb-5'
                      : 'xl:w-5/6 m-auto  xs:w-full rounded-2xl '
                  }`}
                >
                  <div
                    className={`${
                      !showFlightInfo
                        ? 'xl:flex xs:block justify-between xl:px-6'
                        : 'xl:flex xs:block justify-between px-0'
                    }`}
                  >
                    <div className="xs:mt-0 ">
                      <div className="xl:my-2 xs:py-0">
                        <h1 className="text-2xl font-extrabold text-black">
                          {getFieldName(flightAvailabilityContent, 'choose') +
                            ' ' +
                            getFieldName(flightAvailabilityContent, 'experience')}
                        </h1>
                      </div>
                    </div>
                    {!showFlightInfo && (
                      <div className="xl:not-sr-only	xs:sr-only">
                        <div className="xl:py-2 xs:py-4 flex xl:justify-end xs:justify-start gap-2 items-center">
                          <Image
                            src={getImageSrc(flightAvailabilityContent, 'userIcon')}
                            width={16}
                            height={16}
                            className="h-5 w-5"
                            alt=""
                          />
                          <h1 className="text-sm text-pearlgray font-medium">
                            {getFieldName(flightAvailabilityContent, 'totalJourney')}{' '}
                            {adult + (children ? children : 0)}{' '}
                            {getFieldName(flightAvailabilityContent, 'passenger')}
                          </h1>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="xl:pt-0 xs:pt-4">
                    <div
                      className={`${
                        !showFlightInfo
                          ? 'xl:flex xs:block  xl:w-full xs:w-full m-auto rounded-2xl xl:mb-5'
                          : 'xl:flex xs:block   p-0 rounded-2xl xl:mt-1 xs:mt-0'
                      }`}
                    >
                      <div
                        className={`${
                          !showFlightInfo ? 'xl:w-1/2 xs:w-full' : 'xl:w-full xs:w-full'
                        }`}
                      >
                        <div
                          className={`${!showFlightInfo ? 'xl:px-5 xl:pt-3 ' : 'xl:py-3 xl:px-0'}`}
                        >
                          <div>
                            <div className="">
                              <ul
                                className="xl:flex xl:flex-wrap xs:flex gap-2 xs:w-full -mb-px text-sm  text-center font-semibold text-black  justify-between "
                                id="myTab"
                                data-tabs-toggle="#myTabContent"
                                role="tablist"
                              >
                                <li
                                  className=" xs:w-3/12 md:w-full bg-white xl:w-1/4 hover:bg-lightskyblue  rounded-lg tab-box border-cadetgray border"
                                  role="presentation"
                                >
                                  <button
                                    className={`xl:w-full xs:w-full inline-block  p-2 border-2 ${
                                      tabIndex === 0
                                        ? 'text-darkskyblue border-darkskyblue bg-lightskyblue '
                                        : 'border-transparent '
                                    }hover:text-darkskyblue hover:border-darkskyblue hover:bg-lightskyblue rounded-lg`}
                                    onClick={() => {
                                      tabClicked(0, 'delight');
                                    }}
                                  >
                                    <Image
                                      className="h-5 w-5 object-cover"
                                      src={getImageSrc(flightAvailabilityContent, 'delightLogo')}
                                      alt="delightLogo"
                                      width={50}
                                      height={50}
                                    />
                                    <div className="text-start pt-2">
                                      <p className="font-normal text-xs hover:text-darkskyblue flex flex-start">
                                        {getFieldName(
                                          flightAvailabilityContent,
                                          'delightDescription'
                                        )}
                                      </p>
                                      <p className="font-black text-lg hover:text-darkskyblue flex flex-start font-extrabold">
                                        {getFieldName(flightAvailabilityContent, 'delight')}
                                      </p>
                                      <p className="font-extrabold text-aqua text-lg">
                                        {displayAmount('delight')}
                                      </p>
                                      <p className="text-xs  font-normal text-black">
                                        {getFieldName(flightAvailabilityContent, 'includeTax')}
                                      </p>
                                    </div>
                                  </button>
                                </li>
                                <li
                                  className=" xs:w-3/12 md:w-full bg-white xl:w-1/4 hover:bg-lightskyblue  rounded-lg tab-box border-cadetgray border"
                                  role="presentation"
                                >
                                  <button
                                    className={`xl:w-full xs:w-full inline-block  p-2 border-2 ${
                                      tabIndex === 1
                                        ? 'text-darkskyblue border-darkskyblue bg-lightskyblue '
                                        : 'border-transparent '
                                    }hover:text-darkskyblue hover:border-darkskyblue hover:bg-lightskyblue rounded-lg`}
                                    onClick={() => {
                                      tabClicked(1, 'bliss');
                                    }}
                                    type="button"
                                  >
                                    <Image
                                      className="h-5 w-5 object-cover"
                                      src={getImageSrc(flightAvailabilityContent, 'blissLogo')}
                                      alt="blissLogo"
                                      width={50}
                                      height={50}
                                    />
                                    <div className="text-start pt-2 ">
                                      <p className="font-normal text-xs hover:text-darkskyblue flex flex-start">
                                        {getFieldName(
                                          flightAvailabilityContent,
                                          'blissDescription'
                                        )}
                                      </p>
                                      <p className=" text-lg hover:text-darkskyblue flex flex-start font-extrabold">
                                        {getFieldName(flightAvailabilityContent, 'bliss')}
                                      </p>
                                      <p className="font-extrabold text-aqua text-lg">
                                        {displayAmount('bliss')}
                                      </p>
                                      <p className="text-xs  font-normal text-black">
                                        {getFieldName(flightAvailabilityContent, 'includeTax')}
                                      </p>
                                    </div>
                                  </button>
                                </li>
                                <li
                                  className="  xs:w-3/12 md:w-full bg-white xl:w-1/4 rounded-lg tab-box border-cadetgray border relative"
                                  role="presentation"
                                >
                                  <div className="xs:not-sr-only	xl:sr-only">
                                    <div className="bg-lightorange absolute -top-2 rounded-full py-1 px-6 left-8 right-8">
                                      <p className="font-extrabold  text-white recomend-font flex justify-center">
                                        {getFieldName(flightAvailabilityContent, 'recommended')}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    className={`xl:w-full xs:w-full inline-block  p-2 border-2 ${
                                      tabIndex === 2
                                        ? 'text-darkskyblue border-darkskyblue bg-lightskyblue '
                                        : 'border-transparent '
                                    }hover:text-darkskyblue hover:border-darkskyblue hover:bg-lightskyblue rounded-lg`}
                                    onClick={() => {
                                      tabClicked(2, 'opulence');
                                    }}
                                    type="button"
                                  >
                                    <Image
                                      className="h-5 w-5 object-cover"
                                      src={getImageSrc(flightAvailabilityContent, 'opulenceLogo')}
                                      alt="opulenceLogo"
                                      width={50}
                                      height={50}
                                    />
                                    <div className="text-start pt-2 ">
                                      <p className="font-normal text-xs hover:text-darkskyblue flex flex-start whitespace-nowrap">
                                        {getFieldName(
                                          flightAvailabilityContent,
                                          'opulenceDescription'
                                        )}
                                      </p>
                                      <p className="font-black text-lg hover:text-darkskyblue flex flex-start font-extrabold">
                                        {getFieldName(flightAvailabilityContent, 'opulence')}
                                      </p>
                                      <p className="font-extrabold text-aqua text-lg">
                                        {displayAmount('opulence')}
                                      </p>
                                      <p className="text-xs  font-normal text-black">
                                        {getFieldName(flightAvailabilityContent, 'includeTax')}
                                      </p>
                                    </div>
                                  </button>
                                </li>
                              </ul>
                            </div>
                            {/* <h1
                      className="text-base font-black text-aqua text-center py-3 cursor-pointer"
                      onClick={() => {
                        setShowModal({
                          depart: false,
                          return: false,
                          passenger: false,
                          compareFareFamily: true,
                        });
                        document.body.style.overflow = 'hidden';
                      }}
                    >
                      {getFieldName(flightAvailabilityContent, 'compareFareFamilies')}
                    </h1> */}
                            {!showFlightInfo && (
                              <div className="xl:not-sr-only	xs:sr-only">
                                {selectFlight?.details?.FaireFamilies?.map((item, index) => (
                                  <Fragment key={index}>
                                    <div className="border-cadetgray border bg-white p-3 rounded-lg mt-3">
                                      <div className="flex justify-between">
                                        <div className="w-2/6">
                                          <h1 className="text-lg font-black text-aqua">
                                            {index === 0 ? originCode : destinationCode}
                                          </h1>
                                          <p className="font-light text-xs text-pearlgray">
                                            {item?.originName}
                                          </p>
                                        </div>
                                        <div className="flex justify-around items-center w-2/6">
                                          <div>
                                            <p className="font-extrabold text-xs text-aqua">
                                              {index === 0
                                                ? getFieldName(
                                                    flightAvailabilityContent,
                                                    'outbound'
                                                  )
                                                : getFieldName(
                                                    flightAvailabilityContent,
                                                    'inbound'
                                                  )}
                                            </p>
                                          </div>
                                          <div>
                                            <Image
                                              src={getImageSrc(
                                                flightAvailabilityContent,
                                                'bluePlaneIcon'
                                              )}
                                              width={15}
                                              height={13}
                                              className="h-5 w-6"
                                              alt=""
                                            />
                                          </div>
                                          <div>
                                            <Image
                                              src={getImageSrc(
                                                flightAvailabilityContent,
                                                'arrowIcon'
                                              )}
                                              width={35}
                                              height={12}
                                              className="h-5 w-16"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                        <div className="w-2/6">
                                          <h1 className="text-lg font-black text-aqua">
                                            {index === 0 ? destinationCode : originCode}
                                          </h1>
                                          <p className="font-light text-xs text-pearlgray">
                                            {item?.destinationName}
                                          </p>
                                        </div>
                                      </div>
                                      {selectFlight?.details?.FaireFamilies?.length > 1 &&
                                        index === 0 && (
                                          <div className="my-3">
                                            <div className="border-b border-cadetgray"></div>
                                          </div>
                                        )}
                                    </div>
                                  </Fragment>
                                ))}
                              </div>
                            )}
                            {/* <CompareFareFamilies
                      id="compare-fare"
                      setShowModal={setShowModal}
                      showModal={showModal?.compareFareFamily}
                    /> */}
                          </div>
                        </div>
                      </div>
                      <div className="xl:w-1/2 xs:w-full">
                        <div className="xl:px-5 xs:mt-8 xl:mt-0 ">
                          {/* <div className="xs:mt-0 xs:px-3 xl:px-0">
                    <div className="flex justify-between items-center xl:py-0 xs:py-3">
                      <div
                        className="xl:py-3 xs:py-2 cursor-pointer"
                        onClick={() => {3
                          showFlightInfo && dateFlexible
                            ? setShowFlightInfo(false)
                            : modifyData
                            ? router.push('/modifybooking')
                            : router?.push('/');
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          aria-hidden="true"
                          className="text-black text-sm font-black h-4 w-4"
                        />
                        <span className="px-2 text-black text-sm font-black">
                          {getFieldName(flightAvailabilityContent, 'backButton')}
                        </span>
                      </div>
                    </div>
                    <div className="xl:my-2 xs:py-0">
                      <h1 className="text-2xl font-black text-black">
                        {getFieldName(flightAvailabilityContent, 'pageName')}
                      </h1>
                    </div>
                  </div> */}
                          <div>
                            {!showFlightInfo && (
                              <div className="xs:not-sr-only	xl:sr-only">
                                <div className="xl:py-2 xs:py-4 flex xl:justify-end xs:justify-start gap-2 items-center">
                                  <Image
                                    src={getImageSrc(flightAvailabilityContent, 'userIcon')}
                                    width={16}
                                    height={16}
                                    className="h-5 w-5"
                                    alt=""
                                  />
                                  <h1 className="text-sm text-black font-medium">
                                    {getFieldName(flightAvailabilityContent, 'totalJourney')}{' '}
                                    {adult + (children ? children : 0)}{' '}
                                    {getFieldName(flightAvailabilityContent, 'passenger')}
                                  </h1>
                                </div>
                              </div>
                            )}
                            {/* <h1
                      className="text-base font-black text-aqua text-center py-3 cursor-pointer"
                      onClick={() => {
                        setShowModal({
                          depart: false,
                          return: false,
                          passenger: false,
                          compareFareFamily: true,
                        });
                        document.body.style.overflow = 'hidden';
                      }}
                    >
                      {getFieldName(flightAvailabilityContent, 'compareFareFamilies')}
                    </h1>
                    <CompareFareFamilies
                      id="compare-fare"
                      setShowModal={setShowModal}
                      showModal={showModal?.compareFareFamily}
                    /> */}
                            {!showFlightInfo && (
                              <div>
                                {tabIndex === 0 && (
                                  <Delight
                                    router={router}
                                    showModal={showModal}
                                    modifyData={modifyData || modifyDataFromBooking}
                                    setShowModal={setShowModal}
                                    selectFlight={selectFlight}
                                    noDataFound={getFieldName(
                                      flightAvailabilityContent,
                                      'noDataFound'
                                    )}
                                    notAvailable={getFieldName(
                                      flightAvailabilityContent,
                                      'notAvailable'
                                    )}
                                    modifyButton={getFieldName(
                                      flightAvailabilityContent,
                                      'modifyButton'
                                    )}
                                    passengerLogo={getImageSrc(
                                      flightAvailabilityContent,
                                      'passengerLogo'
                                    )}
                                    confirmButton={getFieldName(
                                      flightAvailabilityContent,
                                      'confirmButton'
                                    )}
                                    passengersLabel={getFieldName(
                                      flightAvailabilityContent,
                                      'passengersLabel'
                                    )}
                                    passengerCount={passengerCount}
                                    showFlightInfo={showFlightInfo}
                                    setSelectFlight={setSelectFlight}
                                    setShowFlightInfo={setShowFlightInfo}
                                    setPassengerCount={setPassengerCount}
                                    PassangerLastname={findBookingInfo?.PassengerName}
                                    adultLabel={
                                      passengerCount?.adult > 1
                                        ? getFieldName(passengerContent, 'adults')
                                        : getFieldName(passengerContent, 'adult')
                                    }
                                    PnrCode={modifyBookingInfo?.PnrInformation?.PnrCode}
                                    childrenLabel={
                                      passengerCount?.children > 1
                                        ? getFieldName(passengerContent, 'children')
                                        : getFieldName(passengerContent, 'child')
                                    }
                                    fareFamily={getFieldName(flightAvailabilityContent, 'delight')}
                                  />
                                )}
                                {tabIndex === 1 && (
                                  <Bliss
                                    router={router}
                                    showModal={showModal}
                                    modifyData={modifyData || modifyDataFromBooking}
                                    setShowModal={setShowModal}
                                    selectFlight={selectFlight}
                                    noDataFound={getFieldName(
                                      flightAvailabilityContent,
                                      'noDataFound'
                                    )}
                                    notAvailable={getFieldName(
                                      flightAvailabilityContent,
                                      'notAvailable'
                                    )}
                                    modifyButton={getFieldName(
                                      flightAvailabilityContent,
                                      'modifyButton'
                                    )}
                                    passengerLogo={getImageSrc(
                                      flightAvailabilityContent,
                                      'passengerLogo'
                                    )}
                                    confirmButton={getFieldName(
                                      flightAvailabilityContent,
                                      'confirmButton'
                                    )}
                                    passengersLabel={getFieldName(
                                      flightAvailabilityContent,
                                      'passengersLabel'
                                    )}
                                    passengerCount={passengerCount}
                                    showFlightInfo={showFlightInfo}
                                    setSelectFlight={setSelectFlight}
                                    setShowFlightInfo={setShowFlightInfo}
                                    setPassengerCount={setPassengerCount}
                                    PassangerLastname={findBookingInfo?.PassengerName}
                                    adultLabel={
                                      passengerCount?.adult > 1
                                        ? getFieldName(passengerContent, 'adults')
                                        : getFieldName(passengerContent, 'adult')
                                    }
                                    PnrCode={modifyBookingInfo?.PnrInformation?.PnrCode}
                                    childrenLabel={
                                      passengerCount?.children > 1
                                        ? getFieldName(passengerContent, 'children')
                                        : getFieldName(passengerContent, 'child')
                                    }
                                    fareFamily={getFieldName(flightAvailabilityContent, 'bliss')}
                                  />
                                )}
                                {tabIndex === 2 && (
                                  <Opulence
                                    router={router}
                                    showModal={showModal}
                                    modifyData={modifyData || modifyDataFromBooking}
                                    setShowModal={setShowModal}
                                    selectFlight={selectFlight}
                                    noDataFound={getFieldName(
                                      flightAvailabilityContent,
                                      'noDataFound'
                                    )}
                                    notAvailable={getFieldName(
                                      flightAvailabilityContent,
                                      'notAvailable'
                                    )}
                                    modifyButton={getFieldName(
                                      flightAvailabilityContent,
                                      'modifyButton'
                                    )}
                                    passengerLogo={getImageSrc(
                                      flightAvailabilityContent,
                                      'passengerLogo'
                                    )}
                                    confirmButton={getFieldName(
                                      flightAvailabilityContent,
                                      'confirmButton'
                                    )}
                                    passengersLabel={getFieldName(
                                      flightAvailabilityContent,
                                      'passengersLabel'
                                    )}
                                    passengerCount={passengerCount}
                                    showFlightInfo={showFlightInfo}
                                    setSelectFlight={setSelectFlight}
                                    setShowFlightInfo={setShowFlightInfo}
                                    setPassengerCount={setPassengerCount}
                                    PassangerLastname={findBookingInfo?.PassengerName}
                                    adultLabel={
                                      passengerCount?.adult > 1
                                        ? getFieldName(passengerContent, 'adults')
                                        : getFieldName(passengerContent, 'adult')
                                    }
                                    PnrCode={modifyBookingInfo?.PnrInformation?.PnrCode}
                                    childrenLabel={
                                      passengerCount?.children > 1
                                        ? getFieldName(passengerContent, 'children')
                                        : getFieldName(passengerContent, 'child')
                                    }
                                    fareFamily={getFieldName(flightAvailabilityContent, 'opulence')}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!showFlightInfo ? (
                <div className="xl:flex xs:block gap-3  xl:w-5/6 xs:w-full xs:px-3 m-auto rounded-2xl mt-1 pb-7">
                  <div className="xl:w-1/3 xs:w-full">
                    <div
                      className={`${
                        selectFlight?.name === getFieldName(flightAvailabilityContent, 'delight')
                          ? ''
                          : 'xl:not-sr-only	xs:sr-only'
                      } `}
                    >
                      <div
                        className={`bg-white p-4 rounded-2xl ${
                          selectFlight?.name === getFieldName(flightAvailabilityContent, 'delight')
                            ? 'border border-aqua'
                            : 'my-8'
                        }`}
                      >
                        <div className="flex gap-2 items-center justify-center py-3">
                          <div>
                            <Image
                              src={getImageSrc(flightAvailabilityContent, 'delightLogo')}
                              className="h-5 w-5"
                              alt=""
                              width={55}
                              height={50}
                            />
                          </div>
                          <h1 className="font-extrabold text-2xl text-black">
                            {getFieldName(flightAvailabilityContent, 'delight')}{' '}
                            {getFieldName(flightAvailabilityContent, 'experience')}
                          </h1>
                        </div>
                        <div>
                          <Image
                            src={getImageSrc(flightAvailabilityContent, 'delightBanner')}
                            className="h-44 w-full rounded-md"
                            alt=""
                            width={336}
                            height={201}
                          />
                        </div>
                        <div className="border border-cadetgray p-3 rounded-2xl my-3 ">
                          <div className="my-3">
                            <p className="font-extrabold text-sm text-black">
                              {getFieldName(flightAvailabilityContent, 'included')}
                            </p>
                          </div>
                          <div>
                            <table className="w-full text-sm text-left ">
                              <tbody>
                                {fareFamilyDetails?.included?.map(
                                  (
                                    item: {
                                      delight: {
                                        information: string;
                                        description: string;
                                      };
                                      label: string;
                                    },
                                    index: number
                                  ) => (
                                    <tr
                                      className={index % 2 === 0 ? 'bg-skylight' : 'bg-white'}
                                      key={index}
                                    >
                                      <th
                                        scope="row"
                                        className="px-2 py-4 font-medium  text-slategeay"
                                      >
                                        <div className="flex items-center">
                                          <div className="w-1/4">
                                            <Image
                                              src={
                                                item?.delight?.information?.toLowerCase() === 'no'
                                                  ? getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCancelIcon'
                                                    )
                                                  : getImageSrc(
                                                      flightAvailabilityContent,
                                                      'checkIcon'
                                                    )
                                              }
                                              className="h-6 w-6"
                                              alt=""
                                              width={336}
                                              height={201}
                                            />
                                          </div>
                                          <div className="w-full">
                                            <h6 className="font-medium text-xs text-black">
                                              {item?.label}
                                            </h6>
                                          </div>
                                        </div>
                                      </th>
                                      <td className="px-2 py-4 ">
                                        <div
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 flex justify-between ${
                                            item?.delight?.information?.toLowerCase() === 'free'
                                              ? 'text-green'
                                              : 'text-black'
                                          }`}
                                        >
                                          {item?.delight?.information}
                                          {item?.delight?.description?.length > 0 &&
                                            item?.delight?.description?.toLowerCase() !==
                                              'null' && (
                                              <div className="relative flex flex-col items-center group">
                                                <span className="pl-1">
                                                  <Image
                                                    src={getImageSrc(
                                                      flightAvailabilityContent,
                                                      'infoIcon'
                                                    )}
                                                    className=" w-5 h-5 object-cover"
                                                    alt="tooltip"
                                                    width={336}
                                                    height={201}
                                                  />
                                                </span>
                                                <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex  w-64 pl-3">
                                                  <span className="relative z-10 p-2 text-xs   whitespace-no-wrap  bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal">
                                                    {item?.delight?.description}
                                                  </span>
                                                  <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="border border-cadetgray p-3 rounded-2xl my-3">
                          <div className="my-3">
                            <p className="font-extrabold text-sm text-black">
                              {getFieldName(flightAvailabilityContent, 'luxuryBenefits')}
                            </p>
                          </div>
                          <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400  ">
                              <tbody>
                                {fareFamilyDetails?.luxuryBenefit?.map(
                                  (
                                    item: {
                                      delight: {
                                        information: string;
                                        description: string;
                                      };
                                      label: string;
                                    },
                                    index: number
                                  ) => (
                                    <tr
                                      className={index % 2 === 0 ? 'bg-skylight' : 'bg-white'}
                                      key={index}
                                    >
                                      <th
                                        scope="row"
                                        className="px-2 py-4 font-medium  text-slategeay"
                                      >
                                        <div className="flex items-center">
                                          <div className="w-1/4">
                                            <Image
                                              src={
                                                item?.delight?.information?.toLowerCase() === 'no'
                                                  ? getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCancelIcon'
                                                    )
                                                  : getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCheckIcon'
                                                    )
                                              }
                                              className="h-6 w-6"
                                              alt=""
                                              width={336}
                                              height={201}
                                            />
                                          </div>
                                          <div className="w-full">
                                            <h6 className="font-medium text-xs text-black">
                                              {item?.label}
                                            </h6>
                                          </div>
                                        </div>
                                      </th>
                                      <td className="px-2 py-4 ">
                                        <div
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 flex justify-between ${
                                            item?.delight?.information?.toLowerCase() === 'free'
                                              ? 'text-green'
                                              : 'text-black'
                                          }`}
                                        >
                                          {item?.delight?.information}
                                          {item?.delight?.description?.length > 0 &&
                                            item?.delight?.description?.toLowerCase() !==
                                              'null' && (
                                              <div className="relative flex flex-col items-center group">
                                                <span className="pl-1">
                                                  <Image
                                                    src={getImageSrc(
                                                      flightAvailabilityContent,
                                                      'infoIcon'
                                                    )}
                                                    className=" w-5 h-5 object-cover"
                                                    alt="tooltip"
                                                    width={336}
                                                    height={201}
                                                  />
                                                </span>
                                                <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex  w-64 pl-3">
                                                  <span className="relative z-10 p-2 text-xs   whitespace-no-wrap  bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal">
                                                    {item?.delight?.description}
                                                  </span>
                                                  <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                          {selectFlight?.name ===
                            getFieldName(flightAvailabilityContent, 'delight') && (
                            <div className="mt-2">
                              <button
                                type="button"
                                className="w-full xs:justify-center font-extrabold xs:text-center text-white  bg-aqua  rounded-lg text-lg inline-flex items-center px-3 py-2 text-center border border-aqua"
                                onClick={continueButton}
                              >
                                {getFieldName(flightAvailabilityContent, 'continue')}
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            className="w-full xs:justify-center font-extrabold xs:text-center text-aqua border border-aqua  rounded-lg text-lg inline-flex items-center px-2 py-2 text-center mt-3"
                            onClick={() => {
                              selectFlight?.name ===
                              getFieldName(flightAvailabilityContent, 'delight')
                                ? updateFareFamily(
                                    getFieldName(flightAvailabilityContent, 'opulence')
                                  )
                                : updateFareFamily(
                                    getFieldName(flightAvailabilityContent, 'delight')
                                  );
                            }}
                          >
                            {selectFlight?.name ===
                            getFieldName(flightAvailabilityContent, 'delight')
                              ? getFieldName(flightAvailabilityContent, 'upgradeOpulence')
                              : getFieldName(flightAvailabilityContent, 'choosePackage') +
                                ' ' +
                                getFieldName(flightAvailabilityContent, 'delight') +
                                ' ' +
                                getFieldName(flightAvailabilityContent, 'experience')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="xl:w-1/3 xs:w-full">
                    <div
                      className={`${
                        selectFlight?.name === getFieldName(flightAvailabilityContent, 'bliss')
                          ? ''
                          : 'xl:not-sr-only	xs:sr-only'
                      } `}
                    >
                      <div
                        className={` p-4 bg-white rounded-2xl ${
                          selectFlight?.name === getFieldName(flightAvailabilityContent, 'bliss')
                            ? 'border border-aqua'
                            : 'my-8'
                        }`}
                      >
                        <div className="flex gap-2 items-center justify-center py-3">
                          <div>
                            <Image
                              src={getImageSrc(flightAvailabilityContent, 'blissLogo')}
                              className="h-5 w-5"
                              alt=""
                              width={50}
                              height={50}
                            />
                          </div>
                          <h1 className="font-extrabold text-2xl text-black">
                            {getFieldName(flightAvailabilityContent, 'bliss')}{' '}
                            {getFieldName(flightAvailabilityContent, 'experience')}
                          </h1>
                        </div>
                        <div>
                          <Image
                            src={getImageSrc(flightAvailabilityContent, 'blissBanner')}
                            className="h-44 w-full rounded-md"
                            alt=""
                            width={336}
                            height={207}
                          />
                        </div>
                        <div className="border border-cadetgray p-3 rounded-2xl my-3 ">
                          <div className="my-3">
                            <p className="font-extrabold text-sm text-black">
                              {getFieldName(flightAvailabilityContent, 'included')}
                            </p>
                          </div>
                          <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400  ">
                              <tbody>
                                {fareFamilyDetails?.included?.map(
                                  (
                                    item: {
                                      bliss: {
                                        information: string;
                                        description: string;
                                      };
                                      label: string;
                                    },
                                    index: number
                                  ) => (
                                    <tr
                                      className={index % 2 === 0 ? 'bg-skylight' : 'bg-white'}
                                      key={index}
                                    >
                                      <th
                                        scope="row"
                                        className="px-2 py-4 font-medium  text-slategeay"
                                      >
                                        <div className="flex items-center">
                                          <div className="w-1/4">
                                            <Image
                                              src={
                                                item?.bliss?.information?.toLowerCase() === 'no'
                                                  ? getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCancelIcon'
                                                    )
                                                  : getImageSrc(
                                                      flightAvailabilityContent,
                                                      'checkIcon'
                                                    )
                                              }
                                              className="h-6 w-6"
                                              alt=""
                                              width={336}
                                              height={201}
                                            />
                                          </div>
                                          <div className="w-full">
                                            <h6 className="font-medium text-xs text-black">
                                              {item?.label}
                                            </h6>
                                          </div>
                                        </div>
                                      </th>
                                      <td className="px-2 py-4 ">
                                        <div
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 flex justify-between ${
                                            item?.bliss?.information?.toLowerCase() === 'free'
                                              ? 'text-green'
                                              : 'text-black'
                                          }`}
                                        >
                                          {item?.bliss?.information}
                                          {item?.bliss?.description?.length > 0 &&
                                            item?.bliss?.description?.toLowerCase() !== 'null' && (
                                              <div className="relative flex flex-col items-center group">
                                                <span className="pl-1">
                                                  <Image
                                                    src={getImageSrc(
                                                      flightAvailabilityContent,
                                                      'infoIcon'
                                                    )}
                                                    className=" w-5 h-5 object-cover"
                                                    alt="tooltip"
                                                    width={336}
                                                    height={201}
                                                  />
                                                </span>
                                                <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex  w-64 pl-3">
                                                  <span className="relative z-10 p-2 text-xs   whitespace-no-wrap  bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal">
                                                    {item?.bliss?.description}
                                                  </span>
                                                  <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="border border-cadetgray p-3 rounded-2xl my-3 ">
                          <div className="my-3">
                            <p className="font-extrabold text-sm text-black">
                              {getFieldName(flightAvailabilityContent, 'luxuryBenefits')}
                            </p>
                          </div>
                          <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400  ">
                              <tbody>
                                {fareFamilyDetails?.luxuryBenefit?.map(
                                  (
                                    item: {
                                      bliss: {
                                        information: string;
                                        description: string;
                                      };
                                      label: string;
                                    },
                                    index: number
                                  ) => (
                                    <tr
                                      className={index % 2 === 0 ? 'bg-skylight' : 'bg-white'}
                                      key={index}
                                    >
                                      <th
                                        scope="row"
                                        className="px-2 py-4 font-medium  text-slategeay"
                                      >
                                        <div className="flex items-center ">
                                          <div className="w-1/4">
                                            <Image
                                              src={
                                                item?.bliss?.information?.toLowerCase() === 'no'
                                                  ? getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCancelIcon'
                                                    )
                                                  : getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCheckIcon'
                                                    )
                                              }
                                              className="h-6 w-6"
                                              alt=""
                                              width={336}
                                              height={201}
                                            />
                                          </div>
                                          <div className="w-full">
                                            <h6 className="font-medium text-xs text-black">
                                              {item?.label}
                                            </h6>
                                          </div>
                                        </div>
                                      </th>
                                      <td className="px-2 py-4 ">
                                        <div
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 justify-between text-black align-center ${
                                            item?.bliss?.information?.toLowerCase() === 'free'
                                              ? 'text-green'
                                              : 'text-black'
                                          }`}
                                        >
                                          {item?.bliss?.information}
                                          {item?.bliss?.description?.length > 0 &&
                                            item?.bliss?.description?.toLowerCase() !== 'null' && (
                                              <div className="relative flex flex-col items-center group">
                                                <span className="pl-1">
                                                  <Image
                                                    src={getImageSrc(
                                                      flightAvailabilityContent,
                                                      'infoIcon'
                                                    )}
                                                    className=" w-5 h-5 object-cover"
                                                    alt="tooltip"
                                                    width={336}
                                                    height={201}
                                                  />
                                                </span>
                                                <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex  w-64 pl-3">
                                                  <span className="relative z-10 p-2 text-xs   whitespace-no-wrap  bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal">
                                                    {item?.bliss?.description}
                                                  </span>
                                                  <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                          {selectFlight?.name ===
                            getFieldName(flightAvailabilityContent, 'bliss') && (
                            <button
                              type="button"
                              className="w-full xs:justify-center font-extrabold xs:text-center text-white  bg-aqua  rounded-lg text-lg inline-flex items-center px-3 py-2 text-center border border-aqua"
                              onClick={continueButton}
                            >
                              {getFieldName(flightAvailabilityContent, 'continue')}
                            </button>
                          )}
                          <button
                            type="button"
                            className="w-full xs:justify-center font-extrabold xs:text-center text-aqua border border-aqua  rounded-lg text-lg inline-flex items-center px-2 py-2 text-center mt-3 "
                            onClick={() => {
                              selectFlight?.name ===
                              getFieldName(flightAvailabilityContent, 'bliss')
                                ? updateFareFamily(
                                    getFieldName(flightAvailabilityContent, 'opulence')
                                  )
                                : updateFareFamily(
                                    getFieldName(flightAvailabilityContent, 'bliss')
                                  );
                            }}
                          >
                            {selectFlight?.name === getFieldName(flightAvailabilityContent, 'bliss')
                              ? getFieldName(flightAvailabilityContent, 'upgradeOpulence')
                              : getFieldName(flightAvailabilityContent, 'choosePackage') +
                                ' ' +
                                getFieldName(flightAvailabilityContent, 'bliss') +
                                ' ' +
                                getFieldName(flightAvailabilityContent, 'experience')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="xl:w-1/3 xs:w-full">
                    <div
                      className={`${
                        selectFlight?.name === getFieldName(flightAvailabilityContent, 'opulence')
                          ? ''
                          : 'xl:not-sr-only	xs:sr-only'
                      } `}
                    >
                      <div
                        className={`bg-white p-4 rounded-2xl relative ${
                          selectFlight?.name === getFieldName(flightAvailabilityContent, 'opulence')
                            ? 'border border-aqua'
                            : 'my-8'
                        }`}
                      >
                        <div className="flex justify-center">
                          <div className="bg-lightorange absolute -top-2 rounded-full py-1 px-3">
                            <p className="font-extrabold text-sm text-white ">
                              {getFieldName(flightAvailabilityContent, 'recommended')}{' '}
                              {getFieldName(flightAvailabilityContent, 'experience').toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center justify-center py-3 xl:mt-0 xs:mt-3">
                          <div>
                            <Image
                              src={getImageSrc(flightAvailabilityContent, 'opulenceLogo')}
                              className="h-5 w-5"
                              alt=""
                              width={50}
                              height={50}
                            />
                          </div>

                          <h1 className="font-extrabold text-2xl text-black">
                            {getFieldName(flightAvailabilityContent, 'opulence')}{' '}
                            {getFieldName(flightAvailabilityContent, 'experience')}
                          </h1>
                        </div>
                        <div>
                          <Image
                            src={getImageSrc(flightAvailabilityContent, 'opulenceBanner')}
                            className="h-44 w-full rounded-md"
                            alt=""
                            width={338}
                            height={200}
                          />
                        </div>
                        <div className="border border-cadetgray p-3 rounded-2xl my-3 ">
                          <div className="my-3">
                            <p className="font-extrabold text-sm text-black">
                              {getFieldName(flightAvailabilityContent, 'included')}
                            </p>
                          </div>
                          <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400  ">
                              <tbody>
                                {fareFamilyDetails?.included?.map(
                                  (
                                    item: {
                                      opulence: {
                                        information: string;
                                        description: string;
                                      };
                                      label: string;
                                    },
                                    index: number
                                  ) => (
                                    <tr
                                      className={index % 2 === 0 ? 'bg-skylight' : 'bg-white'}
                                      key={index}
                                    >
                                      <th
                                        scope="row"
                                        className="px-2 py-4 font-medium  text-slategeay"
                                      >
                                        <div className="flex items-center">
                                          <div className="w-1/4">
                                            <Image
                                              src={
                                                item?.opulence?.information?.toLowerCase() === 'no'
                                                  ? getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCancelIcon'
                                                    )
                                                  : getImageSrc(
                                                      flightAvailabilityContent,
                                                      'checkIcon'
                                                    )
                                              }
                                              className="h-6 w-6"
                                              alt=""
                                              width={336}
                                              height={201}
                                            />
                                          </div>
                                          <div className="w-full">
                                            <h6 className="font-medium text-xs text-black">
                                              {item?.label}
                                            </h6>
                                          </div>
                                        </div>
                                      </th>
                                      <td className="px-2 py-4 ">
                                        <div
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 justify-between text-black align-center ${
                                            item?.opulence?.information?.toLowerCase() === 'free'
                                              ? 'text-green'
                                              : 'text-black'
                                          }`}
                                        >
                                          {item?.opulence?.information}
                                          {item?.opulence?.description?.length > 0 &&
                                            item?.opulence?.description?.toLowerCase() !==
                                              'null' && (
                                              <div className="relative flex flex-col items-center group">
                                                <span className="pl-1">
                                                  <Image
                                                    src={getImageSrc(
                                                      flightAvailabilityContent,
                                                      'infoIcon'
                                                    )}
                                                    className=" w-5 h-5 object-cover"
                                                    alt="tooltip"
                                                    width={336}
                                                    height={201}
                                                  />
                                                </span>
                                                <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex  w-64 pl-3">
                                                  <span className="relative z-10 p-2 text-xs   whitespace-no-wrap  bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal">
                                                    {item?.opulence?.description}
                                                  </span>
                                                  <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="border border-cadetgray p-3 rounded-2xl my-3 ">
                          <div className="my-3">
                            <p className="font-extrabold text-sm text-black">
                              {getFieldName(flightAvailabilityContent, 'luxuryBenefits')}
                            </p>
                          </div>
                          <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400  ">
                              <tbody>
                                {fareFamilyDetails?.luxuryBenefit?.map(
                                  (
                                    item: {
                                      opulence: {
                                        information: string;
                                        description: string;
                                      };
                                      label: string;
                                    },
                                    index: number
                                  ) => (
                                    <tr
                                      className={index % 2 === 0 ? 'bg-skylight' : 'bg-white'}
                                      key={index}
                                    >
                                      <th
                                        scope="row"
                                        className="px-2 py-4 font-medium  text-slategeay"
                                      >
                                        <div className="flex items-center">
                                          <div className="w-1/4">
                                            <Image
                                              src={
                                                item?.opulence?.information?.toLowerCase() === 'no'
                                                  ? getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCancelIcon'
                                                    )
                                                  : getImageSrc(
                                                      flightAvailabilityContent,
                                                      'circleCheckIcon'
                                                    )
                                              }
                                              className="h-6 w-6"
                                              alt=""
                                              width={24}
                                              height={25}
                                            />
                                          </div>
                                          <div className="w-full">
                                            <h6 className="font-medium text-xs text-black">
                                              {item?.label}
                                            </h6>
                                          </div>
                                        </div>
                                      </th>
                                      <td className="px-2 py-4 ">
                                        <div className="flex align-center justify-between">
                                          <div
                                            className={`font-extrabold text-xs w-full flex items-center gap-1 justify-between text-black align-center ${
                                              item?.opulence?.information?.toLowerCase() === 'free'
                                                ? 'text-green'
                                                : 'text-black'
                                            }`}
                                          >
                                            {item?.opulence?.information}
                                          </div>
                                          <div>
                                            {item?.opulence?.description?.length > 0 &&
                                              item?.opulence?.description?.toLowerCase() !==
                                                'null' && (
                                                <div className="relative flex flex-col items-center group ">
                                                  <span
                                                    style={{
                                                      width: '22px',
                                                      height: '22px',
                                                      textAlign: 'center',
                                                    }}
                                                  >
                                                    <Image
                                                      src={getImageSrc(
                                                        flightAvailabilityContent,
                                                        'infoIcon'
                                                      )}
                                                      width={16}
                                                      height={17}
                                                      className=" w-5 h-5 object-cover"
                                                      alt="tooltip"
                                                    />
                                                  </span>
                                                  <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex  w-64 pl-3">
                                                    <span className="relative z-10 p-2 text-xs   whitespace-no-wrap  bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal">
                                                      {item?.opulence?.description}
                                                    </span>
                                                    <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
                                                  </div>
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                          {selectFlight?.name ===
                            getFieldName(flightAvailabilityContent, 'opulence') && (
                            <button
                              type="button"
                              className="w-full xs:justify-center font-extrabold xs:text-center text-white  bg-aqua  rounded-lg text-lg inline-flex items-center px-3 py-2 text-center border border-aqua"
                              onClick={continueButton}
                            >
                              {getFieldName(flightAvailabilityContent, 'continue')}
                            </button>
                          )}
                          <button
                            type="button"
                            className="w-full xs:justify-center font-extrabold xs:text-center text-aqua border border-aqua  rounded-lg text-lg inline-flex items-center px-2 py-2 text-center mt-3 "
                            onClick={() => {
                              selectFlight?.name !==
                                getFieldName(flightAvailabilityContent, 'opulence') &&
                                updateFareFamily(
                                  getFieldName(flightAvailabilityContent, 'opulence')
                                );
                            }}
                          >
                            {selectFlight?.name ===
                            getFieldName(flightAvailabilityContent, 'opulence')
                              ? getFieldName(flightAvailabilityContent, 'bestExperience')
                              : getFieldName(flightAvailabilityContent, 'choosePackage') +
                                ' ' +
                                getFieldName(flightAvailabilityContent, 'opulence') +
                                ' ' +
                                getFieldName(flightAvailabilityContent, 'experience')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <FlightInfo
                  showModal={showModal}
                  setShowModal={setShowModal}
                  setSelectFlight={setSelectFlight}
                  setShowFlightInfo={setShowFlightInfo}
                />
              )}
            </div>
          </div>
        </Fragment>
      ) : load?.name === 'search' ? (
        <SearchFlightLoader open={load?.show} />
      ) : (
        load.name === 'exp' && <SavingExpLoader open={load?.show} />
      )}
    </main>
  );
};

export default FlightAvailability;
