import moment from 'moment';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import enGb from 'date-fns/locale/en-GB';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';
import { completeFlightDetails } from 'components/FlightAvailability/Tabs/MatrixFunctions';
import { setReviewFlightData, setSelectedFlightData } from 'src/redux/reducer/FlightDetails';
import { postSearchFlights, postSearchExchangeFlights } from 'src/redux/action/SearchFlights';

registerLocale('en-gb', enGb);

const DepartReturnDateModal = (props: modalType) => {
  const {
    id,
    name,
    oneway,
    editDate,
    showModal,
    departDate,
    originCode,
    closeModal,
    returnDate,
    setOldDates,
    setShowModal,
    dateFlexible,
    errorMessage,
    flightDetails,
    modifyBooking,
    fareFamilyName,
    setSelectFlight,
    fareFamilyValue,
    setErrorMessage,
    destinationCode,
    setFlightDetails,
    setShowFlightInfo,
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const flightAvailablityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const originToDestinationDates = useSelector(
    (state: RootState) => state?.flightDetails?.originToDestinationDates
  );
  const destinationToOriginDates = useSelector(
    (state: RootState) => state?.flightDetails?.destinationToOriginDates
  );
  const modalContent = useSelector((state: RootState) => state?.sitecore?.dateModal?.fields);
  const findBookingInfo = useSelector((state: RootState) => state?.flightDetails?.findBooking);
  const searchFlightData = useSelector((state: RootState) => state?.flightDetails?.reviewFlight);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);

  const [datesInfo, setDatesInfo] = useState({
    departDate: new Date(
      (departDate as Date).setHours(0, -(departDate as Date).getTimezoneOffset(), 0, 0)
    ),
    returnDate: new Date(
      (returnDate as Date).setHours(0, -(returnDate as Date).getTimezoneOffset(), 0, 0)
    ),
    dateFlexible: dateFlexible,
  });

  useEffect(() => {
    if (
      datesInfo?.departDate !== departDate ||
      datesInfo?.returnDate !== returnDate ||
      datesInfo?.dateFlexible !== dateFlexible
    )
      setDatesInfo({
        departDate: departDate as Date,
        returnDate: returnDate as Date,
        dateFlexible: dateFlexible,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const selectedFareFamily = flightAvailablityContent?.find(
    (item: { name: string }) => item?.name === 'delight'
  );

  const includeDateOrNot = (calendarDate: Date) => {
    const allowedDates = (
      name === 'Departure' ? originToDestinationDates : destinationToOriginDates
    )?.map((item: { TargetDate: string }) => {
      return item?.TargetDate?.split('T')[0];
    });
    return allowedDates.includes(moment(calendarDate).format('YYYY-MM-DD'));
  };

  const highlightDates = () => {
    const datesToHighlight = (
      name === 'Departure' ? originToDestinationDates : destinationToOriginDates
    )?.map((item: { TargetDate: string }) => {
      return item?.TargetDate?.split('T')[0];
    });

    const datesArray = datesToHighlight
      ?.filter(
        (item: string) =>
          new Date(item).valueOf() >= new Date(new Date().toJSON().split('T')[0]).valueOf()
      )
      ?.map((item: string) => new Date(item));

    return datesArray;
  };

  const tripLength = () => {
    const count =
      Math.round(
        (new Date(datesInfo?.returnDate as Date).valueOf() -
          new Date(datesInfo?.departDate as Date).valueOf()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return count ? count : '0';
  };

  const chooseDate = () => {
    setFlightDetails({ ...flightDetails, ...datesInfo });
    if (editDate) {
      if (oneway || name === 'Return') {
        if (
          oneway ||
          Date.parse(String(datesInfo?.departDate)) <= Date.parse(String(datesInfo?.returnDate))
        ) {
          setSelectFlight &&
            setSelectFlight({
              display: false,
              name: '',
              index: 0,
              details: completeFlightDetails,
            });
          datesInfo?.dateFlexible && dispatch(setSelectedFlightData([]));
          if (modifyBooking) {
            const dataToPost = {
              DateFlexible: datesInfo?.dateFlexible as boolean,
              PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
              RefETTicketFare: modifyBookingInfo?.RefETTicketFare,
              PassangerLastname: findBookingInfo?.PassengerName,
              Passengers:
                modifyBookingInfo?.Passengers?.Children > 0
                  ? [
                      {
                        Ref: 'P1',
                        RefClient: '',
                        PassengerQuantity: modifyBookingInfo?.Passengers?.Adult as number,
                        PassengerTypeCode: 'AD',
                      },
                      {
                        Ref: 'P2',
                        RefClient: '',
                        PassengerQuantity: modifyBookingInfo?.Passengers?.Children as number,
                        PassengerTypeCode: 'CHD',
                      },
                    ]
                  : [
                      {
                        Ref: 'P1',
                        RefClient: '',
                        PassengerQuantity: modifyBookingInfo?.Passengers?.Adult as number,
                        PassengerTypeCode: 'AD',
                      },
                    ],
              OriginDestinations: modifyBookingInfo?.OriginDestination?.map(
                (
                  item: {
                    TargetDate: Date;
                    OriginCode: string;
                    DestinationCode: string;
                  },
                  index: number
                ) => {
                  return {
                    OriginCode: item?.OriginCode,
                    Extensions: null,
                    DestinationCode: item?.DestinationCode,
                    TargetDate: index === 0 ? datesInfo?.departDate : datesInfo?.returnDate,
                  };
                }
              ),
            };
            dispatch(
              loader({
                show: true,
                name: 'search',
              })
            );
            dispatch(setReviewFlightData(dataToPost));
            dispatch(
              postSearchExchangeFlights(
                dataToPost,
                router,
                datesInfo?.dateFlexible as boolean,
                fareFamilyName,
                fareFamilyValue
              ) as unknown as AnyAction
            );
          } else {
            const dataToPost = {
              DateFlexible: datesInfo?.dateFlexible as boolean,
              Passengers: searchFlightData?.Passengers,
              OriginDestinations: searchFlightData?.OriginDestinations?.map(
                (
                  item: {
                    TargetDate: Date;
                  },
                  index: number
                ) => {
                  return {
                    ...item,
                    TargetDate: index === 0 ? datesInfo?.departDate : datesInfo?.returnDate,
                  };
                }
              ),
            };
            setShowModal({
              depart: false,
              return: false,
              passenger: false,
            });
            setShowFlightInfo && setShowFlightInfo(false);
            dispatch(
              loader({
                show: true,
                name: 'search',
              })
            );
            dispatch(setReviewFlightData(dataToPost));
            dispatch(
              postSearchFlights(
                dataToPost,
                true,
                selectedFareFamily?.value,
                router
              ) as unknown as AnyAction
            );
          }
        } else {
          setErrorMessage({
            departure: '',
            returnDate: 'Return date cannot be before depart date',
          });
        }
      } else {
        setShowModal({
          depart: false,
          return: true,
          passenger: false,
        });
      }
    } else {
      closeModal();
    }
  };

  return (
    <div>
      {showModal && (
        <div
          id={id}
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
        >
          <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 calendar-modal ">
              <div className="xl:p-6 xs:pt-10 text-center calendarstyle  ">
                <FontAwesomeIcon
                  icon={faXmark}
                  className="arrow-modal cursor-pointer text-black"
                  onClick={() => {
                    closeModal();
                    if (editDate) {
                      setErrorMessage({
                        departure: '',
                        returnDate: '',
                      });
                      setOldDates && setOldDates();
                    }
                  }}
                />
                <h3 className="mb-0 text-xl text-black font-black">
                  {getFieldName(modalContent, 'heading')}
                </h3>
                <p className="text-sm text-blue opacity-50 xs:mb-2">
                  {getFieldName(modalContent, 'content')}
                </p>
                {name === 'Return' && (
                  <>
                    <p className="font-medium text-sm pearlgray">
                      {getFieldName(modalContent, 'tripLength')}
                    </p>
                    <p className="font-black text-lg text-black">
                      {Number(tripLength()) > 0
                        ? tripLength() +
                          (Number(tripLength()) === 1
                            ? ` ${getFieldName(modalContent, 'day')}`
                            : ` ${getFieldName(modalContent, 'days')}`)
                        : `0 ${getFieldName(modalContent, 'days')}`}
                    </p>
                  </>
                )}
                <div>
                  <ReactDatePicker
                    inline
                    selectsRange
                    locale="en-gb"
                    minDate={name === 'Departure' ? moment().toDate() : datesInfo?.departDate}
                    startDate={name === 'Return' ? datesInfo?.departDate : undefined}
                    filterDate={
                      (name === 'Departure'
                        ? originToDestinationDates
                        : destinationToOriginDates
                      )?.filter(
                        (item: { OriginCode: string }) =>
                          item?.OriginCode === originCode && destinationCode?.length
                      )?.length
                        ? includeDateOrNot
                        : () => false
                    }
                    endDate={name === 'Return' ? datesInfo?.returnDate : undefined}
                    highlightDates={
                      (name === 'Departure'
                        ? originToDestinationDates
                        : destinationToOriginDates
                      )?.filter(
                        (item: { OriginCode: string }) =>
                          item?.OriginCode === originCode && destinationCode?.length
                      )?.length
                        ? highlightDates()
                        : []
                    }
                    onChange={(date) => {
                      name === 'Return' &&
                        Date.parse(String(date[0] as Date)) >=
                          Date.parse(String(datesInfo?.departDate)) &&
                        errorMessage?.returnDate?.length &&
                        setErrorMessage({
                          ...errorMessage,
                          returnDate: '',
                        });
                      setDatesInfo &&
                        setDatesInfo(
                          name === 'Departure'
                            ? {
                                ...datesInfo,
                                departDate: new Date(
                                  (date[0] as Date).setHours(
                                    0,
                                    -(date[0] as Date).getTimezoneOffset(),
                                    0,
                                    0
                                  )
                                ),
                              }
                            : {
                                ...datesInfo,
                                returnDate: new Date(
                                  (date[0] as Date).setHours(
                                    0,
                                    -(date[0] as Date).getTimezoneOffset(),
                                    0,
                                    0
                                  )
                                ),
                              }
                        );
                    }}
                    selected={datesInfo?.departDate}
                    selectsEnd={name === 'Departure' ? false : true}
                    selectsStart={name === 'Departure' ? true : false}
                  />
                </div>
                <div className="my-3 pb-1 xl:w-2/4 xs:w-4/6 m-auto">
                  <div className="rounded-lg">
                    <div className="border border-Silvergray py-2 flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={datesInfo?.dateFlexible as boolean}
                          onChange={(e) => {
                            setDatesInfo({
                              ...datesInfo,
                              dateFlexible: e.target.checked,
                            });
                          }}
                        />
                        <div className="w-11 h-6 bg-graylight  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray peer-checked:bg-blue"></div>
                        <span className="ml-3 text-sm font-medium text-black">
                          {getFieldName(modalContent, 'dateFlexible')}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="xl:w-auto px-3">
                  <button
                    onClick={() => {
                      chooseDate();
                    }}
                    type="button"
                    className="xl:w-full xs:w-full xs:justify-center  text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black text-lg rounded-lg  inline-flex items-center px-5 py-2 text-center "
                  >
                    {getFieldName(modalContent, 'chooseDateButton')}
                  </button>
                </div>
                {editDate && <p className="text-xs text-red">{errorMessage?.returnDate}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartReturnDateModal;
