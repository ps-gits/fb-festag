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
const LandingPageSearchBar = (props: tabType) => {
  const dispatch = useDispatch();
  const router = useRouter();

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
    openSelectModal,
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
        {
          TargetDate: returnDate as Date,
          OriginCode: destinationCode,
          DestinationCode: originCode,
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
    <div
      className="relative"
      onClick={() => {
        const selectCity = document.getElementById('select-city');
        window.onclick = function (event) {
          if (event.target === selectCity) {
            setShowModal({
              depart: false,
              return: false,
              passenger: false,
              promoCode: false,
              destination: false,
            });
            setOpenSelectModal(false);
            document.body.style.overflow = 'unset';
          }
        };
      }}
    >
      <div className="relative">
        <div>
          <div className="xl:flex md:flex xl:py-0 xs:block xl:m-auto gap-2 relative items-center">
            <div className="w-full">
              <div>
                <div className="my-row lg:mb-3">
                  <div className="col-3">
                    <div>
                      <div className="bg-white p-2 rounded border border-cadetgray w-full">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => {
                            setOpenSelectModal(true);
                            setLoading(true);
                            setSelectOptions(dropdownOptions);
                            setLoading(false);
                            document.body.style.overflow = 'hidden';
                          }}
                        >
                          <div className="w-full relative">
                            <div className="flex items-center px-6">
                              <div className="absolute left-0 m-auto">
                                <Image src={takeoff} className="h-4 w-4" alt="" />
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
                                    className={`block text-start dark:focus:ring-blue-800 whitespace-nowrap text-ellipsis block overflow-hidden ${
                                      originCode?.length > 0 ? 'text-black' : 'text-slategray'
                                    } font-normal  text-sm  w-full`}
                                  >
                                    {originCode?.length
                                      ? dropdownOptions?.find((item) => item?.code === originCode)
                                          ?.Label
                                      : getFieldName(searchFlightContent, 'departFromPlaceholder')}
                                  </div>
                                </div>
                              </div>
                              <div className="text-black text-sm absolute right-0 m-auto">
                                <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                              </div>
                            </div>
                          </div>
                        </div>
                        {openSelectModal && (
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
                            dropdownOptions={dropdownOptions}
                            setFlightDetails={setFlightDetails}
                            setSelectOptions={setSelectOptions}
                            setOpenSelectModal={setOpenSelectModal}
                            searchDataWithDelay={searchDataWithDelay}
                          />
                        )}
                      </div>
                    </div>
                    <div className="error">
                      <p className="text-xs text-red">{errorMessage?.departure}</p>
                    </div>
                  </div>
                  <div className="col-3">
                    <div
                      className={`bg-white px-2 xl:py-0 rounded border border-cadetgray w-full ${
                        flightDetails?.originCode?.length > 0
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed'
                      }`}
                    >
                      <div
                        className="flex gap-3 items-center py-2"
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
                        <div className="w-full relative">
                          <div className="flex items-center px-6">
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
                                  className={`block text-start dark:focus:ring-blue-800 whitespace-nowrap text-ellipsis block overflow-hidden ${
                                    destinationCode?.length > 0 ? 'text-black' : 'text-slategray'
                                  } font-normal text-sm w-full`}
                                >
                                  {destinationCode?.length &&
                                  dropdownOptionDestination?.find(
                                    (item) => item?.code === destinationCode
                                  )?.Label
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
                  <div className="col-3">
                    <div className="flex items-center p-2 rounded border bg-white border-cadetgray">
                      <button
                        className="relative font-semibold border-0 w-full block text-black text-sm text-left "
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
                        <div className="flex items-center px-6 w-full relative">
                          <div className="absolute left-0 m-auto">
                            <Image src={calendar} className=" h-4 w-4" alt="" />
                          </div>
                          <div className="w-full">
                            <p className="font-medium text-sm text-slategray whitespace-nowrap text-ellipsis block overflow-hidden">
                              {getFieldName(landingPageSearchContent, 'departOn')}
                            </p>
                            <p
                              className={`font-normal text-sm ${
                                getDate('depart') === 'Select Date'
                                  ? 'text-slategray'
                                  : 'text-black'
                              } whitespace-nowrap text-ellipsis block overflow-hidden`}
                            >
                              {getDate('depart')}
                            </p>
                          </div>
                          <div className="absolute right-0 m-auto text-black text-sm">
                            <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                          </div>
                        </div>
                      </button>
                      {/* origin-date-modal */}
                      <DepartReturnDateModal
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
                  <div className="col-3">
                    <div className="flex items-center p-2 rounded border bg-white border-cadetgray">
                      <button
                        className="relative font-semibold border-0 w-full block text-black text-left"
                        type="button"
                        onClick={() => {
                          setShowModal({
                            destination: false,
                            depart: false,
                            return: true,
                            passenger: false,
                            promoCode: false,
                          });
                          document.body.style.overflow = 'hidden';
                        }}
                      >
                        <div className="flex items-center relative px-6">
                          <div className="absolute left-0 m-auto">
                            <Image src={calendar} className=" h-4 w-4" alt="" />
                          </div>
                          <div className="w-full">
                            <p className="font-medium text-sm text-slategray whitespace-nowrap text-ellipsis block overflow-hidden">
                              {getFieldName(landingPageSearchContent, 'returnOn')}
                            </p>
                            <p
                              className={`font-normal text-sm ${
                                getDate('return') === 'Select Date'
                                  ? 'text-slategray'
                                  : 'text-black'
                              }  whitespace-nowrap text-ellipsis block overflow-hidden`}
                            >
                              {getDate('return')}
                            </p>
                          </div>
                          <div className="absolute right-0 m-auto text-black text-sm">
                            <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                          </div>
                        </div>
                      </button>
                      {/* arrival-date-modal */}
                      <DepartReturnDateModal
                        id="modal-return"
                        name="Return"
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
                        returnDate={returnDate}
                        departDate={departDate}
                        dateFlexible={dateFlexible}
                        setShowModal={setShowModal}
                        errorMessage={errorMessage}
                        destinationCode={originCode}
                        originCode={destinationCode}
                        showModal={showModal?.return}
                        flightDetails={flightDetails}
                        setErrorMessage={setErrorMessage}
                        setFlightDetails={setFlightDetails}
                      />
                    </div>
                    <div className="error">
                      <p className="text-xs text-red">{errorMessage?.returnDate}</p>
                    </div>
                  </div>
                </div>

                <div className="my-row">
                  <div className="col-75">
                    <div className="my-row">
                      <div className="col-6">
                        <div className="flex items-center p-2 rounded border bg-white  border-cadetgray">
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
                            <div className="flex items-center w-full px-6 relative">
                              <div className="absolute left-0 m-auto">
                                <Image src={users} className=" h-4 w-4" alt="" />
                              </div>
                              <div className="w-full">
                                <p className="font-medium text-sm text-slategray">
                                  {getFieldName(searchFlightContent, 'passengers')}
                                </p>
                                <div>
                                  <p className=" font-normal text-sm text-black">
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
                              </div>
                              <div className="absolute right-0 m-auto text-black text-sm">
                                <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                              </div>
                            </div>
                          </button>
                          <PassengerCount
                            id="modal-passenger"
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
                        <div className="flex items-center p-2 rounded border bg-white  border-cadetgray">
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
                            <div className="flex items-center w-full pr-6 relative">
                              <div className="w-full">
                                <p
                                  className={`font-medium text-sm ${
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
                              <div className="absolute right-0 m-auto text-black text-sm">
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
                    <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3  ">
                      <button
                        type="button"
                        className={`w-full text-md font-bold xs:justify-center xs:text-center text-white bg-aqua rounded-lg text-md inline-flex items-center md:py-4 xs:py-2 text-center ${
                          (Date.parse(String(departDate)) < Date.parse(String(returnDate)) ||
                            Date.parse(new Date(departDate).toDateString()) <
                              Date.parse(new Date(String(returnDate)).toDateString())) &&
                          originCode?.length !== 0 &&
                          destinationCode?.length !== 0
                            ? ''
                            : 'opacity-40'
                        }`}
                        onClick={() => {
                          if (
                            (Date.parse(String(departDate)) < Date.parse(String(returnDate)) ||
                              Date.parse(new Date(departDate).toDateString()) <
                                Date.parse(new Date(String(returnDate)).toDateString())) &&
                            originCode?.length !== 0 &&
                            destinationCode?.length !== 0
                          ) {
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
                              returnDate:
                                Date.parse(String(departDate)) < Date.parse(String(returnDate))
                                  ? ''
                                  : getFieldName(searchFlightContent, 'returnDateCantBeGreater'),
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
        </div>
      </div>
    </div>
  );
};

export default LandingPageSearchBar;