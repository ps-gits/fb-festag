import { useState } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import FlightSchedule from '../../ReviewTrip/FlightSchedule';
import { postPrepareFlights } from 'src/redux/action/SearchFlights';
import DepartReturnDateModal from '../../Modal/DepartReturnDateModal';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';

const FlightInfo = (props: flightDetails) => {
  const { showModal, setShowModal, setSelectFlight, setShowFlightInfo } = props;

  const router = useRouter();
  const dispatch = useDispatch();

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

  return (
    <div>
      <div>
        <div className="xs:px-3 xl:px-0">
          <DepartReturnDateModal
            editDate={true}
            closeModal={() => {
              setShowModal({
                depart: false,
                return: false,
                passenger: false,
                compareFareFamily: false,
              });
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
            <div className="xl:block xs:block gap-2">
              {selectedFlight?.details?.FaireFamilies?.map(
                (item: selectedFareFamily, index: number) => {
                  return (
                    <div className="bg-white p-4  xl:w-full rounded-lg " key={index}>
                      <FlightSchedule
                        index={index}
                        seats={false}
                        loungeAccess={true}
                        luxuryPickup={true}
                        bagAllowances={item.BagAllowances}
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
          ) : (
            <div> {getFieldName(flightAvailabilityContent, 'noDataFound')}</div>
          )}
        </div>
        <div className="xs:not-sr-only xl:sr-only">
          <div className="mt-6">
            <div className="bg-white p-3">
              <div className="flex justify-between my-1">
                <p className="text-slategray text-lg font-medium">
                  {getFieldName(flightAvailabilityContent, 'numberOfPassengers')}
                </p>
                <p className="font-black text-lg">{adult + children}</p>
              </div>
              <div className="flex justify-between my-1">
                <p className="text-slategray text-lg font-medium">
                  {getFieldName(flightAvailabilityContent, 'totalPrice')}
                </p>
                <p className="font-black text-lg text-black">
                  {(selectedFlight?.details?.currency ? selectedFlight?.details?.currency : '') +
                    ' ' +
                    (selectedFlight?.details?.TotalAmount
                      ? selectedFlight?.details?.TotalAmount
                      : '')}
                </p>
              </div>
              <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                <div className="flex md:flex block h-full items-center justify-center  relative gap-3 py-3 xs:w-full">
                  <button
                    type="button"
                    className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12"
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
                    className={`xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 ${
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
                            name: 'search',
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
