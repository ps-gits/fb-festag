import Image from 'next/image';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faXmark } from '@fortawesome/free-solid-svg-icons';

import leftbg from '../../assets/images/leftbg.png';
import seat from '../../assets/images/chooseseat.png';
import rightbg from '../../assets/images/rightbg.png';
import arrowup from '../../assets/images/arrow-up.png';
import arowdown from '../../assets/images/arowdown.png';
import arrowleft from '../../assets/images/arrowleft.png';
import arrowright from '../../assets/images/arrowright.png';
import passengerblue from '../../assets/images/passengerblue.png';

import {
  postCreateBooking,
  postModifyBookingSeats,
  postExchangeCreateBooking,
} from 'src/redux/action/SearchFlights';
import {
  setModifySeat,
  setChooseSeatData,
  setSelectSeatLaterData,
  setModifyBookingFromBooking,
} from 'src/redux/reducer/FlightDetails';
import { RootState } from 'src/redux/store';
import StepsInfo from '../SearchFlight/StepsInfo';
import { loader } from 'src/redux/reducer/Loader';
import SearchSeatLoader from '../Loader/SearchSeat';
import SavingDataLoader from '../Loader/SavingData';
import ErrorMessages from 'components/Toaster/ErrorMessages';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import { civilityCodeOptions } from 'components/Select/SelectOptions';
import { calculateDob } from 'components/PassengerDetails/CalculateDob';
import { fieldsWithCode } from 'components/PassengerDetails/FieldsData';
import SelectSeatLaterModal from 'components/Modal/SelectSeatLaterModal';
import EmergencyExitSeatModal from 'components/Modal/EmergencyExitSeatModal';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const ChooseSeats = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const modifyDataFromBooking = useSelector(
    (state: RootState) => state?.flightDetails?.modifyDataFromBooking
  );
  const modifySeat = useSelector((state: RootState) => state?.flightDetails?.modifySeat);
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const seatMaps = useSelector((state: RootState) =>
    modifySeat
      ? state?.flightDetails?.prepareBookingModification?.SeatMaps
      : !modifyDataFromBooking && !modifyData
      ? state?.flightDetails?.prepareFlight?.SeatMaps
      : state?.flightDetails?.prepareExchangeFlight?.SeatMaps
  );
  const flightWay = useSelector((state: RootState) =>
    modifySeat
      ? state?.flightDetails?.modifyBooking?.OriginDestination
      : !modifyDataFromBooking && !modifyData
      ? state?.flightDetails?.reviewFlight?.OriginDestinations
      : state?.flightDetails?.modifyBooking?.OriginDestination
  );
  const prepareFlightDetails = useSelector((state: RootState) =>
    modifySeat
      ? state?.flightDetails?.prepareBookingModification
      : !modifyDataFromBooking && !modifyData
      ? state?.flightDetails?.prepareFlight
      : state?.flightDetails?.prepareExchangeFlight
  );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const prepareFlightDetailsRef = useSelector(
    (state: RootState) => state?.flightDetails?.prepareFlightRef
  );
  // const termsConditionsContent = useSelector(
  //   (state: RootState) => state?.sitecore?.termsConditions?.fields
  // );
  const passengerDetailsContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerDetails?.fields
  );
  const allMealData = useSelector((state: RootState) =>
    modifySeat
      ? state?.flightDetails?.prepareBookingModification?.MealsDetails
      : !modifyDataFromBooking && !modifyData
      ? state?.flightDetails?.prepareFlight?.MealsDetails
      : state?.flightDetails?.prepareExchangeFlight?.MealsDetails
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const passengerDetails = useSelector(
    (state: RootState) =>
      modifySeat
        ? state?.flightDetails?.prepareBookingModification?.Passengers?.map(
            (item: { NameElement: { Firstname: string; Surname: string } }, index: number) => {
              const otherFields = Object.fromEntries(
                state?.flightDetails?.prepareBookingModification?.PassengersDetails[
                  index
                ]?.fields.map((dt: { Code: string; Text: string }) => [
                  fieldsWithCode?.find((item1) => item1?.Code === dt?.Code)?.name,
                  dt.Text,
                ])
              );
              return {
                ...item?.NameElement,
                ...otherFields,
              };
            }
          )
        : // ?.map(({ undefined: {}, ...rest }) => ({ ...rest }))
        !modifyDataFromBooking && !modifyData
        ? state?.passenger?.passengersData?.details
        : state?.flightDetails?.prepareExchangeFlight?.Passengers?.map(
            (item: { NameElement: { Firstname: string; Surname: string } }, index: number) => {
              const otherFields = Object.fromEntries(
                state?.flightDetails?.prepareExchangeFlight?.PassengersDetails[index]?.fields.map(
                  (dt: { Code: string; Text: string }) => [
                    fieldsWithCode?.find((item1) => item1?.Code === dt?.Code)?.name,
                    dt.Text,
                  ]
                )
              );
              return {
                ...item?.NameElement,
                ...otherFields,
              };
            }
          )
    // ?.map(({ undefined: {}, ...rest }) => ({ ...rest }))   //in api undefined key not available
  );
  const choosenSeats = useSelector((state: RootState) => state?.flightDetails?.chooseSeats);
  const selectedMeal = useSelector((state: RootState) => state?.flightDetails?.selectedMeal);
  // const paymentContent = useSelector((state: RootState) => state?.sitecore?.payment?.fields);
  const selectedFlight = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);
  // const reviewTripContent = useSelector((state: RootState) => state?.sitecore?.reviewTrip?.fields);
  const chooseSeatsContent = useSelector((state: RootState) => state?.sitecore?.chooseSeat?.fields);

  const allSeats = modifyBookingInfo?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) =>
      item?.fields?.filter((item: { Code: string }) => item?.Code === 'SEAT')?.map((item) => item)
  );

  const seatDataWithPassengerInfo = (
    allSeats && allSeats?.length > 0 ? allSeats?.flat(1) : []
  )?.map((item: { Data: { Seat: { SeatRow: number; SeatLetter: string } } }, index: number) => {
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
        (seatRowItem: { RowNumber: number }) => seatRowItem?.RowNumber === item?.Data?.Seat?.SeatRow
      )
      ?.Columns?.find((seatRowItem1: { Seats: { Letter: string }[] }) =>
        seatRowItem1?.Seats?.find(
          (seatRowItem2: { Letter: string }) =>
            seatRowItem2?.Letter === item?.Data?.Seat?.SeatLetter
        )
      )
      ?.Seats?.find(
        (seatRowItem3: { Letter: string }) => seatRowItem3?.Letter === item?.Data?.Seat?.SeatLetter
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
  });

  const seatObject = {
    Letter: '',
    IsAvailable: false,
    AssociatedAncillaryCode: '',
    Extensions: null,
    PassengerTypeCodeRestrictions: [],
    RefPassenger: null,
    SeatTypeCode: '',
    SpecialServiceCodeRestrictions: [],
  };

  const [mapIndex, setMapIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [emergencySeat, setEmergencySeat] = useState({
    showModal: false,
    mapIndex: 0,
    rowNumber: 0,
    seatLetter: '',
    isAvailable: false,
    seats: seatObject,
    aircraftName: '',
    refSegment: '',
  });
  const [selectSeatLater, setSelectSeatLater] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    status: 0,
    message: '',
  });
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
    Firstname: passengerDetails !== undefined ? passengerDetails[0]?.Firstname : '',
    Surname: passengerDetails !== undefined ? passengerDetails[0]?.Surname : '',
    mapIndex: 0,
    passengerIndex: 0,
  });

  useEffect(() => {
    dispatch(getSitecoreContent('Terms-Conditions') as unknown as AnyAction);
  }, [dispatch]);

  const findCodeInModifySeat = (indexNumber: number, codeType: string) => {
    return flightWay?.find(
      (item: object, index: number) => item !== undefined && index === indexNumber
    )[codeType];
  };

  const refSegmentDeparture = seatMaps?.find(
    (item: object, index: number) => item !== undefined && index === 0
  )?.RefSegment;

  const refSegmentArrival = seatMaps?.find(
    (item: object, index: number) => item !== undefined && index === 1
  )?.RefSegment;

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
      submitSeatSelecttion('finalSubmit');
    }
  };

  const submitSeatSelecttion = (type: string) => {
    dispatch(
      loader({
        name: 'save',
        show: true,
      })
    );
    dispatch(setChooseSeatData(type === 'finalSubmit' ? selectSeat : []));
    if (type === 'finalSubmit') {
      dispatch(setSelectSeatLaterData(false));
    } else {
      dispatch(setSelectSeatLaterData(true));
    }
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
          index === arr?.findIndex((dt) => dt?.AncillaryCode === item?.AncillaryCode)
      );

    const mealSelected: mealObjectKeys[] = selectedMeal ? selectedMeal : [];

    const departure = mealSelected?.filter(
      (item: { originMealCode: string }) => item?.originMealCode?.length > 0
    );

    const arrival = mealSelected?.filter(
      (item: { returnMealCode: string }) => item?.returnMealCode?.length > 0
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
          // Homecontact: string;
          dialCodeMobile: string;
          // flagHomeContact: string;
          // validHomeContact: string;
          // dialCodeHomeContact: string;
        },
        index: number
      ) => {
        const postData = JSON.parse(JSON.stringify(item));
        if (Object.keys(item).includes('Mobile')) {
          postData['Mobile'] =
            (item['dialCodeMobile'] === undefined ? '' : item['dialCodeMobile']) + item['Mobile'];
        }
        // if (Object.keys(item).includes('Homecontact')) {
        //   postData['Homecontact'] = item['dialCodeHomeContact'] + item['Homecontact'];
        // }
        Object.keys(item).includes('undefined') && delete postData['undefined'];
        delete postData?.flagMobile;
        delete postData?.validMobile;
        delete postData?.dialCodeMobile;
        // delete postData?.flagHomeContact;
        // delete postData?.validHomeContact;
        // delete postData?.dialCodeHomeContact;

        return {
          PassengerDetails: {
            ...postData,
            CivilityCode: civilityCodeOptions?.find(
              (dt) => dt?.label === postData?.CivilityCode || dt?.Code === postData?.CivilityCode
            )?.Code,
            Surname: item?.Surname,
            Firstname: item?.Firstname,
            Ref: prepareFlightDetails?.Passengers[index]?.Ref,
            PassengerType: calculateDob(item?.Dob) >= 11 ? 'AD' : 'CHD',
            Homecontact: postData?.Mobile,
          },
          SpecialServices:
            calculateDob(item?.Dob) >= 11
              ? {
                  CTCE: item.Email,
                  CTCH: postData?.Mobile,
                  CTCM: postData?.Mobile,
                  DOCS: '',
                  EXTADOB: item?.Dob,
                }
              : {
                  CTCE: item.Email,
                  CTCH: postData?.Mobile,
                  CTCM: postData?.Mobile,
                  DOCS: '',
                  CHLD: item?.Dob,
                },
          Documents: [
            {
              NationalityCountryCode: 'FR',
              DateOfBirth: item.Dob,
              Gender: 'F',
              Firstname: item?.Firstname,
              Surname: item?.Surname,
            },
          ],
        };
      }
    );
    if (modifySeat) {
      dispatch(
        postModifyBookingSeats(
          {
            booking: dataToPost,
            PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
            PassengerName: passengerDetails !== undefined ? passengerDetails[0].Surname : '',
            SeatMap: {
              departure:
                type === 'finalSubmit' && seatData && seatData?.length > 0
                  ? seatData?.slice(0, passengerDetails?.length)?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                  : [],
              arrival:
                type === 'finalSubmit' && seatData && seatData?.length > 0
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
            // AncillaryData: [],
            EMDTicketFareOptions:
              ticketFareOptions && ticketFareOptions?.length > 0 ? ticketFareOptions : [],
            MealsDetails: {
              departure:
                departure && departure?.length > 0
                  ? departure?.map(
                      (item: {
                        originMealCode: string;
                        passengerName: string;
                        passengerIndex: number;
                      }) => {
                        const findPassengerIndex = passengerDetails?.findIndex(
                          (dt: { Firstname: string }, index: number) =>
                            dt?.Firstname === item?.passengerName && index === item?.passengerIndex
                        );
                        // const findData = allMealData[findPassengerIndex]?.fields?.find(
                        //   (dt: { Code: string }) => item?.originMealCode === dt?.Code
                        // );
                        const findData = allMealData[findPassengerIndex]?.fields
                          ?.filter(
                            (item: { RefSegment: string }) =>
                              item?.RefSegment === refSegmentDeparture
                          )
                          ?.find((dt: { Code: string }) => item?.originMealCode === dt?.Code);
                        return {
                          Code: item?.originMealCode,
                          Label: findData?.Label ? findData?.Label : '',
                          RefPassenger: findData?.RefPassenger ? findData?.RefPassenger : '',
                          RefSegment: refSegmentDeparture ? refSegmentDeparture : '',
                        };
                      }
                    )
                  : [],
              arrival:
                arrival && arrival?.length > 0
                  ? arrival?.map(
                      (item: {
                        returnMealCode: string;
                        passengerName: string;
                        passengerIndex: number;
                      }) => {
                        const findPassengerIndex = passengerDetails?.findIndex(
                          (dt: { Firstname: string }, index: number) =>
                            dt?.Firstname === item?.passengerName && index === item?.passengerIndex
                        );
                        // const findData = allMealData[findPassengerIndex]?.fields?.find(
                        //   (dt: { Code: string }) => item?.returnMealCode === dt?.Code
                        // );
                        const findData = allMealData[findPassengerIndex]?.fields
                          ?.filter(
                            (item: { RefSegment: string }) =>
                              item?.RefSegment === refSegmentDeparture
                          )
                          ?.find((dt: { Code: string }) => item?.returnMealCode === dt?.Code);
                        return {
                          Code: item?.returnMealCode,
                          Label: findData?.Label ? findData?.Label : '',
                          RefPassenger: findData?.RefPassenger ? findData?.RefPassenger : '',
                          RefSegment: refSegmentArrival ? refSegmentArrival : '',
                        };
                      }
                    )
                  : [],
            },
          },
          router,
          prepareFlightDetails?.cpd_code,
          false,
          setShowToast
        ) as unknown as AnyAction
      );
    } else if (modifyData || modifyDataFromBooking) {
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
                type === 'finalSubmit' && seatData && seatData?.length > 0
                  ? seatData?.slice(0, passengerDetails?.length)?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                  : [],
              arrival:
                type === 'finalSubmit' && seatData && seatData?.length > 0
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
            EMDTicketFareOptions:
              ticketFareOptions && ticketFareOptions?.length > 0 ? ticketFareOptions : [],
            MealsDetails: {
              departure:
                departure && departure?.length > 0
                  ? departure?.map(
                      (item: {
                        originMealCode: string;
                        passengerName: string;
                        passengerIndex: number;
                      }) => {
                        const findPassengerIndex = passengerDetails?.findIndex(
                          (dt: { Firstname: string }, index: number) =>
                            dt?.Firstname === item?.passengerName && index === item?.passengerIndex
                        );
                        // const findData = allMealData[findPassengerIndex]?.fields?.find(
                        //   (dt: { Code: string }) => item?.originMealCode === dt?.Code
                        // );
                        const findData = allMealData[findPassengerIndex]?.fields
                          ?.filter(
                            (item: { RefSegment: string }) =>
                              item?.RefSegment === refSegmentDeparture
                          )
                          ?.find((dt: { Code: string }) => item?.originMealCode === dt?.Code);
                        return {
                          Code: item?.originMealCode,
                          Label: findData?.Label ? findData?.Label : '',
                          RefPassenger: findData?.RefPassenger ? findData?.RefPassenger : '',
                          RefSegment: refSegmentDeparture ? refSegmentDeparture : '',
                        };
                      }
                    )
                  : [],
              arrival:
                arrival && arrival?.length > 0
                  ? arrival?.map(
                      (item: {
                        returnMealCode: string;
                        passengerName: string;
                        passengerIndex: number;
                      }) => {
                        const findPassengerIndex = passengerDetails?.findIndex(
                          (dt: { Firstname: string }, index: number) =>
                            dt?.Firstname === item?.passengerName && index === item?.passengerIndex
                        );
                        // const findData = allMealData[findPassengerIndex]?.fields?.find(
                        //   (dt: { Code: string }) => item?.returnMealCode === dt?.Code
                        // );
                        const findData = allMealData[findPassengerIndex]?.fields
                          ?.filter(
                            (item: { RefSegment: string }) =>
                              item?.RefSegment === refSegmentDeparture
                          )
                          ?.find((dt: { Code: string }) => item?.returnMealCode === dt?.Code);
                        return {
                          Code: item?.returnMealCode,
                          Label: findData?.Label ? findData?.Label : '',
                          RefPassenger: findData?.RefPassenger ? findData?.RefPassenger : '',
                          RefSegment: refSegmentArrival ? refSegmentArrival : '',
                        };
                      }
                    )
                  : [],
            },
          },
          router,
          selectedFlight?.details?.cpd_code,
          setShowToast
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
                type === 'finalSubmit' && seatData && seatData?.length > 0
                  ? seatData?.slice(0, passengerDetails?.length)?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                  : [],
              arrival:
                type === 'finalSubmit' && seatData && seatData?.length > 0
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
            EMDTicketFareOptions:
              ticketFareOptions && ticketFareOptions?.length > 0 ? ticketFareOptions : [],
            MealsDetails: {
              departure:
                departure && departure?.length > 0
                  ? departure?.map(
                      (item: {
                        originMealCode: string;
                        passengerName: string;
                        passengerIndex: number;
                      }) => {
                        const findPassengerIndex = passengerDetails?.findIndex(
                          (dt: { Firstname: string }, index: number) =>
                            dt?.Firstname === item?.passengerName && index === item?.passengerIndex
                        );
                        const findData = allMealData[findPassengerIndex]?.fields
                          ?.filter(
                            (item: { RefSegment: string }) =>
                              item?.RefSegment === refSegmentDeparture
                          )
                          ?.find((dt: { Code: string }) => item?.originMealCode === dt?.Code);
                        return {
                          Code: item?.originMealCode,
                          Label: findData?.Label ? findData?.Label : '',
                          RefPassenger: findData?.RefPassenger ? findData?.RefPassenger : '',
                          RefSegment: refSegmentDeparture ? refSegmentDeparture : '',
                        };
                      }
                    )
                  : [],
              arrival:
                arrival && arrival?.length > 0
                  ? arrival?.map(
                      (item: {
                        returnMealCode: string;
                        passengerName: string;
                        passengerIndex: number;
                      }) => {
                        const findPassengerIndex = passengerDetails?.findIndex(
                          (dt: { Firstname: string }, index: number) =>
                            dt?.Firstname === item?.passengerName && index === item?.passengerIndex
                        );
                        const findData = allMealData[findPassengerIndex]?.fields
                          ?.filter(
                            (item: { RefSegment: string }) => item?.RefSegment === refSegmentArrival
                          )
                          ?.find((dt: { Code: string }) => item?.returnMealCode === dt?.Code);
                        return {
                          Code: item?.returnMealCode,
                          Label: findData?.Label ? findData?.Label : '',
                          RefPassenger: findData?.RefPassenger ? findData?.RefPassenger : '',
                          RefSegment: refSegmentArrival ? refSegmentArrival : '',
                        };
                      }
                    )
                  : [],
            },
          },
          router,
          selectedFlight?.details?.cpd_code,
          setShowToast
        ) as unknown as AnyAction
      );
    }
  };

  const ShowSeatDetailsHeading = (props: { index: number }) => {
    const findSeatLabel = prepareFlightDetails?.EMDTicketFareOptions?.find(
      (dt: { AncillaryCode: string }) =>
        dt?.AncillaryCode ===
        findPassengerSelectedSeat(
          selectedPerson?.Firstname,
          selectedPerson?.Surname,
          selectedPerson?.passengerIndex,
          props?.index
        )?.AssociatedAncillaryCode
    );

    const ottomanData = prepareFlightDetails?.EMDTicketFareOptions?.find(
      (dt: { Label: string }) => dt?.Label === 'Ottoman.' || dt?.Label === 'Ottoman'
    );

    return (
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div>
            <Image
              className=" xl:w-8 xs:w-4 object-contain "
              src={getImageSrc(
                chooseSeatsContent,
                findPassengerSelectedSeat(
                  selectedPerson?.Firstname,
                  selectedPerson?.Surname,
                  selectedPerson?.passengerIndex,
                  props?.index
                ) !== undefined
                  ? findSeatLabel?.Label === 'Premium' || findSeatLabel?.Label === 'Premium.'
                    ? 'greySeat'
                    : 'orangeSeat'
                  : 'orangeSeat'
              )}
              alt=""
              height={40}
              width={40}
            />
          </div>
          <div className="text-pearlgray font-medium text-sm">
            {findPassengerSelectedSeat(
              selectedPerson?.Firstname,
              selectedPerson?.Surname,
              selectedPerson?.passengerIndex,
              props?.index
            ) !== undefined
              ? findSeatLabel?.Label === 'Premium' || findSeatLabel?.Label === 'Premium.'
                ? getFieldName(chooseSeatsContent, 'premium')
                : getFieldName(chooseSeatsContent, 'ottoman')
              : getFieldName(chooseSeatsContent, 'ottoman')}
          </div>
        </div>
        <div className="text-aqua text-xs font-extrabold">
          &nbsp;
          {findPassengerSelectedSeat(
            selectedPerson?.Firstname,
            selectedPerson?.Surname,
            selectedPerson?.passengerIndex,
            props?.index
          ) !== undefined
            ? findSeatLabel?.Label === 'Premium' || findSeatLabel?.Label === 'Premium.'
              ? `${
                  selectedFlight?.name && selectedFlight?.name === 'Delight'
                    ? `${
                        (findSeatLabel ? findSeatLabel : ottomanData)?.SaleCurrencyAmount
                          ?.TotalAmount
                          ? (findSeatLabel ? findSeatLabel : ottomanData)?.SaleCurrencyAmount
                              ?.TotalAmount
                          : '0'
                      } ${
                        selectedFlight?.details?.currency ? selectedFlight?.details?.currency : ''
                      } Extra`
                    : 'Included'
                }`
              : `${
                  (findSeatLabel ? findSeatLabel : ottomanData)?.SaleCurrencyAmount?.TotalAmount
                    ? (findSeatLabel ? findSeatLabel : ottomanData)?.SaleCurrencyAmount?.TotalAmount
                    : '0'
                } ${
                  modifySeat
                    ? modifyBookingInfo?.Amount?.SaleCurrencyCode
                      ? modifyBookingInfo?.Amount?.SaleCurrencyCode
                      : ''
                    : selectedFlight?.details?.currency
                    ? selectedFlight?.details?.currency
                    : ''
                } Extra`
            : `${
                (findSeatLabel ? findSeatLabel : ottomanData)?.SaleCurrencyAmount?.TotalAmount
                  ? (findSeatLabel ? findSeatLabel : ottomanData)?.SaleCurrencyAmount?.TotalAmount
                  : '0'
              } ${
                modifySeat
                  ? modifyBookingInfo?.Amount?.SaleCurrencyCode
                    ? modifyBookingInfo?.Amount?.SaleCurrencyCode
                    : ''
                  : selectedFlight?.details?.currency
                  ? selectedFlight?.details?.currency
                  : ''
              } Extra`}
        </div>
      </div>
    );
  };

  const ShowSeatDetails = (props: { index: number; isMobile: boolean }) => (
    <div
      className={` gap-3 justify-between p-5 bg-white rounded-lg mb-4 ${
        props.isMobile ? 'mt-7 border border-cadetgray' : ''
      }`}
    >
      <ShowSeatDetailsHeading index={props?.index} />
      <Image src={seat} className="h-full w-full rounded-lg" alt="" />
      <div className="pt-3">
        <p className="font-extrabold text-sm text-black">Description</p>
        <p className="font-medium text-xs text-pearlgray py-1">
          {findPassengerSelectedSeat(
            selectedPerson?.Firstname,
            selectedPerson?.Surname,
            selectedPerson?.passengerIndex,
            props?.index
          ) !== undefined
            ? prepareFlightDetails?.EMDTicketFareOptions?.find(
                (dt: { AncillaryCode: string }) =>
                  dt?.AncillaryCode ===
                  findPassengerSelectedSeat(
                    selectedPerson?.Firstname,
                    selectedPerson?.Surname,
                    selectedPerson?.passengerIndex,
                    props?.index
                  )?.AssociatedAncillaryCode
              )?.Label === 'Premium' ||
              prepareFlightDetails?.EMDTicketFareOptions?.find(
                (dt: { AncillaryCode: string }) =>
                  dt?.AncillaryCode ===
                  findPassengerSelectedSeat(
                    selectedPerson?.Firstname,
                    selectedPerson?.Surname,
                    selectedPerson?.passengerIndex,
                    props?.index
                  )?.AssociatedAncillaryCode
              )?.Label === 'Premium.'
              ? getFieldName(chooseSeatsContent, 'premiumDescription')
              : getFieldName(chooseSeatsContent, 'ottomanDescription')
            : getFieldName(chooseSeatsContent, 'ottomanDescription')}
        </p>
        {props?.isMobile && (
          <div className="mt-2">
            <button
              type="button"
              className="xl:w-full md:w-full xs:w-full  xs:justify-center xs:items-center  xs:flex text-aqua border bg-white border-aqua font-extrabold rounded-lg text-lg inline-flex items-center px-5 py-2 text-center"
              onClick={() => {
                setShowModal(false);
                document.body.style.overflow = 'unset';
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const imageLoader = () => {
    return `https://ipac.ctnsnet.com/int/integration?pixel=79124019&nid=2142538&cont=i`
  }

  return (
    <main
      onClick={() => {
        const modalSeatDetails = document.getElementById('show-seat-details');
        const modalEmergencySeat = document.getElementById('emergency-seat-modal');
        const modalSelectSeatLater = document.getElementById('select-seat-later-modal');
        window.onclick = function (event) {
          if (
            event.target == modalSeatDetails ||
            event.target == modalEmergencySeat ||
            event.target == modalSelectSeatLater
          ) {
            showModal && setShowModal(false);
            emergencySeat &&
              setEmergencySeat({
                showModal: false,
                mapIndex: 0,
                rowNumber: 0,
                seatLetter: '',
                isAvailable: false,
                seats: seatObject,
                aircraftName: '',
                refSegment: '',
              });
            selectSeatLater && setSelectSeatLater(false);
            document.body.style.overflow = 'unset';
          }
        };
      }}
    >
      <Image
        src={'https://ipac.ctnsnet.com/int/integration?pixel=79124019&nid=2142538&cont=i'}
        loader={imageLoader}
        width={1}
        height={1}
        alt="pixel"
      />
      {!load?.show ? (
        <div className="relative">
          <ErrorMessages showToast={showToast} setShowToast={setShowToast} />
          <div className="xl:px-7  xl:bg-cadetgray xs:bg-white w-auto  xl:w-3/4 xs:w-full xl:py-16 ">
            <div>
              <SelectSeatLaterModal
                showModal={selectSeatLater}
                closeModal={() => {
                  setSelectSeatLater(false);
                  document.body.style.overflow = 'unset';
                }}
                createBooking={() => {
                  submitSeatSelecttion('selectSeatLater');
                  document.body.style.overflow = 'unset';
                }}
              />
              <EmergencyExitSeatModal
                showModal={emergencySeat?.showModal}
                closeModal={() => {
                  setEmergencySeat({
                    showModal: false,
                    mapIndex: 0,
                    rowNumber: 0,
                    seatLetter: '',
                    isAvailable: false,
                    seats: seatObject,
                    aircraftName: '',
                    refSegment: '',
                  });
                  document.body.style.overflow = 'unset';
                }}
                isChild={
                  new Date().getFullYear() -
                    Number(
                      passengerDetails[selectedPerson?.passengerIndex]?.Dob?.slice(
                        passengerDetails[selectedPerson?.passengerIndex]?.Dob?.length - 4
                      )
                    ) <
                  12
                    ? true
                    : false
                }
                selectSeat={() => {
                  onSeatSelect(
                    emergencySeat?.mapIndex,
                    emergencySeat?.rowNumber,
                    emergencySeat?.seatLetter,
                    emergencySeat?.isAvailable,
                    emergencySeat?.seats,
                    emergencySeat?.aircraftName,
                    emergencySeat?.refSegment
                  );
                  setEmergencySeat({
                    showModal: false,
                    mapIndex: 0,
                    rowNumber: 0,
                    seatLetter: '',
                    isAvailable: false,
                    seats: seatObject,
                    aircraftName: '',
                    refSegment: '',
                  });
                  document.body.style.overflow = 'unset';
                }}
              />
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
                  <div className="absolute top-16 right-3.5  xl:m-auto price-modal">
                    <div className="xl:not-sr-only	xs:sr-only">
                      <div className="fixed top-24 right-3.5  xl:m-auto price-modal">
                        <div className="">
                          <div>
                            <div className="bg-white p-3 rounded-lg ">
                              <div className="mb-2">
                                <h1 className="text-xl text-black font-extrabold">
                                  Seats Selection
                                </h1>
                                <p className="font-medium text-base text-pearlgray">
                                  Summary of your selected seats
                                </p>
                              </div>
                              {seatMaps
                                ?.slice(0, flightWay ? flightWay?.length : seatMaps?.length)
                                ?.map((_item: { AircraftName: string }, index: number) => (
                                  <div
                                    className=" p-3 border border-cadetgray rounded-lg mb-3"
                                    key={index}
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-pearlgray">
                                        {index === 0
                                          ? getFieldName(chooseSeatsContent, 'outbound')
                                          : getFieldName(chooseSeatsContent, 'return')}
                                      </p>
                                      <p className="text-pearlgray font-extrabold text-lg">
                                        {index === 0
                                          ? modifySeat
                                            ? (findCodeInModifySeat(0, 'OriginCode')
                                                ? findCodeInModifySeat(0, 'OriginCode')
                                                : '') +
                                              ' - ' +
                                              (findCodeInModifySeat(0, 'DestinationCode')
                                                ? findCodeInModifySeat(0, 'DestinationCode')
                                                : '')
                                            : (selectedFlight?.details?.OriginCode
                                                ? selectedFlight?.details?.OriginCode
                                                : '') +
                                              ' - ' +
                                              (selectedFlight?.details?.DestinationCode
                                                ? selectedFlight?.details?.DestinationCode
                                                : '')
                                          : modifySeat
                                          ? (findCodeInModifySeat(0, 'DestinationCode')
                                              ? findCodeInModifySeat(0, 'DestinationCode')
                                              : '') +
                                            ' - ' +
                                            (findCodeInModifySeat(0, 'OriginCode')
                                              ? findCodeInModifySeat(0, 'OriginCode')
                                              : '')
                                          : (selectedFlight?.details?.DestinationCode
                                              ? selectedFlight?.details?.DestinationCode
                                              : '') +
                                            ' - ' +
                                            (selectedFlight?.details?.OriginCode
                                              ? selectedFlight?.details?.OriginCode
                                              : '')}
                                      </p>
                                      <div className="mt-2">
                                        {passengerDetails?.map(
                                          (
                                            passenger: {
                                              Firstname: string;
                                              Surname: string;
                                              Dob: string;
                                            },
                                            passengerIndex: number
                                          ) => (
                                            <div
                                              className="flex justify-between items-center mb-3"
                                              key={passengerIndex}
                                            >
                                              <div className="flex items-center gap-2">
                                                <div>
                                                  <Image
                                                    src={passengerblue}
                                                    className="h-4 w-4 rounded-lg"
                                                    alt=""
                                                  />
                                                </div>
                                                <div className="text-black font-medium text-sm">
                                                  {passenger?.Firstname?.charAt(0)?.toUpperCase() +
                                                    passenger?.Firstname?.slice(1)
                                                      ?.toLowerCase()
                                                      ?.trim() +
                                                    ' ' +
                                                    passenger?.Surname?.charAt(0)?.toUpperCase() +
                                                    passenger?.Surname?.slice(1)
                                                      ?.toLowerCase()
                                                      ?.trim() +
                                                    ' ' +
                                                    (new Date().getFullYear() -
                                                      Number(
                                                        passenger?.Dob?.slice(
                                                          passenger?.Dob?.length - 4
                                                        )
                                                      ) <
                                                    12
                                                      ? '(Child)'
                                                      : '')}
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {findPassengerSelectedSeat(
                                                  passenger?.Firstname,
                                                  passenger?.Surname,
                                                  passengerIndex,
                                                  index
                                                ) !== undefined && (
                                                  <div>
                                                    <Image
                                                      className="xl:w-4 xs:w-4 object-contain "
                                                      src={
                                                        prepareFlightDetails?.EMDTicketFareOptions?.find(
                                                          (dt: { AncillaryCode: string }) =>
                                                            dt?.AncillaryCode ===
                                                            findPassengerSelectedSeat(
                                                              passenger?.Firstname,
                                                              passenger?.Surname,
                                                              passengerIndex,
                                                              index
                                                            )?.AssociatedAncillaryCode
                                                        )?.Label === 'Premium' ||
                                                        prepareFlightDetails?.EMDTicketFareOptions?.find(
                                                          (dt: { AncillaryCode: string }) =>
                                                            dt?.AncillaryCode ===
                                                            findPassengerSelectedSeat(
                                                              passenger?.Firstname,
                                                              passenger?.Surname,
                                                              passengerIndex,
                                                              index
                                                            )?.AssociatedAncillaryCode
                                                        )?.Label === 'Premium.'
                                                          ? getImageSrc(
                                                              chooseSeatsContent,
                                                              'greySeat'
                                                            )
                                                          : getImageSrc(
                                                              chooseSeatsContent,
                                                              'orangeSeat'
                                                            )
                                                      }
                                                      alt=""
                                                      height={40}
                                                      width={40}
                                                    />
                                                  </div>
                                                )}
                                                <div className="text-pearlgraya text-sm  font-medium">
                                                  {findPassengerSelectedSeat(
                                                    passenger?.Firstname,
                                                    passenger?.Surname,
                                                    passengerIndex,
                                                    index
                                                  ) !== undefined
                                                    ? (findPassengerSelectedSeat(
                                                        passenger?.Firstname,
                                                        passenger?.Surname,
                                                        passengerIndex,
                                                        index
                                                      )?.rowNumber as number) +
                                                      (findPassengerSelectedSeat(
                                                        passenger?.Firstname,
                                                        passenger?.Surname,
                                                        passengerIndex,
                                                        index
                                                      )?.seatNumber as string)
                                                    : ''}
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="xl:not-sr-only	xs:sr-only">
                    <div className="mt-6">
                      <div className="xl:w-5/6 xl:m-auto xl:pl-0 xl:pt-4 gap-10">
                        <StepsInfo selected={2} />
                      </div>
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
                            <div className="xl:w-5/6 xl:m-auto xl:py-2 xs:pt-20">
                              <div>
                                <div className="flex justify-between items-center xl:py-0 xs:py-3 xs:px-3">
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
                                        modifySeat
                                          ? modifyDataFromBooking
                                            ? router.push('/bookingcomplete')
                                            : router.push('/modifybooking')
                                          : modifyData || modifyDataFromBooking
                                          ? router.push('/passengerdetails')
                                          : router.push('/passengerdetails');
                                        if (modifyData || modifyDataFromBooking || modifySeat) {
                                          dispatch(setModifySeat(false));
                                          dispatch(setChooseSeatData([]));
                                          dispatch(setSelectSeatLaterData(false));
                                          modifySeat &&
                                            modifyDataFromBooking &&
                                            dispatch(setModifyBookingFromBooking(false));
                                        }
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
                                  <div className="xl:not-sr-only	xs:sr-only">
                                    <div
                                      // onClick={() => submitSeatSelecttion('selectSeatLater')}
                                      className="cursor-pointer"
                                    >
                                      <p className="text-pearlgray hover:text-black text-base font-medium">
                                        {/* {getFieldName(chooseSeatsContent, 'selectSeatLater')} */}
                                        {/* hide-modify-button */}
                                        {/* <div className="border-aqua border py-2 px-3 rounded-md flex gap-2">
                                          <FontAwesomeIcon
                                            icon={faEdit}
                                            aria-hidden="true"
                                            className="text-aqua text-sm font-black h-4 w-4"
                                          />
                                          <span className="font-extrabold text-xs text-aqua">
                                            Modify Search
                                          </span>
                                        </div> */}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    className="xs:not-sr-only	xl:sr-only"
                                    onClick={() => {
                                      setShowModal(true);
                                      document.body.style.overflow = 'hidden';
                                    }}
                                  >
                                    <ShowSeatDetailsHeading index={index} />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="my-3 xs:px-3">
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
                                <div className="mb-2">
                                  <div className="px-3">
                                    <p className="text-pearlgray font-medium text-base">
                                      {selectedPerson?.Firstname?.charAt(0)?.toUpperCase() +
                                        selectedPerson?.Firstname?.slice(1)?.toLowerCase()?.trim() +
                                        ' ' +
                                        selectedPerson?.Surname?.charAt(0)?.toUpperCase() +
                                        selectedPerson?.Surname?.slice(1)?.toLowerCase()?.trim()}
                                    </p>
                                    <h1 className="text-xl font-extrabold  text-pearlgray">
                                      {index === 0
                                        ? modifySeat
                                          ? (findCodeInModifySeat(0, 'OriginCode')
                                              ? findCodeInModifySeat(0, 'OriginCode')
                                              : '') +
                                            ' - ' +
                                            (findCodeInModifySeat(0, 'DestinationCode')
                                              ? findCodeInModifySeat(0, 'DestinationCode')
                                              : '')
                                          : (selectedFlight?.details?.OriginCode
                                              ? selectedFlight?.details?.OriginCode
                                              : '') +
                                            ' - ' +
                                            (selectedFlight?.details?.DestinationCode
                                              ? selectedFlight?.details?.DestinationCode
                                              : '')
                                        : modifySeat
                                        ? (findCodeInModifySeat(0, 'DestinationCode')
                                            ? findCodeInModifySeat(0, 'DestinationCode')
                                            : '') +
                                          ' - ' +
                                          (findCodeInModifySeat(0, 'OriginCode')
                                            ? findCodeInModifySeat(0, 'OriginCode')
                                            : '')
                                        : (selectedFlight?.details?.DestinationCode
                                            ? selectedFlight?.details?.DestinationCode
                                            : '') +
                                          ' - ' +
                                          (selectedFlight?.details?.OriginCode
                                            ? selectedFlight?.details?.OriginCode
                                            : '')}{' '}
                                      {index === 0
                                        ? '(' + getFieldName(chooseSeatsContent, 'outbound') + ')'
                                        : '(' + getFieldName(chooseSeatsContent, 'return') + ')'}
                                    </h1>
                                  </div>
                                </div>
                                <div>
                                  <div className="overflow-x-hidden">
                                    <div className="xl:flex xl:gap-6">
                                      <div className="bg-white rounded-lg p-5 xl:w-3/5 xs:w-11/12  m-auto relative">
                                        <div>
                                          <Image
                                            src={leftbg}
                                            className="h-full whileimg rounded-lg absolute xl:left-0 xs:-left-12 object-contain"
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <Image
                                            src={rightbg}
                                            className="h-full whileimg rounded-lg absolute xl:right-0 xs:-right-12 object-contain"
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="grid grid-cols-5  gap-2 xl:w-3/4 xl:m-auto border-l-4 border-r-4  border-slategray pl-5 pr-6 relative">
                                            {item?.Decks?.map(
                                              (decks: {
                                                Areas: {
                                                  Rows: {
                                                    Columns: {
                                                      Seats: flightSeat[];
                                                    }[];
                                                    RowNumber: number;
                                                    LeftSideTypeCode: string;
                                                    RightSideTypeCode: string;
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
                                                      LeftSideTypeCode: string;
                                                      RightSideTypeCode: string;
                                                    }[];
                                                  }) =>
                                                    areas?.Rows?.map(
                                                      (rows: {
                                                        Columns: {
                                                          Seats: flightSeat[];
                                                        }[];
                                                        RowNumber: number;
                                                        LeftSideTypeCode: string;
                                                        RightSideTypeCode: string;
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
                                                                      style={{
                                                                        width: '50px',
                                                                        margin: 'auto',
                                                                      }}
                                                                      onClick={() => {
                                                                        if (
                                                                          ((rows?.LeftSideTypeCode ===
                                                                            'Exit' &&
                                                                            columnsIndex === 0 &&
                                                                            (seatsIndex === 0 ||
                                                                              seatsIndex === 1)) ||
                                                                            (rows?.RightSideTypeCode ===
                                                                              'Exit' &&
                                                                              columnsIndex === 1 &&
                                                                              (seatsIndex + 1 ===
                                                                                seatsData?.length ||
                                                                                seatsIndex ===
                                                                                  0))) &&
                                                                          seats?.IsAvailable !==
                                                                            undefined &&
                                                                          seats?.IsAvailable
                                                                        ) {
                                                                          setEmergencySeat({
                                                                            showModal: true,
                                                                            mapIndex: index,
                                                                            rowNumber:
                                                                              rows?.RowNumber,
                                                                            seatLetter:
                                                                              seats?.Letter,
                                                                            isAvailable:
                                                                              seats?.IsAvailable as boolean,
                                                                            seats: seats,
                                                                            aircraftName:
                                                                              item?.AircraftName,
                                                                            refSegment:
                                                                              item?.RefSegment,
                                                                          });
                                                                        } else {
                                                                          onSeatSelect(
                                                                            index,
                                                                            rows?.RowNumber,
                                                                            seats?.Letter,
                                                                            seats?.IsAvailable as boolean,
                                                                            seats,
                                                                            item?.AircraftName,
                                                                            item?.RefSegment
                                                                          );
                                                                        }
                                                                      }}
                                                                    >
                                                                      <div
                                                                        className="relative d-flex justify-center"
                                                                        style={{ width: '50px' }}
                                                                      >
                                                                        <Image
                                                                          className={` w-16 h-14 md:w-14 xs:w-14 object-contain   ${
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
                                                                              ? prepareFlightDetails?.EMDTicketFareOptions?.find(
                                                                                  (dt: {
                                                                                    AncillaryCode: string;
                                                                                  }) =>
                                                                                    dt?.AncillaryCode ===
                                                                                    seats?.AssociatedAncillaryCode
                                                                                )?.Label ===
                                                                                  'Premium' ||
                                                                                prepareFlightDetails?.EMDTicketFareOptions?.find(
                                                                                  (dt: {
                                                                                    AncillaryCode: string;
                                                                                  }) =>
                                                                                    dt?.AncillaryCode ===
                                                                                    seats?.AssociatedAncillaryCode
                                                                                )?.Label ===
                                                                                  'Premium.'
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
                                                                        {rows?.LeftSideTypeCode ===
                                                                          'Exit' &&
                                                                          columnsIndex === 0 &&
                                                                          seatsIndex === 0 && (
                                                                            <div className="absolute -left-4 top-4">
                                                                              <Image
                                                                                src={arrowleft}
                                                                                className=" h-4 w-4  "
                                                                                alt=""
                                                                              />
                                                                            </div>
                                                                          )}
                                                                        {rows?.RightSideTypeCode ===
                                                                          'Exit' &&
                                                                          columnsIndex === 1 &&
                                                                          seatsIndex + 1 ===
                                                                            seatsData?.length && (
                                                                            <div className="h-4 w-4 absolute -right-5 top-4">
                                                                              <Image
                                                                                src={arrowright}
                                                                                className="h-4 w-4 "
                                                                                alt=""
                                                                              />
                                                                            </div>
                                                                          )}
                                                                        <div className="absolute -top-1.5 bottom-0 right-0 mx-auto left-0 flex items-center justify-center xl:text-center">
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
                                      <div className="  xl:w-2/5">
                                        <div className="xl:not-sr-only	xs:sr-only">
                                          <ShowSeatDetails index={index} isMobile={false} />
                                        </div>
                                        <div className="xl:not-sr-only	xs:sr-only">
                                          <div className=" gap-3 justify-between p-5 bg-white rounded-lg">
                                            <div className="flex  xl:gap-4 xs:gap-2 border border-cadetgray w-full px-2 py-2 mb-2 rounded">
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
                                              </div>
                                            </div>
                                            <div className="flex items-center  xl:gap-4 xs:gap-2 border border-cadetgray w-full px-2 py-2 mb-2 rounded">
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
                                              </div>
                                            </div>
                                            <div className="flex  xl:gap-4 xs:gap-2 border border-cadetgray w-full px-2 py-2 mb-2 rounded">
                                              <Image
                                                className="xl:w-8 xs:w-4 object-contain "
                                                src={getImageSrc(chooseSeatsContent, 'blueSeat')}
                                                alt=""
                                                height={40}
                                                width={40}
                                              />
                                              <div>
                                                <p className="text-sm text-medium text-pearlgray">
                                                  Selected
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex items-center xl:gap-4 xs:gap-1 border border-cadetgray w-full px-2 py-2 mb-2 rounded">
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
                                            <div className="flex items-center xl:gap-4 xs:gap-1 border border-cadetgray w-full px-2 py-2 rounded">
                                              <Image src={arrowleft} className="h-6 w-6 " alt="" />
                                              <div>
                                                <p className="text-sm text-medium text-pearlgray">
                                                  Emergency Exit Row
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" xl:w-3/5 xs:w-full">
                                      <div className="xs:not-sr-only	xl:sr-only">
                                        <div className=" bg-white p-2  border-Silvergray border-t-2 ">
                                          <div className="flex justify-center items-center flex-wrap gap-3 bg-white shadow-sm">
                                            <div className=" ">
                                              <div className="flex justify-center">
                                                <div className="w-full" id="detailElem">
                                                  <div
                                                    className="w-full justify-center text-dark flex  px-4 py-3 "
                                                    onClick={() => setShowLegend(!showLegend)}
                                                  >
                                                    <Image
                                                      src={showLegend ? arowdown : arrowup}
                                                      className="h-5 w-6"
                                                      alt="arrow"
                                                    />
                                                    <p className="font-black text-sm text-pearlgray">
                                                      {showLegend
                                                        ? 'Minimise Legend'
                                                        : 'Maximise Legend'}
                                                    </p>
                                                    <Image
                                                      src={showLegend ? arowdown : arrowup}
                                                      className="h-5 w-6 "
                                                      alt="arrow"
                                                    />
                                                  </div>
                                                  {showLegend && (
                                                    <div className="px-4 py-3 flex flex-wrap gap-3">
                                                      <div className="flex  xl:gap-4 xs:gap-2 border border-cadetgray  px-3 py-2 mb-2 rounded">
                                                        <Image
                                                          className="xl:w-8 xs:w-4 object-contain "
                                                          src={getImageSrc(
                                                            chooseSeatsContent,
                                                            'orangeSeat'
                                                          )}
                                                          alt=""
                                                          height={40}
                                                          width={40}
                                                        />
                                                        <div>
                                                          <p className="text-sm text-medium text-pearlgray">
                                                            {getFieldName(
                                                              chooseSeatsContent,
                                                              'ottoman'
                                                            )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="flex items-center  xl:gap-4 xs:gap-2 border border-cadetgray  px-3 py-2 mb-2 rounded">
                                                        <Image
                                                          className=" xl:w-8 xs:w-4 object-contain "
                                                          src={getImageSrc(
                                                            chooseSeatsContent,
                                                            'greySeat'
                                                          )}
                                                          alt=""
                                                          height={40}
                                                          width={40}
                                                        />
                                                        <div>
                                                          <p className="text-sm text-medium text-pearlgray">
                                                            {getFieldName(
                                                              chooseSeatsContent,
                                                              'premium'
                                                            )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="flex  xl:gap-4 xs:gap-2 border border-cadetgray  px-3 py-2 mb-2 rounded">
                                                        <Image
                                                          className="xl:w-8 xs:w-4 object-contain "
                                                          src={getImageSrc(
                                                            chooseSeatsContent,
                                                            'blueSeat'
                                                          )}
                                                          alt=""
                                                          height={40}
                                                          width={40}
                                                        />
                                                        <div>
                                                          <p className="text-sm text-medium text-pearlgray">
                                                            Selected
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="flex items-center xl:gap-4 xs:gap-1 border border-cadetgray  px-3 py-2 mb-2 rounded">
                                                        <Image
                                                          className=" xl:w-8 xs:w-4 object-contain opacity-30"
                                                          src={getImageSrc(
                                                            chooseSeatsContent,
                                                            'greySeat'
                                                          )}
                                                          alt=""
                                                          height={40}
                                                          width={40}
                                                        />
                                                        <div>
                                                          <p className="text-sm text-medium text-pearlgray">
                                                            {getFieldName(
                                                              chooseSeatsContent,
                                                              'unavailable'
                                                            )}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="flex items-center xl:gap-4 xs:gap-1 border border-cadetgray  px-3 py-2 rounded">
                                                        <Image
                                                          src={arrowleft}
                                                          className="h-6 w-6 "
                                                          alt=""
                                                        />
                                                        <div>
                                                          <p className="text-sm text-medium text-pearlgray">
                                                            Emergency Exit Row
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          {showModal && (
                                            <div
                                              style={{ display: 'flex' }}
                                              className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
                                              id="show-seat-details"
                                            >
                                              <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
                                                <div className="relative bg-white rounded-lg shadow    calendar-modal">
                                                  <div className="py-5 px-4 ">
                                                    <FontAwesomeIcon
                                                      icon={faXmark}
                                                      aria-hidden="true"
                                                      className="arrow-modal cursor-pointer text-black"
                                                      onClick={() => {
                                                        setShowModal(false);
                                                        document.body.style.overflow = 'unset';
                                                      }}
                                                    />
                                                    <div>
                                                      <ShowSeatDetails
                                                        index={index}
                                                        isMobile={true}
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="py-5 flex gap-2 xl:pl-0 xs:pl-3 xs:pr-3">
                                        <button
                                          type="button"
                                          className="gap-2 w-full xs:justify-center xs:text-center text-aqua bg-cadetgray  rounded-lg text-sm inline-flex items-center px-5 py-3 text-center border border-aqua"
                                          onClick={() => {
                                            setSelectSeatLater(true);
                                            document.body.style.overflow = 'hidden';
                                          }}
                                        >
                                          {getFieldName(chooseSeatsContent, 'selectSeatLater')}
                                        </button>
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
