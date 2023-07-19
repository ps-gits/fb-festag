import Image from 'next/image';
import { useState } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import DropdownModal from '../../Modal/DropdownModal';
import PassengerCount from '../../Modal/PassengerCount';
import PromoCodeModal from '../../Modal/PromoCodeModal';
import { getFieldName, getImageSrc } from '../SitecoreContent';
import { postSearchFlights } from 'src/redux/action/SearchFlights';
import DepartReturnDateModal from '../../Modal/DepartReturnDateModal';
import { setReviewFlightData } from 'src/redux/reducer/FlightDetails';

const ReturnTab = (props: tabType) => {
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
  } = props;

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const passengerContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerModal?.fields
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
    <div className="mx-3">
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
        <div>
          <div className="xl:block xl:w-2/4 xl:m-auto md:block xs:block  h-full items-center justify-center relative gap-3 w-full m-auto flexbox">
            <div className="mb-3 ">
              <div className="  bg-white px-2 xl:py-0 rounded border border-lightgray w-full">
                <div className="flex gap-3 items-center py-2">
                  <div>
                    <Image
                      src={getImageSrc(searchFlightContent, 'departFromLogo') as string}
                      className=" h-5 w-5 object-cover"
                      alt=""
                      height={8}
                      width={8}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="underline_select" className="font-medium text-sm text-black">
                      {getFieldName(searchFlightContent, 'departFrom')}
                    </label>
                    <div>
                      <DropdownModal
                        name="return"
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
                </div>
              </div>
              <p className="text-xs text-red">{errorMessage?.departure}</p>
            </div>
            <div className="mb-3 w-full  rounded border bg-white border-lightgray">
              <div className="flex items-center ml-3 xl:py-2 xs:py-2">
                <div>
                  <Image
                    src={getImageSrc(searchFlightContent, 'departDateLogo') as string}
                    className=" h-5 w-5 object-cover"
                    alt=""
                    height={8}
                    width={8}
                  />
                </div>
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
                    {getFieldName(searchFlightContent, 'departDate')}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-slategray font-normal text-lg">{getDate('depart')}</p>
                    <div className="absolute right-5 top-4 text-slategray">
                      <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                    </div>
                  </div>
                </button>
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
                  }}
                  returnFlight={true}
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
            <div className="mb-3 w-full  rounded border bg-white border-lightgra">
              <div className="w-full rounded border bg-white  border-lightgray">
                <div className="flex items-center ml-3 xl:py-2 xs:py-2">
                  <div>
                    <Image
                      src={getImageSrc(searchFlightContent, 'departDateLogo') as string}
                      className=" h-5 w-5 object-cover"
                      alt=""
                      height={8}
                      width={8}
                    />
                  </div>
                  <button
                    className="relative  px-2   font-semibold  border-0 w-full block text-black text-left"
                    type="button"
                    onClick={() => {
                      setShowModal({
                        destination: false,
                        depart: false,
                        return: true,
                        passenger: false,
                        promoCode: false,
                      });
                    }}
                  >
                    <p className="font-medium text-sm text-black">
                      {getFieldName(searchFlightContent, 'returnDate')}
                    </p>
                    <div>
                      <p className="text-slategray font-normal text-lg">{getDate('return')}</p>
                      <div className="absolute right-5 top-4 text-slategray text-sm">
                        <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
                      </div>
                    </div>
                  </button>
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
              </div>
              <p className="text-xs text-red">{errorMessage?.returnDate}</p>
            </div>

            <div className="mb-3 w-full rounded border bg-white  border-lightgray ">
              <div className="flex items-center ml-3 xl:py-2 xs:py-2">
                <div>
                  <Image
                    src={getImageSrc(searchFlightContent, 'passengersLogo') as string}
                    className=" h-5 w-5 object-cover"
                    alt=""
                    height={8}
                    width={8}
                  />
                </div>
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
                    <p className="text-slategray font-normal text-lg">
                      {`${adult} ${getFieldName(passengerContent, 'adult')} ${
                        childrens > 0
                          ? `, ${childrens} ${getFieldName(passengerContent, 'children')}`
                          : ''
                      }`}
                    </p>
                    <div className="absolute right-5 top-4 text-slategray">
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
                  }}
                  adult={adult}
                  childrens={childrens}
                  flightDetails={flightDetails}
                  setFlightDetails={setFlightDetails}
                />
              </div>
            </div>
            <div className="mb-3 w-full rounded border bg-white  border-lightgray">
              <div className="flex items-center ml-3 xl:py-2 xs:py-2">
                <div>
                  <Image
                    src={getImageSrc(searchFlightContent, 'promoCodeLogo') as string}
                    className=" h-5 w-5 object-cover"
                    alt=""
                    height={8}
                    width={8}
                  />
                </div>
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
                  <div className="absolute right-5 -top-0.5 text-black">
                    <p className="font-medium text-xs text-slategray">
                      {getFieldName(searchFlightContent, 'optional')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slategray font-normal text-lg">
                      {promoCode?.length > 0
                        ? promoCode
                        : getFieldName(searchFlightContent, 'promoCodePlaceholder')}
                    </p>
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
            <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full xl:w-full py-3 m-auto ">
              <button
                type="button"
                className={`w-full text-lg font-black xs:justify-center xs:text-center text-white bg-aqua  rounded-lg text-md inline-flex items-center px-5 py-2 text-center ${
                  (Date.parse(String(departDate)) <= Date.parse(String(returnDate)) ||
                    new Date(departDate).toDateString() ===
                      new Date(String(returnDate)).toDateString()) &&
                  originCode?.length !== 0 &&
                  destinationCode?.length !== 0
                    ? ''
                    : 'opacity-40'
                }`}
                onClick={() => {
                  if (
                    (Date.parse(String(departDate)) <= Date.parse(String(returnDate)) ||
                      new Date(departDate).toDateString() ===
                        new Date(String(returnDate)).toDateString()) &&
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
                      returnDate:
                        Date.parse(String(departDate)) <= Date.parse(String(returnDate))
                          ? ''
                          : getFieldName(searchFlightContent, 'returnDateCantBeGreater'),
                    });
                  }
                }}
              >
                {getFieldName(searchFlightContent, 'searchFlightButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnTab;
