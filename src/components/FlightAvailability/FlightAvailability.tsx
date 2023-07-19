import Image from 'next/image';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Bliss from './Tabs/Bliss';
import Delight from './Tabs/Delight';
import Opulence from './Tabs/Opulence';
import { RootState } from 'src/redux/store';
import StepsInfo from '../SearchFlight/StepsInfo';
import { loader } from 'src/redux/reducer/Loader';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import { completeFlightDetails } from './Tabs/MatrixFunctions';
import { postPrepareFlights } from 'src/redux/action/SearchFlights';
import { setSelectedFlightData } from 'src/redux/reducer/FlightDetails';
import CompareFareFamilies from '../CompareFareFamilies/CompareFareFamilies';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const FlightAvailability = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const sitecoreFolders = ['Compare-Fare-Families', 'Passenger-Details'];

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const passengerContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerModal?.fields
  );
  const passengerDetailsContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerDetails?.fields
  );
  const flightAvailabilityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const passengerData = useSelector(
    (state: RootState) => state?.flightDetails?.selectedFlightCodesWithDate
  );
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const findBookingInfo = useSelector((state: RootState) => state?.flightDetails?.findBooking);
  const fareFamilyData = useSelector((state: RootState) => state?.flightDetails?.searchFlight);
  const selectedFlight = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);

  const { adult, children, dateFlexible } = passengerData;

  const [tabIndex, setTabIndex] = useState(0);
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
    if (passengerDetailsContent === undefined) {
      sitecoreFolders?.map((item) => {
        dispatch(getSitecoreContent(item) as unknown as AnyAction);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, passengerDetailsContent]);

  useEffect(() => {
    if (
      selectedFlight !== undefined &&
      selectedFlight?.details !== undefined &&
      Array.isArray(selectedFlight) === false
    ) {
      !modifyData && setShowFlightInfo(true);
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
  }, [dateFlexible, selectFlight, selectedFlight, flightAvailabilityContent]);

  const tabClicked = (index: number, name: string) => {
    setTabIndex(index);
    const findFareFamilyInfo = flightAvailabilityContent?.find(
      (item: { name: string }) => item.name === name
    );
    const findFlightInfo = fareFamilyData[findFareFamilyInfo?.name]?.find(
      (item: { Dtr: string; Otr: string }) =>
        item?.Dtr === selectFlight?.details?.Dtr && item?.Otr === selectFlight?.details?.Otr
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
      setSelectFlight({
        display: false,
        name: '',
        index: 0,
        details: completeFlightDetails,
      });
      setShowFlightInfo(false);
      dispatch(setSelectedFlightData([]));
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
          }
        };
      }}
    >
      {!load?.show ? (
        <div className="relative">
          <div className="xl:not-sr-only	xs:sr-only">
            <div className="xl:w-1/4 xs:w-full">
              <div>
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
                    <div className="">
                      {showFlightInfo && (
                        <div>
                          <div className="bg-white p-3 rounded-lg">
                            <div className="flex justify-between my-1">
                              <p className="text-slategray text-lg font-medium">
                                {getFieldName(flightAvailabilityContent, 'numberOfPassengers')}
                              </p>
                              <p className="font-black text-lg text-black">
                                {passengerCount?.adult + passengerCount?.children}
                              </p>
                            </div>
                            <div className="flex justify-between my-1">
                              <p className="text-slategray text-lg font-medium">
                                {getFieldName(flightAvailabilityContent, 'totalPrice')}
                              </p>
                              <p className="font-black text-lg text-black">
                                {(selectFlight?.details?.currency
                                  ? selectFlight?.details?.currency
                                  : '') +
                                  ' ' +
                                  (selectFlight?.details?.TotalAmount
                                    ? selectFlight?.details?.TotalAmount
                                    : '')}
                              </p>
                            </div>
                            <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                              <div className="flex md:flex block h-full items-center justify-center relative gap-3 py-3 xs:w-full">
                                <button
                                  type="button"
                                  className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 "
                                  onClick={() => {
                                    setShowModal({
                                      depart: true,
                                      return: false,
                                      passenger: false,
                                      compareFareFamily: false,
                                    });
                                  }}
                                >
                                  {getFieldName(flightAvailabilityContent, 'editDateButton')}
                                </button>
                                <button
                                  type="button"
                                  className="xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12"
                                  onClick={() => {
                                    dispatch(
                                      loader({
                                        show: true,
                                        name: 'search',
                                      })
                                    );
                                    dispatch(
                                      postPrepareFlights(
                                        {
                                          RefItinerary: selectFlight?.details?.RefItinerary,
                                          Ref: selectFlight?.details?.Ref,
                                          FareFamily: selectFlight?.name,
                                        },
                                        router
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
          <div className="xl:bg-cadetgray xl:h-screen  xl:rounded-none rounded-lg inherit xs:absolute  w-full   xl:w-3/4 xl:py-16 index-style ">
            <div>
              <div className="xl:not-sr-only	xs:sr-only">
                <StepsInfo selected={2} />
              </div>
            </div>
            <div className="xl:w-2/4 xl:m-auto xs:w-full xl:py-10 xl:pt-2 xs:pt-20 ">
              <div className="xs:mt-0 xs:px-3 xl:px-0">
                <div className="flex justify-between items-center xl:py-0 xs:py-2">
                  <div
                    className="xl:py-3 xs:py-2 cursor-pointer"
                    onClick={() => {
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
              </div>
              <div>
                <div className="border-gray-200 dark:border-gray-700 pt-3 xs:px-2 xl:px-0">
                  <ul
                    className="xl:flex xl:flex-wrap xs:flex gap-2 xs:w-full -mb-px text-sm  text-center font-semibold text-black justify-between "
                    id="myTab"
                    data-tabs-toggle="#myTabContent"
                    role="tablist"
                  >
                    <li
                      className=" xs:w-3/12 md:w-full bg-white xl:w-1/4 hover:bg-tabsky  rounded-lg tab-box"
                      role="presentation"
                    >
                      <button
                        className={`xl:w-full xs:w-full inline-block  p-2 border-2 
                  ${
                    tabIndex === 0
                      ? 'text-darkskyblue border-darkskyblue bg-tabsky '
                      : 'border-transparent '
                  }
                  hover:text-darkskyblue hover:border-darkskyblue  hover:bg-tabsky rounded-lg`}
                        onClick={() => {
                          tabClicked(0, 'delight');
                        }}
                      >
                        <Image
                          className="h-5 w-5 object-cover"
                          src={getImageSrc(flightAvailabilityContent, 'delightLogo')}
                          alt="delightLogo"
                          width={5}
                          height={5}
                        />
                        <div className="float-left pt-2">
                          <p className="font-normal text-xs hover:text-darkskyblue flex flex-start">
                            {getFieldName(flightAvailabilityContent, 'delightDescription')}
                          </p>
                          <p className="font-black text-base hover:text-darkskyblue flex flex-start">
                            {getFieldName(flightAvailabilityContent, 'delight')}
                          </p>
                        </div>
                      </button>
                    </li>
                    <li
                      className=" xs:w-3/12 md:w-full bg-white xl:w-1/4 hover:bg-tabsky  rounded-lg tab-box"
                      role="presentation"
                    >
                      <button
                        className={`xl:w-full xs:w-full inline-block  p-2 border-2 
                  ${
                    tabIndex === 1
                      ? 'text-darkskyblue border-darkskyblue bg-tabsky '
                      : 'border-transparent '
                  }
                  hover:text-darkskyblue hover:border-darkskyblue hover:bg-tabsky rounded-lg`}
                        onClick={() => {
                          tabClicked(1, 'bliss');
                        }}
                        type="button"
                      >
                        <Image
                          className="h-5 w-5 object-cover"
                          src={getImageSrc(flightAvailabilityContent, 'blissLogo')}
                          alt="blissLogo"
                          width={5}
                          height={5}
                        />
                        <div className="float-left pt-2 ">
                          <p className="font-normal text-xs hover:text-darkskyblue flex flex-start">
                            {getFieldName(flightAvailabilityContent, 'blissDescription')}
                          </p>
                          <p className="font-black text-base hover:text-darkskyblue flex flex-start">
                            {getFieldName(flightAvailabilityContent, 'bliss')}
                          </p>
                        </div>
                      </button>
                    </li>
                    <li
                      className="  xs:w-3/12 md:w-full bg-white xl:w-1/4 hover:bg-darkskyblue  rounded-lg tab-box"
                      role="presentation"
                    >
                      <button
                        className={`xl:w-full xs:w-full inline-block  p-2 border-2 
                  ${
                    tabIndex === 2
                      ? 'text-darkskyblue border-darkskyblue bg-tabsky '
                      : 'border-transparent '
                  }
                  hover:text-darkskyblue hover:border-darkskyblue  hover:bg-tabsky rounded-lg`}
                        onClick={() => {
                          tabClicked(2, 'opulence');
                        }}
                        type="button"
                      >
                        <Image
                          className="h-5 w-5 object-cover"
                          src={getImageSrc(flightAvailabilityContent, 'opulenceLogo')}
                          alt="opulenceLogo"
                          width={5}
                          height={5}
                        />
                        <div className="text-start pt-2 ">
                          <p className="font-normal text-xs hover:text-darkskyblue flex flex-start whitespace-nowrap">
                            {getFieldName(flightAvailabilityContent, 'opulenceDescription')}
                          </p>
                          <p className="font-black text-base hover:text-darkskyblue flex flex-start">
                            {getFieldName(flightAvailabilityContent, 'opulence')}
                          </p>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
                <h1
                  className="text-base font-black text-aqua text-center py-3 cursor-pointer"
                  onClick={() => {
                    setShowModal({
                      depart: false,
                      return: false,
                      passenger: false,
                      compareFareFamily: true,
                    });
                  }}
                >
                  {getFieldName(flightAvailabilityContent, 'compareFareFamilies')}
                </h1>
                <CompareFareFamilies
                  id="compare-fare"
                  setShowModal={setShowModal}
                  showModal={showModal?.compareFareFamily}
                />
                <div>
                  {tabIndex === 0 && (
                    <Delight
                      router={router}
                      showModal={showModal}
                      modifyData={modifyData}
                      setShowModal={setShowModal}
                      selectFlight={selectFlight}
                      passengerCount={passengerCount}
                      showFlightInfo={showFlightInfo}
                      setSelectFlight={setSelectFlight}
                      setShowFlightInfo={setShowFlightInfo}
                      setPassengerCount={setPassengerCount}
                      PassangerLastname={findBookingInfo?.PassengerName}
                      adultLabel={getFieldName(passengerContent, 'adult')}
                      PnrCode={modifyBookingInfo?.PnrInformation?.PnrCode}
                      childrenLabel={getFieldName(passengerContent, 'children')}
                      fareFamily={getFieldName(flightAvailabilityContent, 'delight')}
                      noDataFound={getFieldName(flightAvailabilityContent, 'noDataFound')}
                      notAvailable={getFieldName(flightAvailabilityContent, 'notAvailable')}
                      modifyButton={getFieldName(flightAvailabilityContent, 'modifyButton')}
                      passengerLogo={getImageSrc(flightAvailabilityContent, 'passengerLogo')}
                      confirmButton={getFieldName(flightAvailabilityContent, 'confirmButton')}
                      passengersLabel={getFieldName(flightAvailabilityContent, 'passengersLabel')}
                    />
                  )}
                  {tabIndex === 1 && (
                    <Bliss
                      router={router}
                      showModal={showModal}
                      modifyData={modifyData}
                      setShowModal={setShowModal}
                      selectFlight={selectFlight}
                      passengerCount={passengerCount}
                      showFlightInfo={showFlightInfo}
                      setSelectFlight={setSelectFlight}
                      setShowFlightInfo={setShowFlightInfo}
                      setPassengerCount={setPassengerCount}
                      PassangerLastname={findBookingInfo?.PassengerName}
                      adultLabel={getFieldName(passengerContent, 'adult')}
                      PnrCode={modifyBookingInfo?.PnrInformation?.PnrCode}
                      childrenLabel={getFieldName(passengerContent, 'children')}
                      fareFamily={getFieldName(flightAvailabilityContent, 'bliss')}
                      noDataFound={getFieldName(flightAvailabilityContent, 'noDataFound')}
                      notAvailable={getFieldName(flightAvailabilityContent, 'notAvailable')}
                      modifyButton={getFieldName(flightAvailabilityContent, 'modifyButton')}
                      passengerLogo={getImageSrc(flightAvailabilityContent, 'passengerLogo')}
                      confirmButton={getFieldName(flightAvailabilityContent, 'confirmButton')}
                      passengersLabel={getFieldName(flightAvailabilityContent, 'passengersLabel')}
                    />
                  )}
                  {tabIndex === 2 && (
                    <Opulence
                      router={router}
                      showModal={showModal}
                      modifyData={modifyData}
                      setShowModal={setShowModal}
                      selectFlight={selectFlight}
                      passengerCount={passengerCount}
                      showFlightInfo={showFlightInfo}
                      setSelectFlight={setSelectFlight}
                      setShowFlightInfo={setShowFlightInfo}
                      setPassengerCount={setPassengerCount}
                      PassangerLastname={findBookingInfo?.PassengerName}
                      adultLabel={getFieldName(passengerContent, 'adult')}
                      PnrCode={modifyBookingInfo?.PnrInformation?.PnrCode}
                      childrenLabel={getFieldName(passengerContent, 'children')}
                      fareFamily={getFieldName(flightAvailabilityContent, 'opulence')}
                      noDataFound={getFieldName(flightAvailabilityContent, 'noDataFound')}
                      notAvailable={getFieldName(flightAvailabilityContent, 'notAvailable')}
                      modifyButton={getFieldName(flightAvailabilityContent, 'modifyButton')}
                      passengerLogo={getImageSrc(flightAvailabilityContent, 'passengerLogo')}
                      confirmButton={getFieldName(flightAvailabilityContent, 'confirmButton')}
                      passengersLabel={getFieldName(flightAvailabilityContent, 'passengersLabel')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SearchFlightLoader open={load?.show} />
      )}
    </main>
  );
};

export default FlightAvailability;
