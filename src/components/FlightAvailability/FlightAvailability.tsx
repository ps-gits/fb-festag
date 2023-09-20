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

  const imageLoader = () => {
    return `https://ipac.ctnsnet.com/int/integration?pixel=79124014&nid=2142538&cont=i`
  }
   

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
      <Image 
        src={'https://ipac.ctnsnet.com/int/integration?pixel=79124014&nid=2142538&cont=i'}
        loader={imageLoader}
        width={1}
        height={1}
        alt="pixel" 
        />
        
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WHMT2ZS3"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      
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
                                        ? 'text-darkskyblue border-darkskyblue bg-lightskyblue bg-lightaqua'
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
                                        ? 'text-darkskyblue border-darkskyblue bg-lightskyblue bg-lightaqua'
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
                                        ? 'text-darkskyblue border-darkskyblue bg-lightskyblue bg-lightaqua'
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
                                        <div className="w-2/6 mb-2">
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
                                      {item?.Stops &&
                                        item?.Stops?.length > 0 &&
                                        item?.Stops[0]?.LocationCode !== null && (
                                          <div className="flex items-center">
                                            <div className="pr-1">
                                              <Image
                                                src={getImageSrc(
                                                  flightAvailabilityContent,
                                                  'infoIcon'
                                                )}
                                                className=" w-5 h-5 object-cover cursor-pointer"
                                                alt="tooltip"
                                                width={336}
                                                height={201}
                                              />
                                            </div>
                                            <div className="pl-1 text-pearlgray text-xs">
                                              {item?.Remarks !== null && item?.Remarks}
                                            </div>
                                          </div>
                                        )}
                                      {selectFlight?.details?.FaireFamilies?.length > 1 &&
                                        index === 0 && (
                                          <div className="my-3">
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
                  {/* <div className="xl:w-1/3 xs:w-full">
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
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 justify-between text-black items-center ${
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
                  </div> */}
                  <div className="xl:w-1/3 xs:w-full">
                    <div
                      className={`${
                        selectFlight?.name === getFieldName(flightAvailabilityContent, 'bliss')
                          ? ''
                          : 'xl:not-sr-only	xs:sr-only'
                      } `}
                    >
                      <div
                        className={`bg-white p-4 rounded-2xl relative ${
                          selectFlight?.name === getFieldName(flightAvailabilityContent, 'bliss')
                            ? 'border border-aqua'
                            : 'my-8'
                        }`}
                      >
                        <div className="flex">
                          <div className=" absolute rounded-2xl wedge-container">
                              <div className="flex group">
                                <p className='wedge-content'>SPECIAL OFFER ⓘ </p>
                                <svg width="101" height="87" viewBox="0 0 101 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M101 0L0 87V19.2C0 12.4794 0 9.11905 1.30792 6.55211C2.4584 4.29417 4.29417 2.4584 6.55211 1.30792C9.11905 0 12.4794 0 19.2 0H101Z" fill="#1D7D92"/>
                                </svg>
                                <svg width="34" height="34" className='wedge-logo' viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.8688 5.02565C19.4459 4.99772 19.0243 5.09609 18.6575 5.30826L3.50413 14.0569C3.13233 14.2745 2.86132 14.6299 2.74993 15.046C2.63854 15.4621 2.69574 15.9053 2.90913 16.2796L7.65745 24.5033C7.87501 24.8748 8.23023 25.1457 8.64611 25.2571C9.06199 25.3685 9.50501 25.3114 9.87913 25.0984L25.0325 16.3497C25.5372 16.0586 25.8857 15.5868 26.027 15.0609C26.3999 13.6669 26.8345 11.8044 27.2011 10.3158C28.0149 10.404 28.7396 10.5601 29.2836 10.7514C29.6469 10.8789 29.9317 11.0245 30.09 11.1457C30.2388 11.2583 30.2345 11.3029 30.2334 11.2805C30.2292 11.2805 30.2324 11.2806 30.2249 11.2912C30.1824 11.3369 30.0709 11.4197 29.9009 11.4983C29.5609 11.6556 28.9978 11.7991 28.3135 11.8766C28.3061 11.8765 28.2986 11.8765 28.2912 11.8766H28.2466C28.2062 11.8766 28.1509 11.8873 28.0936 11.8873C27.9809 11.8979 27.9342 11.8872 27.8173 11.9021C27.7451 11.9048 27.6742 11.9223 27.609 11.9534C27.5438 11.9845 27.4856 12.0286 27.438 12.083C27.3904 12.1374 27.3544 12.2009 27.3321 12.2696C27.3099 12.3384 27.302 12.411 27.3088 12.483C27.3156 12.5549 27.337 12.6248 27.3717 12.6882C27.4064 12.7516 27.4537 12.8071 27.5106 12.8516C27.5676 12.8961 27.633 12.9285 27.7029 12.9468C27.7728 12.9651 27.8457 12.969 27.9172 12.9582C27.8439 12.9688 28.0298 12.9582 28.1478 12.9476C28.2062 12.9476 28.2668 12.9369 28.3178 12.9369H28.39C28.3996 12.9359 28.424 12.9263 28.4325 12.9263H28.4442C29.1975 12.8402 29.8424 12.6926 30.3461 12.4609C30.5979 12.3441 30.8189 12.2092 30.9984 12.0169C31.1791 11.8256 31.3172 11.5472 31.3066 11.2497C31.2896 10.8321 31.0282 10.5262 30.7328 10.3009C30.4374 10.0757 30.0698 9.8993 29.6353 9.74737C28.7672 9.44243 27.6314 9.24157 26.3819 9.19057C25.1324 9.13956 24.0083 9.24582 23.1508 9.48382C22.7216 9.60175 22.3582 9.74952 22.0628 9.96202C21.7674 10.1766 21.505 10.5145 21.5209 10.932C21.5348 11.272 21.7207 11.5462 21.9385 11.7502C21.9831 11.7906 22.0394 11.8224 22.0873 11.8617C21.8708 11.9114 21.6443 11.8924 21.4391 11.8075C21.2336 11.7234 21.0598 11.5769 20.9423 11.3885C20.8248 11.2 20.7697 10.9794 20.7846 10.7579C20.7986 10.5364 20.8818 10.3248 21.0225 10.1532C21.1632 9.98159 21.3543 9.85863 21.5688 9.80158C21.7051 9.76537 21.8216 9.67642 21.8924 9.55437C21.9632 9.43233 21.9827 9.28713 21.9465 9.15075C21.9103 9.01436 21.8214 8.89798 21.6993 8.82715C21.5773 8.75631 21.4321 8.73685 21.2957 8.77306C20.867 8.88838 20.485 9.13474 20.2032 9.47785C19.9215 9.82096 19.754 10.2437 19.7243 10.6867C19.6963 11.1294 19.8074 11.5697 20.042 11.9462C20.2767 12.3226 20.6232 12.6162 21.033 12.786C21.4428 12.9558 21.8955 12.9932 22.3276 12.893C22.7597 12.7928 23.1497 12.56 23.443 12.2272C23.8893 11.7172 24.0561 11.0372 23.9243 10.3965C24.6505 10.2727 25.3874 10.2228 26.1237 10.2477C25.7624 11.7151 25.3502 13.4746 24.9996 14.7836C24.9634 14.9188 24.9007 15.0454 24.8151 15.1561C24.7296 15.2668 24.6229 15.3595 24.5013 15.4286L9.34788 24.1783C9.28401 24.217 9.21295 24.2423 9.139 24.2527C9.06506 24.2632 8.98976 24.2586 8.91767 24.2391C8.84557 24.2196 8.77816 24.1857 8.71953 24.1395C8.66089 24.0932 8.61224 24.0356 8.57651 23.97L3.8282 15.7462C3.78934 15.6825 3.76383 15.6117 3.75324 15.5378C3.74264 15.464 3.74717 15.3887 3.76654 15.3167C3.78592 15.2446 3.81975 15.1772 3.86596 15.1186C3.91218 15.06 3.96982 15.0116 4.03538 14.976L19.1888 6.22732C19.3093 6.15633 19.4428 6.10997 19.5814 6.091C19.72 6.07203 19.8611 6.08082 19.9963 6.11681L25.942 7.82314C25.9445 7.82316 25.947 7.82316 25.9494 7.82314C26.1312 7.87035 26.2892 7.98265 26.3936 8.1387C26.4314 8.19884 26.481 8.25084 26.5393 8.29149C26.5976 8.33214 26.6634 8.36066 26.733 8.3754C26.8025 8.39014 26.8743 8.39071 26.944 8.37722C27.0138 8.36372 27.0802 8.33641 27.1392 8.2968C27.1982 8.2572 27.2487 8.2062 27.2876 8.14674C27.3265 8.08729 27.3531 8.02056 27.3658 7.95064C27.3785 7.88071 27.3771 7.80897 27.3616 7.73961C27.346 7.67026 27.3168 7.60471 27.2754 7.54688C27.027 7.17813 26.6533 6.91203 26.2236 6.79786L20.2799 5.09257C20.2775 5.09256 20.275 5.09256 20.2725 5.09257C20.1405 5.05655 20.0053 5.03368 19.8688 5.02448V5.02565ZM22.8916 10.7121C22.9056 10.8407 22.8955 10.9708 22.8618 11.0957C22.8013 11.0553 22.6982 11.0064 22.6631 10.9734C22.5707 10.8874 22.5803 10.8588 22.5813 10.8907C22.5834 10.9289 22.5526 10.9204 22.6854 10.8248C22.7322 10.7908 22.814 10.7503 22.8916 10.7121ZM13.2143 12.1104C13.197 12.1095 13.1796 12.1095 13.1623 12.1104C13.0492 12.1167 12.9411 12.1589 12.8538 12.231C12.7664 12.303 12.7044 12.4011 12.6767 12.5109L10.6622 20.0271C10.6441 20.0946 10.6394 20.1648 10.6484 20.2341C10.6575 20.3034 10.6801 20.3702 10.715 20.4307C10.7499 20.4913 10.7963 20.5443 10.8517 20.5869C10.9071 20.6295 10.9703 20.6607 11.0378 20.6788C11.1053 20.697 11.1756 20.7017 11.2449 20.6926C11.3142 20.6835 11.381 20.6609 11.4415 20.6261C11.502 20.5912 11.5551 20.5447 11.5977 20.4894C11.6402 20.434 11.6715 20.3707 11.6896 20.3032L13.702 12.7851C13.7241 12.7079 13.7284 12.6267 13.7146 12.5476C13.7007 12.4685 13.6692 12.3935 13.6222 12.3284C13.5753 12.2633 13.5142 12.2096 13.4436 12.1715C13.3729 12.1333 13.2945 12.1118 13.2143 12.1083V12.1104ZM9.19807 13.9931C8.83235 13.9732 8.47081 14.079 8.17354 14.293C7.87627 14.5069 7.66116 14.8162 7.56395 15.1693C7.45657 15.5776 7.51464 16.0117 7.72552 16.3774C7.93641 16.743 8.28307 17.0107 8.6902 17.1222C9.09843 17.2296 9.53254 17.1715 9.89821 16.9606C10.2639 16.7497 10.5316 16.403 10.6431 15.9959C10.7498 15.5874 10.6912 15.1533 10.4799 14.7878C10.2687 14.4222 9.9219 14.1546 9.5147 14.043C9.41151 14.0155 9.30576 13.9988 9.19913 13.9931H9.19807ZM9.02701 15.0556C9.09501 15.045 9.16832 15.0556 9.23951 15.0705C9.30738 15.0875 9.37115 15.1179 9.42704 15.16C9.48293 15.2021 9.5298 15.255 9.56488 15.3155C9.59996 15.376 9.62252 15.443 9.63124 15.5124C9.63996 15.5818 9.63465 15.6523 9.61563 15.7196C9.59841 15.7876 9.56774 15.8513 9.52542 15.9072C9.4831 15.9631 9.43001 16.01 9.36927 16.0449C9.30854 16.0799 9.24141 16.1023 9.17185 16.1108C9.10229 16.1194 9.03172 16.1139 8.96432 16.0947C8.89658 16.0778 8.83295 16.0473 8.77718 16.0052C8.72142 15.9632 8.67466 15.9104 8.63969 15.85C8.60471 15.7896 8.58222 15.7227 8.57356 15.6534C8.5649 15.5841 8.57024 15.5138 8.58926 15.4466C8.61471 15.3451 8.67003 15.2536 8.74808 15.1839C8.82612 15.1142 8.92329 15.0695 9.02701 15.0556ZM15.3563 15.6421C14.9901 15.6215 14.6278 15.7272 14.3301 15.9414C14.0323 16.1557 13.817 16.4656 13.7201 16.8194C13.6127 17.2278 13.6709 17.662 13.882 18.0277C14.0931 18.3933 14.4401 18.661 14.8474 18.7723C15.2556 18.8796 15.6897 18.8215 16.0554 18.6107C16.4211 18.3998 16.6887 18.0531 16.8003 17.6459C16.9079 17.2376 16.85 16.8032 16.6391 16.4373C16.4282 16.0714 16.0814 15.8035 15.674 15.692C15.5678 15.6633 15.4615 15.6495 15.3553 15.6421H15.3563ZM15.1863 16.7046C15.2543 16.694 15.3244 16.7046 15.3978 16.7195C15.4657 16.7366 15.5294 16.7672 15.5853 16.8094C15.6411 16.8516 15.6879 16.9045 15.7229 16.9652C15.7579 17.0258 15.7803 17.0929 15.7889 17.1624C15.7975 17.2319 15.792 17.3024 15.7728 17.3697C15.7558 17.4375 15.7254 17.5014 15.6833 17.5572C15.6412 17.6131 15.5883 17.6599 15.5277 17.6948C15.4671 17.7298 15.4002 17.7523 15.3307 17.7609C15.2613 17.7694 15.1909 17.764 15.1236 17.7448C15.0557 17.7279 14.9918 17.6976 14.9359 17.6555C14.8799 17.6135 14.833 17.5606 14.7979 17.5C14.7628 17.4395 14.7402 17.3724 14.7316 17.3029C14.7229 17.2334 14.7283 17.163 14.7475 17.0956C14.7732 16.9942 14.8288 16.9028 14.907 16.8333C14.9852 16.7637 15.0825 16.7182 15.1863 16.7046ZM22.6589 19.0145C22.5208 19.0204 22.3905 19.0798 22.2955 19.1802L13.9984 27.7472C13.9479 27.8022 13.8867 27.8463 13.8186 27.8769C13.7504 27.9076 13.6768 27.9242 13.6021 27.9256C13.5274 27.9269 13.4533 27.9131 13.384 27.885C13.3148 27.8569 13.252 27.8151 13.1994 27.762L11.3188 25.9399C11.2693 25.8884 11.2099 25.8474 11.1442 25.8194C11.0785 25.7913 11.0078 25.7768 10.9364 25.7767C10.8649 25.7766 10.7942 25.791 10.7284 25.8188C10.6627 25.8467 10.6032 25.8877 10.5536 25.9391C10.504 25.9905 10.4652 26.0513 10.4397 26.1181C10.4141 26.1848 10.4023 26.256 10.4049 26.3274C10.4075 26.3988 10.4245 26.4689 10.4548 26.5336C10.4852 26.5983 10.5282 26.6561 10.5814 26.7038L12.4621 28.5259C12.7731 28.8231 13.1887 28.9858 13.6188 28.9788C14.0489 28.9719 14.459 28.7959 14.7603 28.4888H14.7624L23.0594 19.9219C23.1345 19.846 23.1849 19.7492 23.2041 19.6442C23.2234 19.5392 23.2105 19.4308 23.1673 19.3332C23.1241 19.2356 23.0524 19.1533 22.9618 19.097C22.8711 19.0407 22.7655 19.0131 22.6589 19.0177V19.0145Z" fill="white"></path>
                                </svg>
                                <div className={`absolute wedge-tooltip flex flex-col items-center hidden mb-6 group-hover:flex w-56 lg:w- pl-3`}>
                                  <span
                                    style={{
                                      display: 'block',
                                      whiteSpace: 'normal',
                                    }}
                                    className="relative z-10 p-2 text-xs whitespace-no-wrap w-24 md:w-auto bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal"
                                  >
                                  <div className='text-xs'><b>Special Offer:</b> Book now until 30th Sep, 2023 to enjoy complimentary private chauffeur service.</div><div className='text-[10px]'>*Terms and conditions apply</div>  
                                  </span>
                                  <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"/>
                                </div>
                              </div>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center justify-center py-3 xl:mt-0 xs:mt-3">
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
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 justify-between text-black items-center ${
                                            item?.bliss?.information?.toLowerCase() === 'free'
                                              ? 'text-green'
                                              : 'text-black'
                                          }`}
                                        >
                                          {item?.bliss?.information}
                                          {item?.bliss?.description?.length > 0 &&
                                            item?.bliss?.description?.toLowerCase() !==
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
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 justify-between text-black items-center ${
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
                                          className={`font-extrabold text-xs w-full flex items-center gap-1 justify-between text-black items-center ${
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
                                        <div className="flex items-center justify-between">
                                          <div
                                            className={`font-extrabold text-xs w-full flex items-center gap-1 justify-between text-black items-center ${
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
                                                      width={100}
                                                      height={100}
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