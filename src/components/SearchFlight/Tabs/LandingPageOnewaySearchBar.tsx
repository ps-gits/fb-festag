import Image from 'next/image';
import { useState } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import DropdownModal from '../../Modal/DropdownModal';
import PassengerCount from '../../Modal/PassengerCount';
import PromoCodeModal from '../../Modal/PromoCodeModal';
import { getFieldName, getImageSrc } from '../SitecoreContent';
import { postSearchFlights } from 'src/redux/action/SearchFlights';
import DepartReturnDateModal from '../../Modal/DepartReturnDateModal';
import { setReviewFlightData } from 'src/redux/reducer/FlightDetails';

const LandingPageOneWaySearchBar = (props: tabType) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [openSelectModal, setOpenSelectModal] = useState(false);

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
    setErrorMessage,
    dropdownOptions,
    destinationCode,
    setFlightDetails,
    setSelectOptions,
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
    <div className="relative">
      <div>
        <div className="xl:flex md:flex  xs:block  xl:m-auto gap-2 relative items-center px-4 pb-2  ">
          <div className="w-full">
            <div>
              <div className="xl:flex md:flex xs:block w-full gap-2">
                <div className="xl:w-1/3 xs:w-full xl:mb-0 xs:mb-2 md:mb-0">
                  <div>
                    <div className=" bg-white px-2 xl:py-0 xs:pyu-2 rounded border border-cadetgray w-full ">
                      <div className="flex gap-3 items-center py-2 ">
                        <div className="w-full">
                          <label
                            htmlFor="underline_select"
                            className="font-medium text-sm text-black"
                          >
                            <p>{getFieldName(landingPageSearchContent, 'from')}</p>
                          </label>
                          <div>
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
                          </div>
                        </div>
                        <div>
                          <Image
                            className="h-5 w-5 object-cover"
                            src={getImageSrc(landingPageSearchContent, 'locateIcon')}
                            alt=""
                            height={5}
                            width={5}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="	xl:sr-only xs:not-sr-only">
                      <p className="text-xs text-red">{errorMessage?.departure}</p>
                    </div>
                  </div>
                </div>
                <div className="xl:w-1/3 xs:w-full xl:mb-0 xs:mb-2 md:mb-0">
                  <div
                    className={` bg-white px-2 xl:py-0 rounded border border-cadetgray w-full ${
                      flightDetails?.originCode?.length > 0 ? '' : 'cursor-not-allowed'
                    }`}
                  >
                    <div className="flex gap-3 items-center py-2">
                      <div className="w-full">
                        <label
                          htmlFor="underline_select"
                          className="font-medium text-sm text-black"
                        >
                          <p>{getFieldName(landingPageSearchContent, 'destination')}</p>
                        </label>
                        <div className="flex justify-between">
                          <button
                            className={`block text-start dark:focus:ring-blue-800 text-slategray font-normal ${'text-sm'} ${
                              flightDetails?.originCode?.length > 0 ? '' : 'cursor-not-allowed'
                            } w-full`}
                            type="button"
                            onClick={() => {
                              if (flightDetails?.originCode?.length > 0) {
                                setShowModal({
                                  destination: true,
                                  depart: false,
                                  return: false,
                                  passenger: false,
                                  promoCode: false,
                                });
                                setSelectOptions(dropdownOptionDestination);
                              }
                            }}
                          >
                            {destinationCode?.length
                              ? dropdownOptionDestination?.find(
                                  (item) => item?.code === destinationCode
                                )?.Label
                              : getFieldName(searchFlightContent, 'departFromPlaceholder')}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Image
                          className="h-5 w-5 object-cover"
                          src={getImageSrc(landingPageSearchContent, 'locateIcon')}
                          alt=""
                          height={5}
                          width={5}
                        />
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
                <div className="xl:w-1/3 xs:w-full  rounded border bg-white  border-cadetgray  ">
                  <div className="flex items-center xl:py-2 xs:py-2">
                    <button
                      className="relative  px-2  font-semibold  border-0 w-full block text-black  text-sm  text-left"
                      type="button"
                      onClick={() => {
                        setShowModal({
                          destination: false,
                          depart: false,
                          return: false,
                          passenger: true,
                          promoCode: false,
                        });
                      }}
                    >
                      <p className="font-medium text-sm text-black">
                        {getFieldName(searchFlightContent, 'passengers')}
                      </p>

                      <div>
                        <p className="text-slategray font-normal text-sm">
                          {`${adult} ${getFieldName(passengerContent, 'adult')} ${
                            childrens > 0
                              ? `, ${childrens} ${getFieldName(passengerContent, 'children')}`
                              : ''
                          }`}
                        </p>
                        <div className="absolute right-1 top-4 text-slategray">
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
                      }}
                      adult={adult}
                      childrens={childrens}
                      flightDetails={flightDetails}
                      setFlightDetails={setFlightDetails}
                    />
                  </div>
                </div>
              </div>
              <div className="xl:not-sr-only	xs:sr-only">
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
              </div>
              <div className="xl:flex md:flex xs:block w-full gap-2 pt-2 search-field">
                <div className="xl:w-1/3 md:w-1/3 xs:w-full rounded border bg-white border-cadetgray">
                  <div className="flex items-center xl:py-2 xs:py-2">
                    <button
                      className="relative  px-2 font-semibold  border-0 w-full block text-black  text-sm  text-left "
                      type="button"
                      onClick={() => {
                        setShowModal({
                          destination: false,
                          depart: true,
                          return: false,
                          passenger: false,
                          promoCode: false,
                        });
                      }}
                    >
                      <p className="font-medium text-sm text-black">
                        {getFieldName(landingPageSearchContent, 'departOn')}
                      </p>
                      <div className="flex justify-between">
                        <p className="text-slategray font-normal text-sm">{getDate('depart')}</p>
                        <div className="absolute right-1 top-4 text-slategray">
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
                <div className="xl:w-1/3 md:w-1/3 xs:w-full xl:mt-0 md:mb-0 md:mt-0 xs:mt-2 xl:mb-0 xs:mb-2 rounded border bg-white  border-cadetgray">
                  <div className="flex items-center xl:py-2 xs:py-2">
                    <button
                      className="relative  px-2   font-semibold  border-0 w-full block text-black  text-sm  text-left"
                      type="button"
                      onClick={() => {
                        setShowModal({
                          destination: false,
                          depart: false,
                          return: false,
                          passenger: false,
                          promoCode: true,
                        });
                      }}
                    >
                      <p className="font-medium text-sm text-black">
                        {getFieldName(searchFlightContent, 'promoCode')}
                      </p>
                      <div>
                        <p className="text-slategray font-normal text-sm">
                          {promoCode?.length > 0
                            ? promoCode
                            : getFieldName(searchFlightContent, 'promoCodePlaceholder')}
                        </p>
                        <div className="absolute right-1 top-4 text-slategray">
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
          </div>
          <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3  ">
            <button
              type="button"
              className={`w-full text-md font-black xs:justify-center xs:text-center text-white bg-aqua  rounded-lg text-md inline-flex items-center px-4 py-2 text-center ${
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
                <p>{getFieldName(landingPageSearchContent, 'searchButton')}</p>
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
  );
};

export default LandingPageOneWaySearchBar;
