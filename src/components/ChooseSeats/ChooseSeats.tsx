import Image from 'next/image';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  postCreateBooking,
  postModifyBookingSeats,
  postExchangeCreateBooking,
} from 'src/redux/action/SearchFlights';
import { RootState } from 'src/redux/store';
import StepsInfo from '../SearchFlight/StepsInfo';
import { loader } from 'src/redux/reducer/Loader';
import SearchSeatLoader from '../Loader/SearchSeat';
import SavingDataLoader from '../Loader/SavingData';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import { calculateDob } from '../PassengerDetails/CalculateDob';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';
import { setChooseSeatData, setSelectSeatLaterData } from 'src/redux/reducer/FlightDetails';

const ChooseSeats = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const modifySeat = useSelector((state: RootState) => state?.flightDetails?.modifySeat);
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const prepareFlightDetails = useSelector((state: RootState) =>
    modifySeat
      ? state?.flightDetails?.prepareBookingModification
      : !modifyData
      ? state?.flightDetails?.prepareFlight
      : state?.flightDetails?.prepareExchangeFlight
  );
  const seatMaps = useSelector((state: RootState) =>
    modifySeat
      ? state?.flightDetails?.prepareBookingModification?.SeatMaps
      : !modifyData
      ? state?.flightDetails?.prepareFlight?.SeatMaps
      : state?.flightDetails?.prepareExchangeFlight?.SeatMaps
  );
  const flightWay = useSelector((state: RootState) =>
    modifySeat
      ? state?.flightDetails?.modifyBooking?.OriginDestination
      : !modifyData
      ? state?.flightDetails?.reviewFlight?.OriginDestinations
      : state?.flightDetails?.modifyBooking?.OriginDestination
  );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const prepareFlightDetailsRef = useSelector(
    (state: RootState) => state?.flightDetails?.prepareFlightRef
  );
  const passengerDetailsContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerDetails?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const passengerDetails = useSelector((state: RootState) =>
    modifySeat
      ? state?.flightDetails?.prepareBookingModification?.Passengers?.map(
          (item: { NameElement: { Firstname: string; Surname: string } }) => {
            return {
              ...item?.NameElement,
            };
          }
        )
      : !modifyData
      ? state?.passenger?.passengersData?.details
      : state?.flightDetails?.prepareExchangeFlight?.Passengers?.map(
          (item: { NameElement: { Firstname: string; Surname: string } }) => {
            return {
              ...item?.NameElement,
            };
          }
        )
  );
  const choosenSeats = useSelector((state: RootState) => state?.flightDetails?.chooseSeats);
  const selectedFlight = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);
  const reviewTripContent = useSelector((state: RootState) => state?.sitecore?.reviewTrip?.fields);
  const chooseSeatsContent = useSelector((state: RootState) => state?.sitecore?.chooseSeat?.fields);

  const allSeats = modifyBookingInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields?.filter((item: { Code: string }) => item?.Code === 'SEAT')?.map((item) => item)
  );
  const seatDataWithPassengerInfo = (allSeats && allSeats?.length > 0 ? allSeats[0] : [])?.map(
    (item: { Data: { Seat: { SeatRow: number; SeatLetter: string } } }, index: number) => {
      const seatRows = seatMaps
        ?.find(
          (seatItem: object, seatIndex: number) =>
            seatItem !== undefined &&
            seatIndex === (flightWay && flightWay?.length === 1 ? 0 : index % 2)
        )
        ?.Decks?.map((item: { Areas: { Rows: { RowNumber: number }[] }[] }) =>
          item?.Areas?.find((item1) => item1?.Rows)
        )
        ?.find((item2: object) => item2 !== undefined)?.Rows;

      const seatInfo = seatRows
        ?.find(
          (seatRowItem: { RowNumber: number }) =>
            seatRowItem?.RowNumber === item?.Data?.Seat?.SeatRow
        )
        ?.Columns?.find((seatRowItem1: { Seats: { Letter: string }[] }) =>
          seatRowItem1?.Seats?.find(
            (seatRowItem2: { Letter: string }) =>
              seatRowItem2?.Letter === item?.Data?.Seat?.SeatLetter
          )
        )
        ?.Seats?.find(
          (seatRowItem3: { Letter: string }) =>
            seatRowItem3?.Letter === item?.Data?.Seat?.SeatLetter
        );

      if (flightWay && flightWay?.length === 1) {
        const passengerInfo = passengerDetails?.find(
          (passengerItem: { Surname: string; Firstname: string }, passengerIndex: number) =>
            passengerItem !== undefined && passengerIndex === index
        );
        return {
          ...item,
          Firstname: passengerInfo?.Firstname,
          Surname: passengerInfo?.Surname,
          mapIndex: 0,
          price: '500',
          seatNumber: item?.Data?.Seat?.SeatLetter,
          passengerIndex: index,
          rowNumber: item?.Data?.Seat?.SeatRow,
          AircraftName: seatMaps[0]?.AircraftName,
          RefSegment: seatMaps[0]?.RefSegment,
        };
      } else if (flightWay && flightWay?.length > 1) {
        const passengerInfo = passengerDetails?.find(
          (passengerItem: { Surname: string; Firstname: string }, passengerIndex: number) =>
            passengerItem !== undefined && passengerIndex === Math.floor(index / 2)
        );

        return {
          ...item,
          ...seatInfo,
          Firstname: passengerInfo?.Firstname,
          Surname: passengerInfo?.Surname,
          mapIndex: index % 2,
          price: '500',
          seatNumber: item?.Data?.Seat?.SeatLetter,
          passengerIndex: Math.floor(index / 2),
          rowNumber: item?.Data?.Seat?.SeatRow,
          AircraftName: seatMaps && seatMaps?.length ? seatMaps[index % 2]?.AircraftName : '',
          RefSegment: seatMaps && seatMaps?.length ? seatMaps[index % 2]?.RefSegment : '',
        };
      }
    }
  );

  const [mapIndex, setMapIndex] = useState(0);
  const [selectSeat, setSelectSeat] = useState<seatDetails[]>(
    modifySeat
      ? seatDataWithPassengerInfo && seatDataWithPassengerInfo?.length > 0
        ? seatDataWithPassengerInfo
        : []
      : choosenSeats?.length > 0
      ? choosenSeats
      : []
  );
  const [selectedPerson, setSelectedPerson] = useState({
    Firstname: passengerDetails !== undefined ? passengerDetails[0].Firstname : '',
    Surname: passengerDetails !== undefined ? passengerDetails[0].Surname : '',
    mapIndex: 0,
    passengerIndex: 0,
  });

  useEffect(() => {
    if (reviewTripContent === undefined) {
      dispatch(getSitecoreContent('Payment') as unknown as AnyAction);
      dispatch(getSitecoreContent('Review-Trip') as unknown as AnyAction);
      dispatch(getSitecoreContent('Terms-Conditions') as unknown as AnyAction);
    }
  }, [dispatch, reviewTripContent]);

  const findCodeInModifySeat = (indexNumber: number, codeType: string) => {
    return flightWay?.find(
      (item: object, index: number) => item !== undefined && index === indexNumber
    )[codeType];
  };

  const onSeatSelect = (
    mapIndex: number,
    rowNumber: number,
    seatLetter: string,
    seatAvailable: boolean,
    seatInfo: flightSeat,
    AircraftName: string,
    RefSegment: string
  ) => {
    const seatAlreadySelected = selectSeat?.find(
      (dt) =>
        dt?.mapIndex === mapIndex && dt?.seatNumber === seatLetter && dt?.rowNumber === rowNumber
    );
    if (seatAvailable && seatAvailable !== undefined && seatAlreadySelected === undefined) {
      const findAlreadySelected = selectSeat?.find(
        (item) =>
          item.Firstname === selectedPerson?.Firstname &&
          item.Surname === selectedPerson?.Surname &&
          item?.mapIndex === selectedPerson?.mapIndex &&
          item?.passengerIndex === selectedPerson?.passengerIndex
      );
      findAlreadySelected
        ? setSelectSeat([
            ...selectSeat?.filter((item) => item !== findAlreadySelected),
            {
              ...seatInfo,
              Firstname: selectedPerson?.Firstname,
              Surname: selectedPerson?.Surname,
              mapIndex: selectedPerson?.mapIndex,
              passengerIndex: selectedPerson?.passengerIndex,
              price: 500,
              seatNumber: seatLetter,
              rowNumber: rowNumber,
              AircraftName: AircraftName,
              RefSegment: RefSegment,
            },
          ])
        : setSelectSeat((prev) => [
            ...prev,
            {
              ...seatInfo,
              Firstname: selectedPerson?.Firstname,
              Surname: selectedPerson?.Surname,
              mapIndex: selectedPerson?.mapIndex,
              passengerIndex: selectedPerson?.passengerIndex,
              price: 500,
              seatNumber: seatLetter,
              rowNumber: rowNumber,
              AircraftName: AircraftName,
              RefSegment: RefSegment,
            },
          ]);
    }
  };

  const findSelectedSeat = (mapIndex: number, rowNumber: number, seatLetter: string) => {
    const findData = selectSeat?.find(
      (dt) =>
        dt?.rowNumber === rowNumber && dt?.seatNumber === seatLetter && dt?.mapIndex === mapIndex
    );
    return findData;
  };

  const findPassengerSelectedSeat = (
    firstName: string,
    surName: string,
    passengerIndex: number,
    mapIndex: number
  ) => {
    const findData = selectSeat?.find(
      (dt) =>
        dt?.Firstname === firstName &&
        dt?.Surname === surName &&
        dt?.passengerIndex === passengerIndex &&
        dt?.mapIndex === mapIndex
    );
    return findData;
  };

  const nextButtonClick = (mapIndex: number) => {
    if (
      mapIndex + 1 < seatMaps?.slice(0, flightWay ? flightWay?.length : seatMaps?.length)?.length &&
      selectedPerson?.passengerIndex + 1 === passengerDetails?.length
    ) {
      setMapIndex(mapIndex + 1);
      setSelectedPerson({
        Firstname: passengerDetails[0]?.Firstname,
        Surname: passengerDetails[0]?.Surname,
        passengerIndex: 0,
        mapIndex: mapIndex + 1,
      });
    } else if (selectedPerson?.passengerIndex + 1 < passengerDetails?.length) {
      const findPassenger = passengerDetails?.find(
        (dt: undefined, index: number) =>
          index === selectedPerson?.passengerIndex + 1 && dt !== undefined
      );
      setSelectedPerson({
        Firstname: findPassenger?.Firstname as string,
        Surname: findPassenger?.Surname as string,
        mapIndex: mapIndex,
        passengerIndex: selectedPerson?.passengerIndex + 1,
      });
    } else if (
      mapIndex + 1 ===
        seatMaps?.slice(0, flightWay ? flightWay?.length : seatMaps?.length)?.length &&
      selectSeat?.length ===
        seatMaps?.slice(0, flightWay ? flightWay?.length : seatMaps?.length)?.length *
          passengerDetails?.length
    ) {
      createBooking('finalSubmit');
    }
  };

  const createBooking = (type: string) => {
    const seatData = selectSeat?.map((item) => {
      const finalData = JSON.parse(JSON.stringify({ ...item, RowNumber: item?.rowNumber }));
      delete finalData?.mapIndex;
      delete finalData?.passengerIndex;
      delete finalData?.price;
      delete finalData?.rowNumber;
      delete finalData?.seatNumber;
      return finalData;
    });
    const ticketFareOptions = seatData
      ?.map((item) => {
        const findData = prepareFlightDetails?.EMDTicketFareOptions?.find(
          (dt: { AncillaryCode: string }) => dt?.AncillaryCode === item?.AssociatedAncillaryCode
        );
        return findData;
      })
      ?.filter(
        (item, index, arr) =>
          item !== undefined &&
          index === arr.findIndex((dt) => dt.AncillaryCode === item?.AncillaryCode)
      );
    const dataToPost = passengerDetails?.map(
      (
        item: {
          Dob: string;
          Email: string;
          Mobile: string;
          Surname: string;
          Firstname: string;
          flagMobile: string;
          validMobile: string;
          Homecontact: string;
          dialCodeMobile: string;
          flagHomeContact: string;
          validHomeContact: string;
          dialCodeHomeContact: string;
        },
        index: number
      ) => {
        const postData = JSON.parse(JSON.stringify(item));
        if (Object.keys(item).includes('Mobile')) {
          postData['Mobile'] = item['dialCodeMobile'] + item['Mobile'];
        }
        if (Object.keys(item).includes('Homecontact')) {
          postData['Homecontact'] = item['dialCodeHomeContact'] + item['Homecontact'];
        }
        delete postData?.flagMobile;
        delete postData?.validMobile;
        delete postData?.dialCodeMobile;
        delete postData?.flagHomeContact;
        delete postData?.validHomeContact;
        delete postData?.dialCodeHomeContact;
        return {
          PassengerDetails: {
            ...postData,
            Surname: item?.Surname,
            Firstname: item?.Firstname,
            Ref: prepareFlightDetails?.Passengers[index]?.Ref,
            PassengerType: calculateDob(item?.Dob) > 11 ? 'AD' : 'CHD',
          },
          SpecialServices:
            calculateDob(item?.Dob) > 11
              ? {
                  CTCE: item.Email,
                  CTCH: '57623799',
                  CTCM: '34421043',
                  DOCS: '',
                  EXTADOB: item?.Dob,
                }
              : {
                  CTCE: item.Email,
                  CTCH: '57623799',
                  CTCM: '34421043',
                  DOCS: '',
                  CHLD: item?.Dob,
                },
          Documents: [
            {
              NationalityCountryCode: 'FR',
              DateOfBirth: item.Dob,
              Gender: 'F',
              Firstname: item.Firstname,
              Surname: item.Surname,
            },
          ],
        };
      }
    );
    dispatch(
      loader({
        name: 'save',
        show: true,
      })
    );
    dispatch(setChooseSeatData(selectSeat));
    if (type === 'finalSubmit') {
      dispatch(setSelectSeatLaterData(false));
    } else {
      dispatch(setSelectSeatLaterData(true));
    }
    if (modifySeat) {
      dispatch(
        postModifyBookingSeats(
          {
            booking: dataToPost,
            PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
            PassengerName: passengerDetails !== undefined ? passengerDetails[0].Surname : '',
            SeatMap: {
              departure:
                type === 'finalSubmit'
                  ? seatData?.slice(0, passengerDetails?.length)?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                  : [],
              arrival:
                type === 'finalSubmit'
                  ? seatData
                      ?.slice(passengerDetails?.length, seatData?.length)
                      ?.map((item, index) => {
                        return {
                          ...item,
                          RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                        };
                      })
                  : [],
            },
            EMDTicketFareOptions: type === 'finalSubmit' ? ticketFareOptions : [],
          },
          router,
          prepareFlightDetails?.cpd_code
        ) as unknown as AnyAction
      );
    } else if (modifyData) {
      dispatch(
        postExchangeCreateBooking(
          {
            booking: dataToPost,
            Ref: prepareFlightDetailsRef?.Ref,
            RefItinerary: prepareFlightDetailsRef?.RefItinerary,
            PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
            RefETTicketFare: modifyBookingInfo?.RefETTicketFare,
            PassangerLastname: passengerDetails !== undefined ? passengerDetails[0].Surname : '',
            SeatMap: {
              departure:
                type === 'finalSubmit'
                  ? seatData?.slice(0, passengerDetails?.length)?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                  : [],
              arrival:
                type === 'finalSubmit'
                  ? seatData
                      ?.slice(passengerDetails?.length, seatData?.length)
                      ?.map((item, index) => {
                        return {
                          ...item,
                          RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                        };
                      })
                  : [],
            },
            EMDTicketFareOptions: type === 'finalSubmit' ? ticketFareOptions : [],
          },
          router,
          selectedFlight?.details?.cpd_code
        ) as unknown as AnyAction
      );
    } else {
      dispatch(
        postCreateBooking(
          {
            booking: dataToPost,
            Ref: prepareFlightDetailsRef?.Ref,
            RefItinerary: prepareFlightDetailsRef?.RefItinerary,
            SeatMap: {
              departure:
                type === 'finalSubmit'
                  ? seatData?.slice(0, passengerDetails?.length)?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                  : [],
              arrival:
                type === 'finalSubmit'
                  ? seatData
                      ?.slice(passengerDetails?.length, seatData?.length)
                      ?.map((item, index) => {
                        return {
                          ...item,
                          RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                        };
                      })
                  : [],
            },
            EMDTicketFareOptions: type === 'finalSubmit' ? ticketFareOptions : [],
          },
          router,
          selectedFlight?.details?.cpd_code
        ) as unknown as AnyAction
      );
    }
  };

  return (
    <main>
      {!load?.show ? (
        <div className="relative">
          <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-16 ">
            <div>
              <div className="xl:not-sr-only	xs:sr-only">
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
                  <div className="absolute top-16 right-3.5  xl:m-auto price-modal"></div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="xl:not-sr-only	xs:sr-only">
                    <div className="mt-6">
                      <StepsInfo selected={2} />
                    </div>
                  </div>
                  {seatMaps?.slice(0, flightWay ? flightWay?.length : seatMaps?.length)?.map(
                    (
                      item: {
                        Decks: {
                          Areas: {
                            Rows: {
                              Columns: {
                                Seats: flightSeat[];
                              }[];
                              RowNumber: number;
                            }[];
                          }[];
                        }[];
                        AircraftName: string;
                        RefSegment: string;
                      },
                      index: number
                    ) => {
                      return (
                        <Fragment key={index}>
                          {mapIndex === index && (
                            <div className="xl:w-2/4 xl:m-auto xl:py-2 xs:pt-20">
                              <div>
                                <div className="flex justify-between items-center xl:py-0 xs:py-2">
                                  <div
                                    className="xl:py-3 xs:py-3 cursor-pointer"
                                    onClick={() => {
                                      if (mapIndex > 0) {
                                        setMapIndex(mapIndex - 1);
                                        setSelectedPerson({
                                          Firstname: passengerDetails[0]?.Firstname,
                                          Surname: passengerDetails[0]?.Surname,
                                          passengerIndex: 0,
                                          mapIndex: mapIndex - 1,
                                        });
                                      } else {
                                        modifyData || modifySeat
                                          ? router.back()
                                          : router.push('/passengerdetails');
                                        (modifyData || modifySeat) &&
                                          dispatch(setSelectSeatLaterData(false));
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faAngleLeft}
                                      aria-hidden="true"
                                      className="text-black text-sm font-black h-4 w-4"
                                    />
                                    <span className="px-2 text-black text-sm font-black">
                                      {getFieldName(chooseSeatsContent, 'backButton')}
                                    </span>
                                  </div>
                                  <div
                                    onClick={() => createBooking('selectSeatLater')}
                                    className="cursor-pointer"
                                  >
                                    <p className="text-pearlgray text-base font-medium">
                                      {getFieldName(chooseSeatsContent, 'selectSeatLater')}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <div>
                                    <p className="text-pearlgray font-medium text-sm">
                                      {index === 0
                                        ? getFieldName(chooseSeatsContent, 'outbound')
                                        : getFieldName(chooseSeatsContent, 'return')}
                                    </p>
                                    <h1 className="text-2xl font-black  text-black">
                                      {index === 0
                                        ? modifySeat
                                          ? (findCodeInModifySeat(0, 'OriginCode')
                                              ? findCodeInModifySeat(0, 'OriginCode')
                                              : '') +
                                            ' - ' +
                                            (findCodeInModifySeat(0, 'DestinationCode')
                                              ? findCodeInModifySeat(0, 'DestinationCode')
                                              : '')
                                          : (selectedFlight?.details?.originCity
                                              ? selectedFlight?.details?.originCity
                                              : '') +
                                            ' - ' +
                                            (selectedFlight?.details?.destinationCity
                                              ? selectedFlight?.details?.destinationCity
                                              : '')
                                        : modifySeat
                                        ? (findCodeInModifySeat(0, 'DestinationCode')
                                            ? findCodeInModifySeat(0, 'DestinationCode')
                                            : '') +
                                          ' - ' +
                                          (findCodeInModifySeat(0, 'OriginCode')
                                            ? findCodeInModifySeat(0, 'OriginCode')
                                            : '')
                                        : (selectedFlight?.details?.destinationCity
                                            ? selectedFlight?.details?.destinationCity
                                            : '') +
                                          ' - ' +
                                          (selectedFlight?.details?.originCity
                                            ? selectedFlight?.details?.originCity
                                            : '')}
                                    </h1>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="my-3">
                                  <ul className="flex flex-wrap -mb-px text-sm font-medium text-center gap-2 ">
                                    {passengerDetails?.map(
                                      (
                                        passengerItem: {
                                          Firstname: string;
                                          Surname: string;
                                        },
                                        passengerIndex: number
                                      ) => {
                                        return (
                                          <li
                                            role="presentation"
                                            onClick={() =>
                                              findPassengerSelectedSeat(
                                                passengerItem?.Firstname,
                                                passengerItem?.Surname,
                                                passengerIndex,
                                                index
                                              ) !== undefined &&
                                              setSelectedPerson({
                                                Firstname: passengerItem?.Firstname,
                                                Surname: passengerItem?.Surname,
                                                passengerIndex: passengerIndex,
                                                mapIndex: index,
                                              })
                                            }
                                            key={passengerIndex}
                                          >
                                            <button
                                              className={`xl:w-full xs:w-full inline-block p-4  ${
                                                selectedPerson?.passengerIndex === passengerIndex &&
                                                selectedPerson?.mapIndex === index
                                                  ? 'inline-block py-2 px-2 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                                                  : 'borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white'
                                              } `}
                                              type="button"
                                            >
                                              <div className="flex gap-2 items-center">
                                                <Image
                                                  className="h-4 w-4 object-cover"
                                                  src={
                                                    selectedPerson?.passengerIndex ===
                                                      passengerIndex &&
                                                    selectedPerson?.mapIndex === index
                                                      ? getImageSrc(
                                                          passengerDetailsContent,
                                                          'passengerBlueLogo'
                                                        )
                                                      : getImageSrc(
                                                          passengerDetailsContent,
                                                          'passengerOrangeLogo'
                                                        )
                                                  }
                                                  alt=""
                                                  height={4}
                                                  width={4}
                                                />
                                                {passengerItem?.Firstname?.charAt(
                                                  0
                                                )?.toUpperCase() +
                                                  passengerItem?.Firstname?.slice(1)
                                                    ?.toLowerCase()
                                                    ?.trim()}
                                              </div>
                                            </button>
                                          </li>
                                        );
                                      }
                                    )}
                                  </ul>
                                </div>
                                <div>
                                  <div>
                                    <div>
                                      <div className="bg-white p-5">
                                        <div className="grid grid-cols-5 md:grid-cols-5 gap-4 xl:w-3/4 xl:m-auto border-l-4 border-r-4  px-4 border-slategray">
                                          {item?.Decks?.map(
                                            (decks: {
                                              Areas: {
                                                Rows: {
                                                  Columns: {
                                                    Seats: flightSeat[];
                                                  }[];
                                                  RowNumber: number;
                                                }[];
                                              }[];
                                            }) =>
                                              decks?.Areas?.map(
                                                (areas: {
                                                  Rows: {
                                                    Columns: {
                                                      Seats: flightSeat[];
                                                    }[];
                                                    RowNumber: number;
                                                  }[];
                                                }) =>
                                                  areas?.Rows?.map(
                                                    (rows: {
                                                      Columns: {
                                                        Seats: flightSeat[];
                                                      }[];
                                                      RowNumber: number;
                                                    }) =>
                                                      rows?.Columns?.map(
                                                        (
                                                          columns: {
                                                            Seats: flightSeat[];
                                                          },
                                                          columnsIndex: number,
                                                          columnsData: {
                                                            Seats: flightSeat[];
                                                          }[]
                                                        ) =>
                                                          columns?.Seats?.map(
                                                            (
                                                              seats: flightSeat,
                                                              seatsIndex: number,
                                                              seatsData: flightSeat[]
                                                            ) => {
                                                              return (
                                                                <Fragment key={seatsIndex}>
                                                                  <div
                                                                    className={`relative ${
                                                                      seats?.IsAvailable !==
                                                                        undefined &&
                                                                      seats?.IsAvailable
                                                                        ? 'cursor-pointer'
                                                                        : ' cursor-not-allowed'
                                                                    }`}
                                                                    onClick={() => {
                                                                      onSeatSelect(
                                                                        index,
                                                                        rows?.RowNumber,
                                                                        seats?.Letter,
                                                                        seats?.IsAvailable as boolean,
                                                                        seats,
                                                                        item?.AircraftName,
                                                                        item?.RefSegment
                                                                      );
                                                                    }}
                                                                  >
                                                                    <div className="relative">
                                                                      <Image
                                                                        className={` w-full md:w-14 xs:w-14 object-contain   ${
                                                                          seats?.IsAvailable !==
                                                                            undefined &&
                                                                          seats?.IsAvailable
                                                                            ? ''
                                                                            : findSelectedSeat(
                                                                                index,
                                                                                rows?.RowNumber,
                                                                                seats?.Letter
                                                                              ) !== undefined
                                                                            ? ''
                                                                            : 'opacity-30'
                                                                        } `}
                                                                        src={
                                                                          findSelectedSeat(
                                                                            index,
                                                                            rows?.RowNumber,
                                                                            seats?.Letter
                                                                          ) !== undefined
                                                                            ? getImageSrc(
                                                                                chooseSeatsContent,
                                                                                'blueSeat'
                                                                              )
                                                                            : seats?.IsAvailable !==
                                                                                undefined &&
                                                                              seats?.IsAvailable
                                                                            ? seats?.AssociatedAncillaryCode ===
                                                                              '10000005'
                                                                              ? getImageSrc(
                                                                                  chooseSeatsContent,
                                                                                  'greySeat'
                                                                                )
                                                                              : getImageSrc(
                                                                                  chooseSeatsContent,
                                                                                  'orangeSeat'
                                                                                )
                                                                            : getImageSrc(
                                                                                chooseSeatsContent,
                                                                                'greySeat'
                                                                              )
                                                                        }
                                                                        alt=""
                                                                        height={120}
                                                                        width={120}
                                                                      />
                                                                      <div className="absolute xl:top-3 xl:left-5 xs:left-4 xs:top-2 xl:flex xl:justify-center xl:text-center">
                                                                        <p
                                                                          className={`text-pearlgray ${
                                                                            findSelectedSeat(
                                                                              index,
                                                                              rows?.RowNumber,
                                                                              seats?.Letter
                                                                            ) !== undefined
                                                                              ? 'text-white font-black'
                                                                              : 'font-black'
                                                                          } text-xs`}
                                                                        >
                                                                          {findSelectedSeat(
                                                                            index,
                                                                            rows?.RowNumber,
                                                                            seats?.Letter
                                                                          ) !== undefined
                                                                            ? (((findSelectedSeat(
                                                                                index,
                                                                                rows?.RowNumber,
                                                                                seats?.Letter
                                                                              )
                                                                                ?.Firstname?.slice(
                                                                                  0,
                                                                                  1
                                                                                )
                                                                                .toUpperCase() as string) +
                                                                                findSelectedSeat(
                                                                                  index,
                                                                                  rows?.RowNumber,
                                                                                  seats?.Letter
                                                                                )
                                                                                  ?.Surname?.slice(
                                                                                    0,
                                                                                    1
                                                                                  )
                                                                                  .toUpperCase()) as string)
                                                                            : seats?.Letter}
                                                                        </p>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                  {seatsIndex + 1 ===
                                                                    seatsData?.length &&
                                                                    columnsIndex + 1 !==
                                                                      columnsData?.length && (
                                                                      <div className="flex justify-center items-center">
                                                                        <p className="text-pearlgray font-black text-base">
                                                                          {rows?.RowNumber}
                                                                        </p>
                                                                      </div>
                                                                    )}
                                                                </Fragment>
                                                              );
                                                            }
                                                          )
                                                      )
                                                  )
                                              )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-white px-3  shadow-2xl drop-shadow shadow-gray border-t-1	border-t-2 border-gray">
                                      <div className="flex gap-3 justify-between my-6">
                                        <div className="flex  xl:gap-4 xs:gap-2 border border-Silvergray w-1/3 px-2 py-2">
                                          <Image
                                            className="xl:w-8 xs:w-4 object-contain "
                                            src={getImageSrc(chooseSeatsContent, 'orangeSeat')}
                                            alt=""
                                            height={40}
                                            width={40}
                                          />
                                          <div>
                                            <p className="text-sm text-medium text-pearlgray">
                                              {getFieldName(chooseSeatsContent, 'ottoman')}
                                            </p>
                                            <p className="text-sm text-medium text-pearlgray">
                                              $150
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center  xl:gap-4 xs:gap-2 border border-Silvergray w-1/3 px-2 py-2">
                                          <Image
                                            className=" xl:w-8 xs:w-4 object-contain "
                                            src={getImageSrc(chooseSeatsContent, 'greySeat')}
                                            alt=""
                                            height={40}
                                            width={40}
                                          />
                                          <div>
                                            <p className="text-sm text-medium text-pearlgray">
                                              {getFieldName(chooseSeatsContent, 'premium')}
                                            </p>
                                            <p className="text-sm text-medium text-pearlgray">
                                              {getFieldName(chooseSeatsContent, 'included')}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center xl:gap-4 xs:gap-1 border border-Silvergray w-1/3 px-2 py-2">
                                          <Image
                                            className=" xl:w-8 xs:w-4 object-contain opacity-30"
                                            src={getImageSrc(chooseSeatsContent, 'greySeat')}
                                            alt=""
                                            height={40}
                                            width={40}
                                          />
                                          <div>
                                            <p className="text-sm text-medium text-pearlgray">
                                              {getFieldName(chooseSeatsContent, 'unavailable')}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="py-5 flex gap-2">
                                        {selectedPerson?.passengerIndex %
                                          passengerDetails?.length !==
                                          0 && (
                                          <button
                                            type="button"
                                            className="gap-2 w-full xs:justify-center xs:text-center text-white bg-aqua  font-black rounded-lg text-sm inline-flex items-center px-5 py-3 text-center "
                                            onClick={() => {
                                              const findPreviousPassenger =
                                                passengerDetails?.findIndex(
                                                  (item: { Firstname: string; Surname: string }) =>
                                                    item?.Firstname === selectedPerson?.Firstname &&
                                                    item?.Surname === selectedPerson?.Surname
                                                );
                                              findPreviousPassenger > 0 &&
                                                setSelectedPerson({
                                                  Firstname:
                                                    passengerDetails[findPreviousPassenger - 1]
                                                      ?.Firstname,
                                                  Surname:
                                                    passengerDetails[findPreviousPassenger - 1]
                                                      ?.Surname,
                                                  passengerIndex: findPreviousPassenger - 1,
                                                  mapIndex: index,
                                                });
                                            }}
                                          >
                                            {getFieldName(chooseSeatsContent, 'previousButton')}
                                          </button>
                                        )}
                                        {selectSeat?.find((item) => item?.mapIndex === index) !==
                                          undefined && (
                                          <button
                                            type="button"
                                            className={`gap-2 w-full xs:justify-center xs:text-center text-white bg-aqua  font-black rounded-lg text-sm inline-flex items-center px-5 py-3 text-center ${
                                              findPassengerSelectedSeat(
                                                selectedPerson?.Firstname,
                                                selectedPerson?.Surname,
                                                selectedPerson?.passengerIndex,
                                                selectedPerson?.mapIndex
                                              )
                                                ? ''
                                                : ' opacity-30 cursor-not-allowed'
                                            }`}
                                            onClick={() => {
                                              findPassengerSelectedSeat(
                                                selectedPerson?.Firstname,
                                                selectedPerson?.Surname,
                                                selectedPerson?.passengerIndex,
                                                selectedPerson?.mapIndex
                                              ) !== undefined && nextButtonClick(index);
                                            }}
                                          >
                                            {mapIndex + 1 ===
                                              seatMaps?.slice(
                                                0,
                                                flightWay ? flightWay?.length : seatMaps
                                              )?.length &&
                                            selectedPerson?.passengerIndex + 1 ===
                                              passengerDetails?.length
                                              ? getFieldName(chooseSeatsContent, 'confirmButton')
                                              : getFieldName(chooseSeatsContent, 'nextButton')}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Fragment>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : load?.name === 'seats' ? (
        <SearchSeatLoader open={load?.show} />
      ) : (
        load.name === 'save' && <SavingDataLoader open={load?.show} />
      )}
    </main>
  );
};

export default ChooseSeats;
