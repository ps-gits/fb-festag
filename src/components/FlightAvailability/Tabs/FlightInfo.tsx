import Image from 'next/image';
import { useState } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import FlightSchedule from '../../ReviewTrip/FlightSchedule';
import { postPrepareFlights } from 'src/redux/action/SearchFlights';
import DepartReturnDateModal from '../../Modal/DepartReturnDateModal';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const FlightInfo = (props: flightDetails) => {
  const { showModal, setShowModal, setSelectFlight, setShowFlightInfo } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const passengerContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerModal?.fields
  );
  const flightAvailabilityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const selectedDetailsForFlight = useSelector(
    (state: RootState) => state?.flightDetails?.selectedFlightCodesWithDate
  );
  const searchFlightPayload = useSelector(
    (state: RootState) => state?.flightDetails?.reviewFlight?.OriginDestinations
  );
  const selectedFlight = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);

  const { adult, children, returnDate, originCode, departDate, dateFlexible, destinationCode } =
    selectedDetailsForFlight;

  const [errorMessage, setErrorMessage] = useState({
    departure: '',
    returnDate: '',
  });
  const [flightDetails, setFlightDetails] = useState({
    departDate: new Date(departDate),
    returnDate: new Date(returnDate),
    dateFlexible: dateFlexible,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <div>
      <div>
        <div className="xs:px-0 xl:px-0">
          <DepartReturnDateModal
            editDate={true}
            closeModal={() => {
              setShowModal({
                depart: false,
                return: false,
                passenger: false,
                compareFareFamily: false,
              });
              document.body.style.overflow = 'unset';
            }}
            setShowModal={setShowModal}
            errorMessage={errorMessage}
            flightDetails={flightDetails}
            setSelectFlight={setSelectFlight}
            setErrorMessage={setErrorMessage}
            setFlightDetails={setFlightDetails}
            setOldDates={() => {
              setFlightDetails({
                departDate: new Date(departDate),
                returnDate: new Date(returnDate),
                dateFlexible: dateFlexible,
              });
            }}
            returnDate={flightDetails.returnDate}
            departDate={flightDetails.departDate}
            setShowFlightInfo={setShowFlightInfo}
            dateFlexible={flightDetails?.dateFlexible}
            name={showModal?.depart ? 'Departure' : 'Return'}
            id={showModal?.depart ? 'modal-depart' : 'modal-return'}
            oneway={searchFlightPayload?.length === 1 ? true : false}
            originCode={showModal?.depart ? originCode : destinationCode}
            destinationCode={showModal?.depart ? destinationCode : originCode}
            showModal={showModal?.depart ? showModal?.depart : showModal?.return}
          />
          {selectedFlight?.details?.FaireFamilies?.length > 0 ? (
            <div>
              <div className="xl:block xs:block gap-2 xl:w-5/6 m-auto xs:w-full">
                {selectedFlight?.details?.FaireFamilies?.map(
                  (item: selectedFareFamily, index: number) => {
                    return (
                      <div className="bg-white p-4 xl:w-2/3 xs:w-full rounded-lg mb-5 " key={index}>
                        {/* // <div className="bg-white p-4  xl:w-full m-auto rounded-lg mb-5" key={index}> */}
                        <FlightSchedule
                          index={index}
                          seats={false}
                          loungeAccess={
                            selectedFlight?.name === 'Opulence' || selectedFlight?.name === 'Bliss'
                              ? true
                              : false
                          }
                          Stops={item?.Stops}
                          Remarks={item?.Remarks}
                          selectedItem={selectedItem}
                          FlightNumber={item?.FlightNumber}
                          setSelectedItem={setSelectedItem}
                          luxuryPickup={selectedFlight?.name === 'Opulence' ? true : false}
                          bagAllowances={item?.BagAllowances}
                          originAirportName={item?.originName}
                          originCode={
                            index === 0
                              ? selectedFlight?.details?.OriginCode
                              : selectedFlight?.details?.DestinationCode
                          }
                          destinationCode={
                            index === 0
                              ? selectedFlight?.details?.DestinationCode
                              : selectedFlight?.details?.OriginCode
                          }
                          departureDate={item?.orginDepartureDate}
                          departureTime={item?.orginDepartureTime}
                          arrivalDate={item?.destinationArrivalDate}
                          arrivalTime={item?.destinationArrivalTime}
                          destinationAirportName={item?.destinationName}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div> {getFieldName(flightAvailabilityContent, 'noDataFound')}</div>
          )}
        </div>
        <div className="xs:not-sr-only xl:sr-only">
          <div className="mt-6">
            <div className="bg-white p-3">
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
                    {selectedFlight?.name} {getFieldName(flightAvailabilityContent, 'xTicket')}
                    {(adult ? adult : 1) + (children ? children : 0)}
                  </p>
                  <p className="font-medium text-xs text-pearlgray">
                    {(selectedFlight?.details?.currency ? selectedFlight?.details?.currency : '') +
                      ' ' +
                      (selectedFlight?.details?.BaseAmount
                        ? selectedFlight?.details?.BaseAmount.toLocaleString('en-GB')
                        : '')}
                  </p>
                </div>
                <div className="flex justify-between py-1">
                  <p className="font-medium text-xs text-pearlgray">
                    {getFieldName(flightAvailabilityContent, 'charges')}
                  </p>
                  <p className="font-medium text-xs text-pearlgray">
                    {(selectedFlight?.details?.currency ? selectedFlight?.details?.currency : '') +
                      ' ' +
                      (selectedFlight?.details?.TaxAmount
                        ? selectedFlight?.details?.TaxAmount.toLocaleString('en-GB')
                        : '')}
                  </p>
                </div>
                <div className="flex justify-between py-1">
                  <p className="font-black text-md text-black">
                    {getFieldName(flightAvailabilityContent, 'totalPrice')}
                  </p>
                  <p className="font-black text-md text-black">
                    {(selectedFlight?.details?.currency ? selectedFlight?.details?.currency : '') +
                      ' ' +
                      (selectedFlight?.details?.TotalAmount
                        ? selectedFlight?.details?.TotalAmount.toLocaleString('en-GB')
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
                <div className="xl:flex md:flex xs:block h-full items-center justify-center  relative gap-3 py-3 w-full">
                  {/* <button
                    type="button"
                    className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12"
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
                    className={`xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center py-2 text-center w-full ${
                      selectedFlight?.display && selectedFlight?.details?.OriginCode?.length > 1
                        ? ''
                        : 'opacity-40'
                    }`}
                    disabled={
                      !selectedFlight?.display && selectedFlight?.details?.OriginCode?.length > 1
                    }
                    onClick={() => {
                      if (
                        selectedFlight?.display &&
                        selectedFlight?.details?.OriginCode?.length > 1
                      ) {
                        dispatch(
                          loader({
                            show: true,
                            name: 'exp',
                          })
                        );
                        dispatch(
                          postPrepareFlights(
                            {
                              RefItinerary: selectedFlight?.details?.RefItinerary,
                              Ref: selectedFlight?.details?.Ref,
                              FareFamily: selectedFlight?.name,
                            },
                            router
                          ) as unknown as AnyAction
                        );
                      }
                    }}
                  >
                    {getFieldName(flightAvailabilityContent, 'confirmButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightInfo;