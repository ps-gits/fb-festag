import Image from 'next/image';

import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import { getFieldName } from '../SitecoreContent';
import DropdownModal from '../../Modal/DropdownModal';
import PassengerCount from '../../Modal/PassengerCount';
import PromoCodeModal from '../../Modal/PromoCodeModal';
import { postSearchFlights } from 'src/redux/action/SearchFlights';
import DepartReturnDateModal from '../../Modal/DepartReturnDateModal';
import { setReviewFlightData } from 'src/redux/reducer/FlightDetails';
import takeoff from '../../../assets/images/plane-takeoff.png';
import land from '../../../assets/images/plane-land.png';
import calendar from '../../../assets/images/calendar.png';
import users from '../../../assets/images/users.png';

const LandingPageOneWaySearchBar = (props: tabType) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    adult,
    tabName,
    getDate,
    loading,
    showModal,
    promoCode,
    childrens,
    setLoading,
    departDate,
    returnDate,
    fareFamily,
    originCode,
    dateFlexible,
    errorMessage,
    setShowModal,
    flightDetails,
    selectOptions,
    openSelectModal,
    setErrorMessage,
    dropdownOptions,
    destinationCode,
    setFlightDetails,
    setSelectOptions,
    setOpenSelectModal,
    searchDataWithDelay,
    dropdownOptionDestination,
  } = props;

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const passengerContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerModal?.fields
  );
  const landingPageSearchContent = useSelector(
    (state: RootState) => state?.sitecore?.landingPageSearch?.fields
  );

  const searchFlight = () => {
    const searchFlightData = {
      DateFlexible: dateFlexible,
      Passengers:
        childrens > 0
          ? [
              {
                Ref: 'P1',
                RefClient: '',
                PassengerQuantity: adult,
                PassengerTypeCode: 'AD',
              },
              {
                Ref: 'P2',
                RefClient: '',
                PassengerQuantity: childrens,
                PassengerTypeCode: 'CHD',
              },
            ]
          : [
              {
                Ref: 'P1',
                RefClient: '',
                PassengerQuantity: adult,
                PassengerTypeCode: 'AD',
              },
            ],
      OriginDestinations: [
        {
          TargetDate: departDate as Date,
          OriginCode: originCode,
          DestinationCode: destinationCode,
          Extensions: null,
        },
      ],
    };
    dispatch(
      loader({
        show: true,
        name: 'search',
      })
    );
    dispatch(setReviewFlightData(searchFlightData));
    dispatch(postSearchFlights(searchFlightData, true, fareFamily, router) as unknown as AnyAction);
  };

  return (
    <div className="w-full">
      <div className="my-row lg:mb-3">
        <div className="col-75">
          <div className="my-row">
            <div className="col-6">
              <div className="bg-white p-2 rounded border border-cadetgray w-full">
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    setOpenSelectModal(true);
                    setLoading(true);
                    setSelectOptions(dropdownOptions);
                    setLoading(false);
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  <div className="flex items-center px-6 relative w-full">
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
                          className={`block text-start dark:focus:ring-blue-800 whitespace-nowrap text-ellipsis block ${
                            originCode?.length > 0 ? 'text-black' : 'text-slategray'
                          } font-normal  text-sm  w-full`}
                        >
                          {originCode?.length
                            ? dropdownOptions?.find((item) => item?.code === originCode)?.Label
                            : getFieldName(searchFlightContent, 'departFromPlaceholder')}
                        </div>
                      </div>
                    </div>
                    <div className="text-black text-sm absolute right-0 m-auto">
                      <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                    </div>
                  </div>
                </div>
                {openSelectModal && (
                  <DropdownModal
                    name="oneway"
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
                    dropdownOptions={dropdownOptions}
                    setFlightDetails={setFlightDetails}
                    setSelectOptions={setSelectOptions}
                    setOpenSelectModal={setOpenSelectModal}
                    searchDataWithDelay={searchDataWithDelay}
                  />
                )}
              </div>
              <div className="error">
                <p className="text-xs text-red">{errorMessage?.departure}</p>
              </div>
            </div>
            <div className="col-6">
              <div
                className={` bg-white p-2 rounded border border-cadetgray w-full ${
                  flightDetails?.originCode?.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div
                  className="flex items-center"
                  onClick={() => {
                    if (flightDetails?.originCode?.length > 0) {
                      setShowModal({
                        destination: true,
                        depart: false,
                        return: false,
                        passenger: false,
                        promoCode: false,
                      });
                      document.body.style.overflow = 'hidden';
                      setSelectOptions(dropdownOptionDestination);
                    }
                  }}
                >
                  <div className="flex items-center px-6 relative w-full">
                    <div className="absolute left-0 m-auto">
                      <Image src={land} className=" h-4 w-4" alt="" />
                    </div>
                    <div className="w-full">
                      <div
                        className={`font-medium text-sm ${
                          destinationCode?.length > 0 ? 'text-slategray' : 'text-black'
                        }`}
                      >
                        <p>{getFieldName(landingPageSearchContent, 'destination')}</p>
                      </div>
                      <div className="flex justify-between">
                        <div
                          className={`block text-start dark:focus:ring-blue-800 whitespace-nowrap text-ellipsis block ${
                            destinationCode?.length > 0 ? 'text-black' : 'text-slategray'
                          } font-normal text-sm w-full`}
                        >
                          {destinationCode?.length
                            ? dropdownOptionDestination?.find(
                                (item) => item?.code === destinationCode
                              )?.Label
                            : getFieldName(searchFlightContent, 'departFromPlaceholder')}
                        </div>
                      </div>
                    </div>
                    <div className="text-black text-sm absolute right-0 m-auto">
                      <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                    </div>
                  </div>
                </div>
                {showModal?.destination && (
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
                      dropdownOptions={dropdownOptions}
                      setFlightDetails={setFlightDetails}
                      setSelectOptions={setSelectOptions}
                      setOpenSelectModal={setOpenSelectModal}
                      searchDataWithDelay={searchDataWithDelay}
                    />
                  </div>
                )}
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
          </div>
        </div>
        <div className="col-3">
          <div className="xs:w-full p-2 rounded border bg-white border-cadetgray">
            <div className="flex items-center">
              <button
                className="relative font-semibold border-0 w-full block text-black text-sm text-left"
                type="button"
                onClick={() => {
                  setShowModal({
                    destination: false,
                    depart: true,
                    return: false,
                    passenger: false,
                    promoCode: false,
                  });
                  document.body.style.overflow = 'hidden';
                }}
              >
                <div className="flex items-center px-6">
                  <div className="absolute left-0 m-auto">
                    <Image src={calendar} className=" h-4 w-4" alt="" />
                  </div>
                  <div className="w-full">
                    <p className="font-medium text-sm text-slategray">
                      {getFieldName(landingPageSearchContent, 'departOn')}
                    </p>
                    <p
                      className={`font-normal text-sm ${
                        getDate('depart') === 'Select Date' ? 'text-slategray' : 'text-black'
                      }`}
                    >
                      {' '}
                      {getDate('depart')}
                    </p>
                  </div>
                  <div className="text-black text-sm absolute right-0 m-auto">
                    <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                  </div>
                </div>
              </button>
              <DepartReturnDateModal
                id="modal-depart-one"
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
                dateFlexible={dateFlexible}
                setShowModal={setShowModal}
                errorMessage={errorMessage}
                showModal={showModal?.depart}
                flightDetails={flightDetails}
                destinationCode={destinationCode}
                setErrorMessage={setErrorMessage}
                setFlightDetails={setFlightDetails}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="xl:not-sr-onlyxs:sr-only">
        <div className="flex gap-3 items-center  ">
          <div className="xl:w-1/3 xl:mb-0 xs:mb-2">
            <p className="text-xs text-red">{errorMessage?.departure}</p>
          </div>
          <div className="xl:w-1/3 xl:mb-0 xs:mb-2">
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
      </div> */}
      <div className="my-row">
        <div className="col-75">
          <div className="my-row">
            <div className="col-6">
              <div className="flex items-center rounded border bg-white border-cadetgray p-2">
                <button
                  className="relative font-semibold border-0 w-full block text-black text-sm text-left"
                  type="button"
                  onClick={() => {
                    setShowModal({
                      destination: false,
                      depart: false,
                      return: false,
                      passenger: true,
                      promoCode: false,
                    });
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  <div className="flex items-center px-6">
                    <div className="absolute left-0 m-auto">
                      <Image src={users} className=" h-4 w-4" alt="" />
                    </div>
                    <div className="w-full">
                      <p className="font-medium text-sm text-slategray">
                        {getFieldName(searchFlightContent, 'passengers')}
                      </p>
                      <p className="font-normal text-sm text-black whitespace-nowrap text-ellipsis">
                        {`${adult} ${
                          adult > 1
                            ? getFieldName(passengerContent, 'adults')
                            : getFieldName(passengerContent, 'adult')
                        } ${
                          childrens > 0
                            ? `, ${childrens} ${
                                childrens > 1
                                  ? getFieldName(passengerContent, 'children')
                                  : getFieldName(passengerContent, 'child')
                              }`
                            : ''
                        }`}
                      </p>
                    </div>
                    <div className="text-black text-sm absolute right-0 m-auto">
                      <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                    </div>
                  </div>
                </button>
                <PassengerCount
                  id="modal-passenger-one"
                  name="PassengerCount"
                  showModal={showModal?.passenger}
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
                  adult={adult}
                  childrens={childrens}
                  flightDetails={flightDetails}
                  setFlightDetails={setFlightDetails}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="flex items-center p-2 rounded border bg-white border-cadetgray">
                <button
                  className="relative font-semibold border-0 w-full block text-black text-sm text-left"
                  type="button"
                  onClick={() => {
                    setShowModal({
                      destination: false,
                      depart: false,
                      return: false,
                      passenger: false,
                      promoCode: true,
                    });
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  <div className="flex items-center pr-6">
                    <div className="w-full">
                      <p
                        className={`font-medium text-sm whitespace-nowrap text-ellipsis block overflow-hidden ${
                          promoCode?.length > 0 ? 'text-slategray' : 'text-black'
                        }`}
                      >
                        {getFieldName(searchFlightContent, 'promoCode')}
                      </p>
                      <p
                        className={`${
                          promoCode?.length > 0 ? 'text-black' : 'text-slategray'
                        } font-normal text-sm`}
                      >
                        {promoCode?.length > 0
                          ? promoCode
                          : getFieldName(searchFlightContent, 'promoCodePlaceholder')}
                      </p>
                    </div>
                    <div className="text-black text-sm absolute right-0 m-auto">
                      <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                    </div>
                  </div>
                </button>
                <PromoCodeModal
                  id="modal-promo-code"
                  closeModal={() => {
                    setShowModal({
                      arrival: false,
                      depart: false,
                      return: false,
                      passenger: false,
                      promoCode: false,
                    });
                    document.body.style.overflow = 'unset';
                  }}
                  promoCode={promoCode}
                  flightDetails={flightDetails}
                  showModal={showModal?.promoCode}
                  setFlightDetails={setFlightDetails}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="xs:w-full xl:mt-0 md:mb-0 md:mt-0 xs:mt-2 xl:mb-0 xs:mb-2 bg-white">
            <div>
              <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3">
                <button
                  type="button"
                  className={`w-full text-md font-bold xs:justify-center xs:text-center text-white bg-aqua rounded-lg text-md inline-flex items-center md:py-4 xs:py-2 text-center ${
                    originCode?.length !== 0 && destinationCode?.length !== 0 ? '' : 'opacity-40'
                  }`}
                  onClick={() => {
                    if (originCode?.length !== 0 && destinationCode?.length !== 0) {
                      searchFlight();
                    } else {
                      setErrorMessage({
                        departure:
                          originCode?.length === 0
                            ? getFieldName(searchFlightContent, 'chooseDepartAirport')
                            : '',
                        arrival:
                          destinationCode?.length === 0
                            ? getFieldName(searchFlightContent, 'chooseArrivalAirport')
                            : '',
                        returnDate: '',
                      });
                    }
                  }}
                >
                  <div className="flex gap-2">
                    <p className="font-bold">
                      {getFieldName(landingPageSearchContent, 'searchButton')}
                    </p>
                    <div>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        aria-hidden="true"
                        className="text-sm text-white"
                      />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageOneWaySearchBar;
