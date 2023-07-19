import moment from 'moment';
import { AnyAction } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

import {
  setSelectedMeal,
  setChooseSeatData,
  setSelectedFlightData,
  setSelectSeatLaterData,
  setAcceptTermsConditions,
} from 'src/redux/reducer/FlightDetails';
import { RootState } from 'src/redux/store';
import { debounce } from '../Debounce/Debounce';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import { getOriginDetails } from 'src/redux/action/AirportDetails';
import { countryNames } from 'components/SearchFlight/CountryData';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';
import { setPassengerDetails } from 'src/redux/reducer/PassengerDetails';
import LandingPageSearchBar from 'components/SearchFlight/Tabs/LandingPageSearchBar';
import LandingPageOnewaySearchBar from 'components/SearchFlight/Tabs/LandingPageOnewaySearchBar';

const LandingPageSearch = () => {
  const dispatch = useDispatch();
  const sitecoreFolders = [
    'Loader',
    'Step-Info',
    'Date-Modal',
    'Common-Images',
    'Search-Flight',
    'Search-Airport',
    'Passenger-Modal',
    'Promocode-Modal',
    'LandingPage-Search',
    'Flight-Availability',
  ];

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const flightAvailablitySitecoreData = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const { originDetails } = useSelector((state: RootState) => state?.airportDetails);
  const { destinationDetails } = useSelector((state: RootState) => state?.airportDetails);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState({
    depart: false,
    return: false,
    passenger: false,
    promoCode: false,
    destination: false,
  });
  const [tabName, setTabName] = useState('return');
  const [flightDetails, setFlightDetails] = useState({
    adult: 1,
    children: 0,
    promoCode: '',
    originCode: '',
    dateFlexible: false,
    destinationCode: '',
    departDate: new Date(),
    returnDate: new Date(),
  });
  const [errorMessage, setErrorMessage] = useState({
    departure: '',
    returnDate: '',
    arrival: '',
  });
  const [selectOptions, setSelectOptions] = useState<
    {
      label: string;
      value: string;
      country: string;
      code: string;
      Label: string;
    }[]
  >([]);

  useEffect(() => {
    dispatch(setSelectedMeal([]));
    dispatch(setChooseSeatData([]));
    dispatch(setPassengerDetails([]));
    dispatch(setSelectedFlightData([]));
    dispatch(setSelectSeatLaterData(false));
    dispatch(setAcceptTermsConditions(false));
    dispatch(getOriginDetails() as unknown as AnyAction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchFlightContent === undefined) {
      sitecoreFolders?.map((item) => {
        dispatch(getSitecoreContent(item) as unknown as AnyAction);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchFlightContent]);

  const dropdownOptionOrigin = originDetails?.map(
    (item: { city: string; iata: string; country: string }) => {
      return {
        ...item,
        label: item?.city,
        value: item?.city,
        country: countryNames?.find((dt) => dt?.code === item?.country)?.name,
        code: item?.iata,
      };
    }
  );

  const dropdownOptionDestination = destinationDetails?.map(
    (item: { city: string; iata: string; country: string }) => {
      return {
        ...item,
        label: item?.city,
        value: item?.city,
        country: countryNames?.find((dt) => dt?.code === item?.country)?.name,
        code: item?.iata,
      };
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchDataWithDelay = useCallback(
    debounce((value: string) => {
      if (value?.length) {
        const filterOptions = (
          showModal?.destination ? dropdownOptionDestination : dropdownOptionOrigin
        )?.filter(
          (item: { label: string }) => item && item.label?.toLowerCase()?.includes(value)
        ) as {
          label: string;
          value: string;
          country: string;
          code: string;
          Label: string;
        }[];
        setSelectOptions(filterOptions);
      } else {
        setSelectOptions(showModal?.destination ? dropdownOptionDestination : dropdownOptionOrigin);
      }
      setLoading(false);
    }, 1000),
    []
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

  const selectedFareFamily = flightAvailablitySitecoreData?.find(
    (item: { name: string }) => item?.name === 'delight'
  );

  return (
    <>
      {!load?.show ? (
        <main
          className="mx-0"
          id="landing-page-search"
          onClick={() => {
            const modalPassengerOne = document.getElementById('modal-passenger-one');
            const modalDepart = document.getElementById('modal-depart');
            const modalReturn = document.getElementById('modal-return');
            const modalPassenger = document.getElementById('modal-passenger');
            const modalDepartOne = document.getElementById('modal-depart-one');
            const modalPromoCode = document.getElementById('modal-promo-code');

            window.onclick = function (event) {
              if (
                event.target === modalDepart ||
                event.target === modalReturn ||
                event.target === modalPassenger ||
                event.target === modalDepartOne ||
                event.target === modalPromoCode ||
                event.target === modalPassengerOne
              ) {
                setShowModal({
                  depart: false,
                  return: false,
                  passenger: false,
                  promoCode: false,
                  destination: false,
                });
              }
            };
          }}
        >
          <div>
            <div className=" xl:w-5/6 xl:m-auto  xs:bg-white">
              <div className="relative">
                <div className="xl:px-0 xs:px-3">
                  <div className="xl:w-full md:w-5/6 md:m-auto bg-white rounded-xl xl:absolute xl:-top-24 xs:relative xs:-top-8 shadow-md ">
                    <div className="xl:w-1/4 xl:px-3.5 xl:py-2 xs:py-0 ">
                      <div>
                        <ul className="py-4 flex xs:justify-between flex-wrap text-sm font-medium   text-black xs:px-2 xs:py-3 xl:px-0 xl:py-0 ">
                          <li className="lg:w-2/4  xs:w-1/2 button-style">
                            <button
                              className={`xl:w-full xs:w-full  inline-block px-2 py-1 font-medium text-md rounded xl:border-cadetgray border' ${
                                tabName === 'return'
                                  ? ' text-white bg-aqua rounded border-aqua border-2  '
                                  : ' text-pearlgray border-2 bg-white xs:border-cadetgray xl:border-white'
                              } rounded   font-medium text-md`}
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
                              <div className="flex items-center justify-center gap-2">
                                <div>
                                  <FontAwesomeIcon
                                    icon={faArrowsRotate}
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                </div>
                                <p className="font-medium text-sm">
                                  {getFieldName(searchFlightContent, 'return')}
                                </p>
                              </div>
                            </button>
                          </li>
                          <li className="xl:w-2/4 xs:w-1/2 button-style">
                            <button
                              className={`xl:w-full xs:w-full  inline-block px-2 py-1 font-medium text-md rounded xl:border-cadetgray border  ${
                                tabName === 'oneway'
                                  ? 'text-white bg-aqua rounded border-aqua border'
                                  : 'text-pearlgray border-2 bg-white xs:border-cadetgray xl:border-cadetgray'
                              } rounded  hover:blue  font-medium text-md`}
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
                              <div className="flex items-center justify-center gap-2">
                                <div>
                                  <FontAwesomeIcon
                                    icon={faArrowRight}
                                    aria-hidden="true"
                                    className="h-4 w-4 "
                                  />
                                </div>
                                <p className="font-medium text-sm">
                                  {getFieldName(searchFlightContent, 'oneway')}
                                </p>
                              </div>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
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
                          searchDataWithDelay={searchDataWithDelay}
                          dateFlexible={flightDetails?.dateFlexible}
                          destinationCode={flightDetails?.destinationCode}
                          dropdownOptionDestination={dropdownOptionDestination}
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
      ) : (
        <SearchFlightLoader open={load?.show} />
      )}
    </>
  );
};

export default LandingPageSearch;
