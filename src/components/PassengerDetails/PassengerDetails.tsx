import * as Yup from 'yup';
import Image from 'next/image';
import { AnyAction } from 'redux';
import Select from 'react-select';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { Accordion } from 'flowbite-react';
import IntlTelInput from 'react-intl-tel-input';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Field, Formik, FieldArray, ErrorMessage } from 'formik';
import { faAngleLeft, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'src/redux/store';
import { calculateDob } from './CalculateDob';
import info from '../../assets/images/info.png';
import StepsInfo from '../SearchFlight/StepsInfo';
import { loader } from 'src/redux/reducer/Loader';
import YoungAgeModal from '../Modal/YoungAgeModal';
import AdultAgeModal from '../Modal/AdultAgeModal';
import DateOfBirthModal from '../Modal/DateOfBirthModal';
import SavingDataLoader from 'components/Loader/SavingData';
import ErrorMessages from 'components/Toaster/ErrorMessages';
import { fieldsWithName, fieldsWithCode } from './FieldsData';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import { civilityCodeOptions } from '../Select/SelectOptions';
import SavingExpLoader from 'components/Loader/SavingExpLoader';
import DepartReturnDateModal from '../Modal/DepartReturnDateModal';
import { postModifyBookingSeats } from 'src/redux/action/SearchFlights';
import { setPassengerDetails } from 'src/redux/reducer/PassengerDetails';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';
import { setChooseSeatData, setSelectedMeal } from 'src/redux/reducer/FlightDetails';

const PassengerDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const optionalFields = ['Middlename'];

  const modifyDataFromBooking = useSelector(
    (state: RootState) => state?.flightDetails?.modifyDataFromBooking
  );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const passengerDetailsContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerDetails?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const selectedDetailsForFlight = useSelector(
    (state: RootState) => state?.flightDetails?.selectedFlightCodesWithDate
  );
  const searchFlightPayload = useSelector(
    (state: RootState) => state?.flightDetails?.reviewFlight?.OriginDestinations
  );
  const { originDetails } = useSelector((state: RootState) => state?.airportDetails);
  const modifyMeal = useSelector((state: RootState) => state?.flightDetails?.modifyMeal);
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const choosenSeats = useSelector((state: RootState) => state?.flightDetails?.chooseSeats);
  const selectedMeal = useSelector((state: RootState) => state?.flightDetails?.selectedMeal);
  const storedPassengerData = useSelector((state: RootState) => state?.passenger?.passengersData);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);
  const prepareFlightDetails = useSelector((state: RootState) =>
    modifyMeal
      ? state?.flightDetails?.prepareBookingModification
      : !modifyData && !modifyDataFromBooking
      ? state?.flightDetails?.prepareFlight
      : state?.flightDetails?.prepareExchangeFlight
  );
  // const chooseSeatsContent = useSelector((state: RootState) => state?.sitecore?.chooseSeat?.fields);

  const { adult, children, returnDate, originCode, departDate, dateFlexible, destinationCode } =
    selectedDetailsForFlight;

  const [tabIndex, setTabIndex] = useState(0);
  const [offerUpdate, setOfferUpdates] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    status: 0,
    message: '',
  });
  const [showModal, setShowModal] = useState({
    young: false,
    adult: false,
    depart: false,
    return: false,
  });
  const [changeIndex, setChangeIndex] = useState({
    index: 0,
    name: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    departure: '',
    returnDate: '',
  });
  const [flightDetails, setFlightDetails] = useState({
    departDate: new Date(departDate),
    returnDate: new Date(returnDate),
    dateFlexible: dateFlexible,
  });
  const [dateModal, setDateModal] = useState(false);
  const [displayError, setDisplayError] = useState(true);
  const [mealSelected, setMealSelected] = useState<mealObjectKeys[]>(
    selectedMeal ? selectedMeal : []
  );
  const [passengerValues, setPassengerValues] = useState<detailsObj[]>(
    storedPassengerData && storedPassengerData?.details
      ? storedPassengerData?.details?.slice(0, adult + (children ? children : 0))
      : []
  );
  const [ageChangesAccecpted, setAgeChangesAccecpted] = useState<number[]>([]);

  const countryCode = originDetails
    ?.find((item: { iata: string }) => item?.iata === originCode)
    ?.country?.toLowerCase();

  const nameFields = prepareFlightDetails?.Passengers
    ? prepareFlightDetails?.Passengers?.find((item: { NameElement: object }) => item?.NameElement)
    : undefined;

  const finalNameFields = Object.keys(nameFields ? (nameFields?.NameElement as object) : {})
    ?.map((item) => fieldsWithName?.find((dt) => dt?.name === item))
    ?.filter((item) => item !== undefined);

  const fields = prepareFlightDetails?.PassengersDetails?.map(
    (item: { fields: { Code: string }[] }) => {
      const fieldsData = item?.fields?.map((fieldItem) => {
        const findFieldData = fieldsWithCode?.find(
          (dt) => fieldItem?.Code !== 'CTCH' && dt?.Code === fieldItem?.Code
        );
        return findFieldData ? { ...fieldItem, ...findFieldData } : undefined;
      });
      return fieldsData;
    }
  )
    ?.filter((item: object) => item !== undefined)
    ?.map((dt: { Code: string }[]) => {
      const filterList = dt.filter(
        (item: { Code: string }, index: number, arr: { Code: string }[]) => {
          const checkDuplicate =
            index !== arr?.findIndex((dt: { Code: string }) => dt?.Code === item?.Code);
          if (!checkDuplicate) {
            return item;
          }
        }
      );
      return filterList;
    });

  const findMobileField = fields?.map((item: { name: string }[]) => {
    const findField = item?.find((item: { name: string }) => item?.name === 'Mobile');
    return findField;
  });

  // const findHomeContactField = fields?.map((item: { name: string }[]) => {
  //   const findField = i/
  const passengerDetail = useSelector(
    (state: RootState) =>
      modifyMeal
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
        !modifyData && !modifyDataFromBooking
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
    // ?.map(({ undefined: {}, ...rest }) => ({ ...rest }))
  );

  const allMealData = useSelector((state: RootState) =>
    modifyMeal
      ? state?.flightDetails?.prepareBookingModification?.MealsDetails
      : !modifyData && !modifyDataFromBooking
      ? state?.flightDetails?.prepareFlight?.MealsDetails
      : state?.flightDetails?.prepareExchangeFlight?.MealsDetails
  );

  const seatMaps = useSelector((state: RootState) =>
    modifyMeal
      ? state?.flightDetails?.prepareBookingModification?.SeatMaps
      : !modifyData && !modifyDataFromBooking
      ? state?.flightDetails?.prepareFlight?.SeatMaps
      : state?.flightDetails?.prepareExchangeFlight?.SeatMaps
  );

  const tripData = useSelector((state: RootState) =>
    !modifyData && !modifyDataFromBooking
      ? state?.flightDetails?.selectedFlight?.details?.FaireFamilies?.map(
          (item: { originCity: string }) => {
            return Object.keys(item)?.reduce((a, b) => {
              a[(b?.charAt(0)?.toUpperCase() + b?.slice(1)) as keyof { originCity: string }] =
                item[b as keyof { originCity: string }];
              return a;
            }, {} as { originCity: string });
          }
        )
      : state?.flightDetails?.modifyBooking?.OriginDestination
  );

  const flightWay = useSelector((state: RootState) =>
    modifyMeal
      ? state?.flightDetails?.modifyBooking?.OriginDestination
      : !modifyData && !modifyDataFromBooking
      ? state?.flightDetails?.reviewFlight?.OriginDestinations
      : state?.flightDetails?.modifyBooking?.OriginDestination
  );

  const mealTypeChecked = (mealLabel: string, tripIndex: number) => {
    return mealSelected?.find((meal) => meal?.passengerIndex === tabIndex)
      ? tripIndex === 0
        ? mealSelected?.find((meal) => meal?.passengerIndex === tabIndex)?.originMeal === mealLabel
          ? true
          : false
        : mealSelected?.find((meal) => meal?.passengerIndex === tabIndex)?.returnMeal === mealLabel
        ? true
        : false
      : false;
  };

  const mealTypeChange = (
    mealLabel: string,
    tripIndex: number,
    values: {
      details: detailsObj[];
    }
  ) => {
    mealSelected?.find((meal) => meal?.passengerIndex === tabIndex)
      ? setMealSelected(
          mealSelected?.map((dt) => {
            return dt?.passengerIndex === tabIndex
              ? {
                  originMeal: tripIndex === 0 ? mealLabel : dt?.originMeal,
                  originMealCode: tripIndex === 0 ? '' : dt?.originMealCode,
                  returnMeal: tripIndex === 0 ? dt?.returnMeal : mealLabel,
                  returnMealCode: tripIndex === 0 ? dt?.returnMealCode : '',
                  passengerName:
                    values?.details[tabIndex]?.Firstname?.length > 0
                      ? values?.details[tabIndex]?.Firstname
                      : passengerDetail && passengerDetail[tabIndex]?.Firstname?.length > 0
                      ? passengerDetail[tabIndex]?.Firstname
                      : '',
                  passengerIndex: tabIndex,
                }
              : dt;
          })
        )
      : setMealSelected((prev) => [
          ...prev,
          {
            originMeal: tripIndex === 0 ? mealLabel : '',
            originMealCode: '',
            returnMeal: tripIndex === 0 ? '' : mealLabel,
            returnMealCode: '',
            passengerName:
              values?.details[tabIndex]?.Firstname?.length > 0
                ? values?.details[tabIndex]?.Firstname
                : passengerDetail && passengerDetail[tabIndex]?.Firstname?.length > 0
                ? passengerDetail[tabIndex]?.Firstname
                : '',
            passengerIndex: tabIndex,
          },
        ]);
  };

  const refSegmentDeparture = seatMaps?.find(
    (item: object, index: number) => item !== undefined && index === 0
  )?.RefSegment;

  const refSegmentArrival = seatMaps?.find(
    (item: object, index: number) => item !== undefined && index === 1
  )?.RefSegment;

  const mealToDisplay = (
    allMealData !== undefined && allMealData?.length > 0 ? allMealData[tabIndex]?.fields : []
  )
    ?.map(
      (item: {
        fields: {
          Code: string;
          Label: string;
        }[];
      }) => item
    )
    ?.flat(1);

  const departureMealData = mealToDisplay?.filter(
    (item: { RefSegment: string }) => item?.RefSegment === refSegmentDeparture
  );
  const returnMealData = mealToDisplay?.filter(
    (item: { RefSegment: string }) => item?.RefSegment !== refSegmentDeparture
  );

  const mealCodeChecked = (
    index: number,
    originData: string,
    returnData: string,
    mealValue: string
  ) => {
    return mealSelected?.find((item) =>
      item?.passengerIndex === tabIndex && index === 0
        ? item[originData as keyof mealObjectKeys] === mealValue
        : item?.passengerIndex === tabIndex &&
          item[returnData as keyof mealObjectKeys] === mealValue
    );
  };

  const dietaryMealChange = (
    codeValue: string,
    tripIndex: number,
    values: {
      details: detailsObj[];
    }
  ) => {
    setMealSelected(
      mealSelected?.map((data) => {
        return data?.passengerIndex === tabIndex
          ? {
              originMeal: data?.originMeal,
              originMealCode: tripIndex === 0 ? codeValue : data?.originMealCode,
              returnMeal: data?.returnMeal,
              returnMealCode: tripIndex === 0 ? data?.returnMealCode : codeValue,
              passengerName:
                values?.details[tabIndex]?.Firstname?.length > 0
                  ? values?.details[tabIndex]?.Firstname
                  : passengerDetail && passengerDetail[tabIndex]?.Firstname?.length > 0
                  ? passengerDetail[tabIndex]?.Firstname
                  : '',
              passengerIndex: tabIndex,
            }
          : data;
      })
    );
  };

  const phoneValidation = fields?.map((_fieldItem: { name: string }[], fieldIndex: number) => {
    const validationData = [
      'Mobile',
      // 'Homecontact',
      'Mobile',
      // 'Homecontact',
      'Mobile',
      // 'Homecontact',
    ]
      ?.map((item, index) => {
        if (
          index === 0 &&
          findMobileField?.length &&
          findMobileField[fieldIndex] &&
          item === findMobileField[fieldIndex]?.name
        ) {
          return {
            name: 'validMobile',
            validation: Yup.string().required('Phone number is not valid'),
          };
        }
        // else if (
        //   index === 1 &&
        //   findHomeContactField?.length &&
        //   findHomeContactField[fieldIndex] &&
        //   item === findHomeContactField[fieldIndex]?.name
        // ) {
        //   return {
        //     name: 'validHomeContact',
        //     validation: Yup.string().required('Phone number is not valid'),
        //   };
        // }
        else if (
          index === 1 &&
          findMobileField?.length &&
          findMobileField[fieldIndex] &&
          item === findMobileField[fieldIndex]?.name
        ) {
          return {
            name: 'flagMobile',
          };
        }
        // else if (
        //   index === 3 &&
        //   findHomeContactField?.length &&
        //   findHomeContactField[fieldIndex] &&
        //   item === findHomeContactField[fieldIndex]?.name
        // ) {
        //   return {
        //     name: 'flagHomeContact',
        //   };
        // }
        else if (
          index === 2 &&
          findMobileField?.length &&
          findMobileField[fieldIndex] &&
          item === findMobileField[fieldIndex]?.name
        ) {
          return {
            name: 'dialCodeMobile',
          };
        }
        // else if (
        //   index === 5 &&
        //   findHomeContactField?.length &&
        //   findHomeContactField[fieldIndex] &&
        //   item === findHomeContactField[fieldIndex]?.name
        // ) {
        //   return {
        //     name: 'dialCodeHomeContact',
        //   };
        // }
      })
      ?.filter((item) => item !== undefined);
    return validationData;
  });

  const passengerData = useSelector((state: RootState) =>
    modifyMeal
      ? state?.flightDetails?.prepareBookingModification?.Passengers
      : !modifyData && !modifyDataFromBooking
      ? state?.passenger?.passengersData?.details
      : state?.flightDetails?.prepareExchangeFlight?.Passengers
  );

  const adultCount = passengerData?.filter(
    (dt: { PassengerTypeCode: string }) => dt?.PassengerTypeCode === 'AD'
  )?.length;

  const childCount = passengerData?.filter(
    (dt: { PassengerTypeCode: string }) => dt?.PassengerTypeCode === 'CHD'
  )?.length;

  const passengerDetails = [
    ...new Array(
      modifyMeal || modifyData || modifyDataFromBooking
        ? adultCount
          ? adultCount
          : 1
        : adult
        ? adult
        : 1
    )?.fill(getFieldName(passengerDetailsContent, 'adult')),
    ...new Array(
      modifyMeal || modifyData || modifyDataFromBooking
        ? childCount
          ? childCount
          : 0
        : children
        ? children
        : 0
    )?.fill(getFieldName(passengerDetailsContent, 'child')),
  ];

  const submitBtn = (
    name: string,
    values: {
      details: detailsObj[];
    },
    setErrors: {
      (arg0: object): void;
    },
    setTouched: {
      (arg0: object, arg1: boolean): void;
    },
    index: number,
    changeIndex?: number
  ) => {
    if (validateValues(values?.details, index)) {
      if (
        values?.details[index]?.Dob?.length > 0 &&
        calculateDob(values?.details[index]?.Dob) < 5
      ) {
        setShowModal({
          young: true,
          adult: false,
          depart: false,
          return: false,
        });
        document.body.style.overflow = 'hidden';
      } else if (
        !ageChangesAccecpted?.includes(index) &&
        passengerDetails[index] === 'Child' &&
        values?.details[index]?.Dob?.length > 0 &&
        calculateDob(values?.details[index]?.Dob) > 11
      ) {
        setDisplayError(false);
        setShowModal({
          young: false,
          adult: true,
          depart: false,
          return: false,
        });
        document.body.style.overflow = 'hidden';
        setChangeIndex({
          name: name,
          index: name === 'changeTab' ? (changeIndex as number) : index,
        });
        setTimeout(() => {
          removeErrors(setErrors, setTouched);
        }, 100);
      } else {
        if (name === 'next' || name === 'previous' || name === 'changeTab') {
          setDisplayError(false);
          name === 'changeTab'
            ? setTabIndex(changeIndex as number)
            : setTabIndex((prev) => (name === 'next' ? prev + 1 : prev - 1));
          setTimeout(() => {
            removeErrors(setErrors, setTouched);
          }, 100);
        } else {
          finalSubmit(values);
        }
        setPassengerValues(values?.details);
      }
    } else {
      name === 'previous' && setTabIndex((prev) => prev - 1);
      name === 'changeTab' && setTabIndex(changeIndex as number);
    }
  };

  const removeErrors = (
    setErrors: {
      (arg0: object): void;
    },
    setTouched: {
      (arg0: object, arg1: boolean): void;
    }
  ) => {
    setErrors({});
    setTouched({}, false);
    setDisplayError(true);
  };

  const validateValues = (values: detailsObj[], index: number) => {
    const checkLength =
      values && values[index]
        ? Object.keys(values[index])?.map((item) =>
            !optionalFields?.includes(item)
              ? values[index][item as keyof detailsObj]?.length
              : undefined
          )
        : [];
    const findLengthZero =
      modifyMeal || modifyData || modifyDataFromBooking
        ? undefined
        : checkLength?.filter((item) => item !== undefined)?.find((item) => item === 0);

    return findLengthZero !== undefined ? false : checkValuesForMeals(index) ? true : false;
  };

  const finalSubmit = (values: { details: detailsObj[] }) => {
    dispatch(
      loader({
        show: true,
        name: modifyMeal ? 'save' : 'seats',
      })
    );
    if (modifyMeal) {
      const allSeats = modifyBookingInfo?.PassengersDetails?.map(
        (item: { fields: { Code: string }[] }) =>
          item?.fields
            ?.filter((item: { Code: string }) => item?.Code === 'SEAT')
            ?.map((item) => item)
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
          const passengerInfo = passengerDetail?.find(
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
          const passengerInfo = passengerDetail?.find(
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

      const selectSeat: seatDetails[] = modifyMeal
        ? seatDataWithPassengerInfo && seatDataWithPassengerInfo?.length > 0
          ? seatDataWithPassengerInfo
          : []
        : choosenSeats?.length > 0
        ? choosenSeats
        : [];

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
      const departure = mealSelected?.filter(
        (item: { originMealCode: string }) => item?.originMealCode?.length > 0
      );
      const arrival = mealSelected?.filter(
        (item: { returnMealCode: string }) => item?.returnMealCode?.length > 0
      );
      const dataToPost = passengerDetail?.map(
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
                Firstname: item.Firstname,
                Surname: item.Surname,
              },
            ],
          };
        }
      );
      dispatch(setSelectedMeal(mealSelected)); //meal data
      dispatch(
        postModifyBookingSeats(
          {
            booking: dataToPost,
            PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
            PassengerName: passengerDetail !== undefined ? passengerDetail[0].Surname : '',
            SeatMap: {
              departure:
                seatData && seatData?.length > 0
                  ? seatData?.slice(0, passengerDetail?.length)?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                  : [],
              arrival:
                seatData && seatData?.length > 0
                  ? seatData
                      ?.slice(passengerDetail?.length, seatData?.length)
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
                        const findPassengerIndex = passengerDetail?.findIndex(
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
                          Label: findData?.Label,
                          RefPassenger: findData?.RefPassenger,
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
                        const findPassengerIndex = passengerDetail?.findIndex(
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
                          Label: findData?.Label,
                          RefPassenger: findData?.RefPassenger,
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
    } else {
      dispatch(setChooseSeatData([]));
      dispatch(setPassengerDetails(values));
      dispatch(setSelectedMeal(mealSelected));
      router.push('/chooseseats');
      setTimeout(() => {
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      }, 2000);
    }
  };

  // const checkValueForOneWay = (index: number) => {
  //   const checkData = mealSelected?.find((meal) => meal?.passengerIndex === index);
  //   return (
  //     checkData !== undefined &&
  //     tripData?.length === 1 &&
  //     (checkData?.originMeal === 'Regular Meal' ||
  //       (checkData?.originMeal === 'Dietary Meal' && checkData?.originMealCode?.length > 0))
  //   );
  // };

  const checkValuesForMeals = (index: number) => {
    const checkData = mealSelected?.find((meal) => meal?.passengerIndex === index);
    return checkData === undefined
      ? true
      : tripData?.length > 1
      ? (checkData?.originMeal?.length === 0 ||
          checkData?.originMeal === 'Regular Meal' ||
          (checkData?.originMeal === 'Dietary Meal' && checkData?.originMealCode?.length > 0)) &&
        (checkData?.returnMeal?.length === 0 ||
          checkData?.returnMeal === 'Regular Meal' ||
          (checkData?.returnMeal === 'Dietary Meal' && checkData?.returnMealCode?.length > 0))
      : checkData?.originMeal?.length === 0 ||
        checkData?.originMeal === 'Regular Meal' ||
        (checkData?.originMeal === 'Dietary Meal' && checkData?.originMealCode?.length > 0);
  };

  const initialValues = () => {
    return passengerDetails?.map((_item, index) => {
      return {
        ...Object.fromEntries(finalNameFields?.map((item) => [item?.name, ''])),
        ...Object.fromEntries(
          fields !== undefined && fields?.length > 0
            ? [...fields[index], ...phoneValidation[index]]?.map((item: { name: string }) => [
                item?.name,
                '',
              ])
            : []
        ),
      };
    });
  };

  const fieldsValidation = () => {
    return {
      ...Object.fromEntries(
        finalNameFields
          ?.filter((item) => item?.validation)
          ?.map((item) => [item?.name, item?.validation])
      ),
      ...Object.fromEntries(
        fields !== undefined && fields?.length > 0
          ? [...fields[tabIndex], ...phoneValidation[tabIndex]]?.map(
              (item: { name: string; validation: string | Yup.StringSchema<string> }) => [
                item?.name,
                item?.validation,
              ]
            )
          : []
      ),
    };
  };

  return (
    <main
      onClick={() => {
        const modalDob = document.getElementById('modal-dob');
        const modalDepart = document.getElementById('modal-depart');
        const modalReturn = document.getElementById('modal-return');
        const modalYoungAge = document.getElementById('modal-young-age');
        const modalAdultAge = document.getElementById('modal-adult-age');
        window.onclick = function (event) {
          if (event.target == modalDob) {
            setDateModal(false);
            document.body.style.overflow = 'unset';
          } else if (
            event.target == modalDepart ||
            event.target == modalReturn ||
            event.target === modalYoungAge ||
            event.target === modalAdultAge
          ) {
            setShowModal({
              young: false,
              adult: false,
              depart: false,
              return: false,
            });
            document.body.style.overflow = 'unset';
          }
        };
      }}
    >
      {!load?.show ? (
        <div className={`xl:left-0 inherit xl:top-14 w-full z-50`}>
          <ErrorMessages showToast={showToast} setShowToast={setShowToast} />
          <div className="relative w-full m-auto  xl:top-6  xs:absolute xs:top-24 items-center justify-center  gap-3 h-0   ">
            <div className="xl:not-sr-only	xs:sr-only">
              <div className="xl:w-1/4 xs:w-full">
                <div>
                  <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                    <Image
                      src={getImageSrc(searchFlightContent, 'desktopBanner') as string}
                      className="xs:absolute  inset-0 h-full w-full object-cover"
                      alt=""
                      height={200}
                      width={160}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="  inherit  xs:w-full xs:px-3  xl:w-3/4  z-30 xl:pt-10 xs:pt-0 ">
              <div className="xl:not-sr-only	xs:sr-only">
                <div className="xl:w-3/5 xl:m-auto xl:pl-12 xl:mt-12">
                  <StepsInfo selected={2} />
                </div>
              </div>
              <div className="lg:w-1/3  w-full rounded-lg xl:w-2/4 xl:m-auto xl:py-0 xl:mt-3 xs:mt-0 xs:pt-0 ">
                <DepartReturnDateModal
                  editDate={true}
                  closeModal={() => {
                    setShowModal({
                      young: false,
                      adult: false,
                      depart: false,
                      return: false,
                    });
                    document.body.style.overflow = 'unset';
                  }}
                  setShowModal={setShowModal}
                  errorMessage={errorMessage}
                  flightDetails={flightDetails}
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
                  dateFlexible={flightDetails?.dateFlexible}
                  name={showModal?.depart ? 'Departure' : 'Return'}
                  id={showModal?.depart ? 'modal-depart' : 'modal-return'}
                  oneway={searchFlightPayload?.length === 1 ? true : false}
                  showModal={showModal?.depart ? showModal?.depart : showModal?.return}
                  originCode={showModal?.depart ? originCode : destinationCode}
                  destinationCode={showModal?.depart ? destinationCode : originCode}
                />

                <div className="flex justify-between items-center xl:py-0 xs:py-3">
                  <div
                    onClick={() => {
                      modifyMeal || modifyData || modifyDataFromBooking
                        ? router.back()
                        : router.push('/flightavailability');
                    }}
                    className="xl:py-3 xs:py-0 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      aria-hidden="true"
                      className="text-black text-sm font-black h-4 w-4"
                    />
                    <span className="px-2 text-black text-sm font-black">
                      {getFieldName(passengerDetailsContent, 'backButton')}
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black  text-black">
                    {getFieldName(passengerDetailsContent, 'heading')}
                  </h1>
                </div>
                <div></div>
                <div>
                  <p  className="xs:w-full rounded-lg inline-flex xl:text-xl xs:text-sm font-normal text-black">
                    {getFieldName(passengerDetailsContent, 'infoProvided')}
                  </p>
                </div>
              </div>

              <div>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    details: passengerValues?.length > 0 ? passengerValues : initialValues(),
                  }}
                  validationSchema={Yup.object().shape({
                    details: Yup.array().of(Yup.object().shape(fieldsValidation())),
                  })}
                  onSubmit={(values, { setErrors, setTouched }) => {
                    if (tabIndex === values?.details?.length - 1) {
                      submitBtn('submit', values, setErrors, setTouched, tabIndex);
                    }
                  }}
                >
                  {({
                    values,
                    setErrors,
                    setTouched,
                    handleSubmit,
                    setFieldValue,
                    setFieldTouched,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div>
                          <div className="lg:w-w-1/3  w-full rounded-lg xl:w-2/4 xl:m-auto xl:py-3 xs:py-2">
                            <ul className="flex flex-wrap  text-sm font-medium text-center gap-2 ">
                              {modifyMeal ? (
                                <>
                                  {passengerDetail?.map(
                                    (item: { Firstname: string }, index: number) => (
                                      <li role="presentation" key={index}>
                                        <button
                                          className={`xl:w-full xs:w-full inline-block p-4  ${
                                            tabIndex === index
                                              ? 'inline-block py-2 px-3 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                                              : `borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white ${
                                                  checkValuesForMeals(index) ||
                                                  checkValuesForMeals(index - 1)
                                                    ? ''
                                                    : 'cursor-not-allowed'
                                                }`
                                          }`}
                                          onClick={() => {
                                            (checkValuesForMeals(index) ||
                                              checkValuesForMeals(index - 1)) &&
                                              setTabIndex(index);
                                          }}
                                          disabled={tabIndex === index}
                                          type="button"
                                        >
                                          <div className="flex gap-2 text-black items-center">
                                            <Image
                                              className="h-4 w-4 object-cover"
                                              src={
                                                tabIndex === index
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
                                            {item?.Firstname?.charAt(0)?.toUpperCase() +
                                              item?.Firstname?.slice(1)}
                                          </div>
                                        </button>
                                      </li>
                                    )
                                  )}
                                </>
                              ) : (
                                <>
                                  {passengerDetails?.map((item, index) => {
                                    return (
                                      <li key={index} role="presentation">
                                        <button
                                          className={`xl:w-full xs:w-full inline-block p-4  ${
                                            tabIndex === index
                                              ? ' inline-block py-2 px-2 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                                              : 'borbgder-transparent p-4 inline-block py-2 px-5  rounded-2xl font-medium bg-white text-black'
                                          } `}
                                          type="button"
                                          onClick={() => {
                                            if (
                                              values?.details?.length > 0 &&
                                              (validateValues(values?.details, index) ||
                                                validateValues(values?.details, index - 1))
                                            ) {
                                              submitBtn(
                                                'changeTab',
                                                values,
                                                setErrors,
                                                setTouched,
                                                tabIndex,
                                                index
                                              );
                                            }
                                          }}
                                        >
                                          <div className="flex gap-2 text-black items-center">
                                            <Image
                                              className="h-5 w-4 object-cover"
                                              src={
                                                tabIndex === index
                                                  ? getImageSrc(
                                                      passengerDetailsContent,
                                                      'passengerBlueLogo'
                                                    )
                                                  : passengerValues[index]?.Firstname?.length > 0
                                                  ? getImageSrc(
                                                      passengerDetailsContent,
                                                      'passengerOrangeLogo'
                                                    )
                                                  : getImageSrc(
                                                      passengerDetailsContent,
                                                      'passengerGreyLogo'
                                                    )
                                              }
                                              alt=""
                                              height={40}
                                              width={40}
                                            />
                                            <div>
                                              {passengerValues[index]?.Firstname?.length > 0
                                                ? passengerValues[index]?.Firstname?.charAt(
                                                    0
                                                  )?.toUpperCase() +
                                                  passengerValues[index]?.Firstname?.slice(1)
                                                    ?.toLowerCase()
                                                    ?.trim()
                                                : item +
                                                  ' ' +
                                                  (item === 'Child'
                                                    ? index - adult + 1
                                                    : index + 1)}
                                            </div>
                                          </div>
                                        </button>
                                      </li>
                                    );
                                  })}
                                </>
                              )}
                            </ul>
                          </div>
                          <div>
                            <YoungAgeModal
                              id="modal-young-age"
                              showModal={showModal?.young}
                              closeModal={() => {
                                setShowModal({
                                  young: false,
                                  adult: false,
                                  depart: false,
                                  return: false,
                                });
                                document.body.style.overflow = 'unset';
                              }}
                            />
                            <AdultAgeModal
                              id="modal-adult-age"
                              closeModal={() => {
                                setShowModal({
                                  young: false,
                                  adult: false,
                                  depart: false,
                                  return: false,
                                });
                                document.body.style.overflow = 'unset';
                              }}
                              tabIndex={tabIndex}
                              submitForm={() => {
                                finalSubmit(values);
                              }}
                              values={values?.details}
                              changeIndex={changeIndex}
                              setTabIndex={setTabIndex}
                              setShowModal={setShowModal}
                              showModal={showModal?.adult}
                              setPassengerValues={setPassengerValues}
                              ageChangesAccecpted={ageChangesAccecpted}
                              setAgeChangesAccecpted={setAgeChangesAccecpted}
                              lastIndex={tabIndex === values?.details?.length - 1}
                            />
                            <DateOfBirthModal
                              id="modal-dob"
                              type="passengerDetails"
                              index={tabIndex}
                              closeModal={() => {
                                setDateModal(false);
                                document.body.style.overflow = 'unset';
                              }}
                              showModal={dateModal}
                              setFieldValue={setFieldValue}
                              name={passengerDetails[tabIndex]}
                              selectedDate={values?.details[tabIndex]?.Dob}
                            />
                            <FieldArray
                              name="details"
                              render={() => (
                                <Fragment>
                                  {values?.details?.map(
                                    (_item, index) =>
                                      index === tabIndex && (
                                        <div
                                          key={index}
                                          className="lg:w-w-1/3 my-2 xs:my-5 w-full rounded-lg xl:w-2/4 xl:m-auto "
                                        >
                                          <div className="rounded-lg">
                                            <Accordion
                                              collapseAll={
                                                modifyMeal || modifyData || modifyDataFromBooking
                                                  ? true
                                                  : false
                                              }
                                              className="py-0 px-0"
                                            >
                                              <Accordion.Panel className="bg-white py-0 px-0 rounded-lg ">
                                                <Accordion.Title
                                                  className="border-none py-0 px-0"
                                                  disabled={
                                                    modifyMeal ||
                                                    modifyData ||
                                                    modifyDataFromBooking
                                                      ? true
                                                      : false
                                                  }
                                                >
                                                  <div>
                                                    <p className="font-medium text-xs text-slategray">
                                                      {passengerDetails[index]}
                                                    </p>
                                                    <h1 className="text-lg font-black text-black">
                                                      {getFieldName(
                                                        passengerDetailsContent,
                                                        'passenger'
                                                      )}
                                                      {/* {index + 1} */}
                                                    </h1>
                                                  </div>
                                                </Accordion.Title>
                                                <Accordion.Content className="bg-white">
                                                  <p className="mb-2 border-none bg-white">
                                                    <div>
                                                      <form>
                                                        <div className="grid gap-4 mb-5 md:grid-cols-1">
                                                          {finalNameFields?.map(
                                                            (fieldItem, fieldIndex) => {
                                                              return (
                                                                <div key={fieldIndex}>
                                                                  {fieldItem?.name ===
                                                                  'Middlename' ? (
                                                                    <div className="flex items-center justify-between">
                                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                                        {fieldItem?.fieldName}
                                                                      </label>
                                                                      <label className="block mb-2 text-sm font-medium text-slategray">
                                                                        {getFieldName(
                                                                          passengerDetailsContent,
                                                                          'optional'
                                                                        )}
                                                                      </label>
                                                                    </div>
                                                                  ) : (
                                                                    <label className="block mb-2 text-sm font-medium text-black">
                                                                      {fieldItem?.name ===
                                                                      'CivilityCode'
                                                                        ? getFieldName(
                                                                            passengerDetailsContent,
                                                                            'salutation'
                                                                          )
                                                                        : fieldItem?.fieldName}
                                                                    </label>
                                                                  )}
                                                                  {fieldItem?.name ===
                                                                  'CivilityCode' ? (
                                                                    <Select
                                                                      options={civilityCodeOptions}
                                                                      className=" text-black text-sm rounded-md w-full    "
                                                                      placeholder={getFieldName(
                                                                        passengerDetailsContent,
                                                                        'salutation'
                                                                      )}
                                                                      value={
                                                                        values?.details[index][
                                                                          fieldItem?.name as string
                                                                        ]?.length > 0
                                                                          ? {
                                                                              label:
                                                                                values?.details[
                                                                                  index
                                                                                ][
                                                                                  fieldItem?.name as string
                                                                                ],
                                                                              value:
                                                                                values?.details[
                                                                                  index
                                                                                ][
                                                                                  fieldItem?.name as string
                                                                                ],
                                                                            }
                                                                          : ''
                                                                      }
                                                                      name={`details[${index}].${fieldItem?.name}`}
                                                                      onChange={(e) => {
                                                                        if (e !== null) {
                                                                          setFieldValue(
                                                                            `details[${index}].${fieldItem?.name}`,
                                                                            (
                                                                              e as {
                                                                                label: string;
                                                                                value: string;
                                                                              }
                                                                            )?.label
                                                                          );
                                                                        }
                                                                      }}
                                                                      styles={{
                                                                        dropdownIndicator: (
                                                                          provided
                                                                        ) => ({
                                                                          ...provided,
                                                                          svg: {
                                                                            fill: 'text-slategrey',
                                                                          },
                                                                        }),
                                                                        placeholder: (
                                                                          defaultStyles
                                                                        ) => {
                                                                          return {
                                                                            ...defaultStyles,
                                                                            color: '#9ca3af',
                                                                          };
                                                                        },
                                                                      }}
                                                                      components={{
                                                                        IndicatorSeparator: () =>
                                                                          null,
                                                                      }}
                                                                    />
                                                                  ) : (
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md w-full p-2.5    "
                                                                      placeholder={
                                                                        fieldItem?.fieldName
                                                                      }
                                                                      name={`details[${index}].${fieldItem?.name}`}
                                                                      value={
                                                                        values?.details[index][
                                                                          fieldItem?.name as string
                                                                        ]
                                                                      }
                                                                      onChange={(e: {
                                                                        target: {
                                                                          value: string;
                                                                        };
                                                                      }) => {
                                                                        setFieldValue(
                                                                          `details[${index}].${fieldItem?.name}`,
                                                                          e.target.value?.replace(
                                                                            /[^A-Z]/gi,
                                                                            ''
                                                                          )
                                                                        );
                                                                      }}
                                                                      autoComplete="off"
                                                                    />
                                                                  )}

                                                                  {displayError && (
                                                                    <ErrorMessage
                                                                      name={`details[${index}].${fieldItem?.name}`}
                                                                      className="text-xs text-red"
                                                                      component="p"
                                                                    />
                                                                  )}
                                                                </div>
                                                              );
                                                            }
                                                          )}
                                                          {fields &&
                                                            fields?.length > 0 &&
                                                            fields[index]?.map(
                                                              (
                                                                fieldItem: {
                                                                  name: string;
                                                                  fieldName: string;
                                                                },
                                                                fieldIndex: number
                                                              ) => {
                                                                return fieldItem?.name ===
                                                                  'Mobile' ? (
                                                                  // || fieldItem?.name === 'Homecontact'
                                                                  <div key={fieldIndex}>
                                                                    <label className="block mb-2 text-sm font-medium text-black">
                                                                      {fieldItem?.fieldName}
                                                                    </label>
                                                                    <IntlTelInput
                                                                      defaultCountry={
                                                                        // fieldItem?.name === 'Mobile'
                                                                        //   ?
                                                                        values?.details[index][
                                                                          'flagMobile'
                                                                        ]?.length > 0
                                                                          ? values?.details[index][
                                                                              'flagMobile'
                                                                            ]
                                                                          : countryCode
                                                                        // : values?.details[index][
                                                                        //     'flagHomeContact'
                                                                        //   ]?.length > 0
                                                                        // ? values?.details[index][
                                                                        //     'flagHomeContact'
                                                                        //   ]
                                                                        // : countryCode
                                                                      }
                                                                      value={
                                                                        values?.details[index][
                                                                          fieldItem?.name as string
                                                                        ]
                                                                      }
                                                                      fieldName={`details[${index}].${fieldItem?.name}`}
                                                                      onPhoneNumberBlur={() => {
                                                                        setFieldTouched(
                                                                          `details[${index}].${fieldItem?.name}`,
                                                                          true
                                                                        );
                                                                      }}
                                                                      onPhoneNumberChange={(
                                                                        ...args
                                                                      ) => {
                                                                        setFieldValue(
                                                                          `details[${index}].${fieldItem?.name}`,
                                                                          `${args[1]?.replace(
                                                                            /\D+/g,
                                                                            ''
                                                                          )}`
                                                                        );

                                                                        // fieldItem?.name === 'Mobile'
                                                                        //   ?
                                                                        setFieldTouched(
                                                                          `details[${index}].validMobile`,
                                                                          true
                                                                        );
                                                                        setFieldValue(
                                                                          `details[${index}].flagMobile`,
                                                                          args[2]?.iso2
                                                                        );
                                                                        setFieldValue(
                                                                          `details[${index}].dialCodeMobile`,
                                                                          `${
                                                                            '+' + args[2]?.dialCode
                                                                          }`
                                                                        );
                                                                        // : (setFieldValue(
                                                                        //     `details[${index}].flagHomeContact`,
                                                                        //     args[2]?.iso2
                                                                        //   ),
                                                                        //   setFieldValue(
                                                                        //     `details[${index}].dialCodeHomeContact`,
                                                                        //     `${'+' + args[2]?.dialCode}`
                                                                        //   ));
                                                                        if (
                                                                          !args[0] &&
                                                                          args[1]?.replace(
                                                                            /\D+/g,
                                                                            ''
                                                                          )?.length > 0
                                                                        ) {
                                                                          // fieldItem?.name === 'Mobile'
                                                                          //   ?
                                                                          setFieldValue(
                                                                            `details[${index}].validMobile`,
                                                                            ``
                                                                          );
                                                                          // : setFieldValue(
                                                                          //     `details[${index}].validHomeContact`,
                                                                          //     ``
                                                                          //   );
                                                                        } else if (
                                                                          args[0] &&
                                                                          args[1]?.replace(
                                                                            /\D+/g,
                                                                            ''
                                                                          )?.length > 0
                                                                        ) {
                                                                          // fieldItem?.name === 'Mobile'
                                                                          //   ?
                                                                          setFieldValue(
                                                                            `details[${index}].validMobile`,
                                                                            `validMobile`
                                                                          );
                                                                          // : setFieldValue(
                                                                          //     `details[${index}].validHomeContact`,
                                                                          //     `validHomeContact`
                                                                          //   );
                                                                        }
                                                                      }}
                                                                      onSelectFlag={(...event) => {
                                                                        setFieldValue(
                                                                          `details[${index}].${fieldItem?.name}`,
                                                                          ``
                                                                        );
                                                                        // fieldItem?.name === 'Mobile'
                                                                        //   ?
                                                                        setFieldValue(
                                                                          `details[${index}].flagMobile`,
                                                                          event[1].iso2
                                                                        );
                                                                        // : setFieldValue(
                                                                        //     `details[${index}].flagHomeContact`,
                                                                        //     event[1].iso2
                                                                        //   );
                                                                      }}
                                                                      inputClassName="bg-white border border-graylight text-black text-sm rounded-md w-full p-2.5    "
                                                                    />
                                                                    {/* {displayError &&
                                                          findHomeContactField !== undefined &&
                                                          fieldItem?.name === 'Homecontact' &&
                                                          values?.details[index].Homecontact
                                                            ?.length > 0 && (
                                                            <ErrorMessage
                                                              name={`details[${index}].validHomeContact`}
                                                              className="text-xs text-red"
                                                              component="p"
                                                            />
                                                          )} */}
                                                                    {displayError &&
                                                                      findMobileField !==
                                                                        undefined &&
                                                                      fieldItem?.name ===
                                                                        'Mobile' &&
                                                                      values?.details[index].Mobile
                                                                        ?.length > 0 && (
                                                                        <ErrorMessage
                                                                          name={`details[${index}].validMobile`}
                                                                          className="text-xs text-red"
                                                                          component="p"
                                                                        />
                                                                      )}
                                                                    {displayError && (
                                                                      <ErrorMessage
                                                                        name={`details[${index}].${fieldItem?.name}`}
                                                                        className="text-xs text-red"
                                                                        component="p"
                                                                      />
                                                                    )}
                                                                  </div>
                                                                ) : fieldItem?.name === 'Dob' ? (
                                                                  <div>
                                                                    <label className="block mb-2 text-sm font-medium text-black">
                                                                      {fieldItem?.fieldName}
                                                                    </label>
                                                                    <div
                                                                      onClick={() => {
                                                                        setDateModal(true);
                                                                        document.body.style.overflow =
                                                                          'hidden';
                                                                      }}
                                                                      className="relative cursor-pointer"
                                                                    >
                                                                      <Field
                                                                        type="text"
                                                                        className="bg-white border cursor-pointer border-graylight text-black text-sm rounded-md w-full p-2.5    "
                                                                        placeholder={getFieldName(
                                                                          passengerDetailsContent,
                                                                          'mmddyy'
                                                                        )}
                                                                        name={`details[${index}].${fieldItem?.name}`}
                                                                        value={
                                                                          values?.details[index][
                                                                            fieldItem?.name
                                                                          ]?.length > 0
                                                                            ? values?.details[
                                                                                index
                                                                              ][
                                                                                fieldItem?.name
                                                                              ]?.replaceAll(
                                                                                '-',
                                                                                '/'
                                                                              )
                                                                            : ''
                                                                        }
                                                                        onFocus={() => {
                                                                          setDateModal(true);
                                                                          document.body.style.overflow =
                                                                            'hidden';
                                                                        }}
                                                                        disabled={
                                                                          dateModal ? true : false
                                                                        }
                                                                        autoComplete="off"
                                                                      />
                                                                      <div className="absolute right-5 top-3 text-slategray">
                                                                        <FontAwesomeIcon
                                                                          icon={faCalendarDays}
                                                                          aria-hidden="true"
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                    {displayError && (
                                                                      <ErrorMessage
                                                                        name={`details[${index}].${fieldItem?.name}`}
                                                                        className="text-xs text-red"
                                                                        component="p"
                                                                      />
                                                                    )}
                                                                  </div>
                                                                ) : (
                                                                  <div key={fieldIndex}>
                                                                    <label className="block mb-2 text-sm font-medium text-black">
                                                                      {fieldItem?.fieldName}
                                                                    </label>
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md w-full p-2.5    "
                                                                      placeholder={
                                                                        fieldItem?.fieldName
                                                                      }
                                                                      name={`details[${index}].${fieldItem?.name}`}
                                                                      value={
                                                                        values?.details[index][
                                                                          fieldItem?.name as string
                                                                        ]
                                                                      }
                                                                      onChange={(e: {
                                                                        target: {
                                                                          value: string;
                                                                        };
                                                                      }) => {
                                                                        fieldItem?.name ===
                                                                          'Email' &&
                                                                          setFieldTouched(
                                                                            `details[${index}].${fieldItem?.name}`,
                                                                            true
                                                                          );
                                                                        setFieldValue(
                                                                          `details[${index}].${fieldItem?.name}`,
                                                                          fieldItem?.name ===
                                                                            'Email'
                                                                            ? e?.target?.value
                                                                            : e.target.value?.replace(
                                                                                /[0-9]+/g,
                                                                                ''
                                                                              )
                                                                        );
                                                                      }}
                                                                      autoComplete="off"
                                                                    />
                                                                    {displayError && (
                                                                      <ErrorMessage
                                                                        name={`details[${index}].${fieldItem?.name}`}
                                                                        className="text-xs text-red"
                                                                        component="p"
                                                                      />
                                                                    )}
                                                                  </div>
                                                                );
                                                              }
                                                            )}
                                                        </div>
                                                      </form>
                                                    </div>
                                                  </p>
                                                </Accordion.Content>
                                              </Accordion.Panel>
                                              {/* <Accordion.Panel className="bg-white mb-2">
                                                <Accordion.Title>
                                                  <span className="text-lg text-black font-extrabold">
                                                    Special Requests
                                                  </span>
                                                </Accordion.Title>
                                                <Accordion.Content className="bg-white ">
                                                  <div className="mb-2 border border-cadetgray rounded-lg p-3">
                                                    <div>
                                                      <p className="text-sm font-medium text-pearlgray">
                                                        Outbound
                                                      </p>
                                                    </div>
                                                    <div>
                                                      <h1 className="text-lg font-extrabold text-black">
                                                        Dubai - Male
                                                      </h1>
                                                    </div>
                                                    <div>
                                                      <div className="flex items-center mt-3">
                                                        <input
                                                          checked
                                                          id="default-radio-2"
                                                          type="radio"
                                                          value=""
                                                          name="default-radio"
                                                          className="w-4 h-4 "
                                                        />
                                                        <label
                                                          htmlFor="default-radio-2"
                                                          className="ml-2 text-sm font-medium text-black"
                                                        >
                                                          None
                                                        </label>
                                                      </div>
                                                      <div className="flex items-center mt-3">
                                                        <input
                                                          checked
                                                          id="default-radio-2"
                                                          type="radio"
                                                          value=""
                                                          name="default-radio"
                                                          className="w-4 h-4 "
                                                        />
                                                        <label
                                                          htmlFor="default-radio-2"
                                                          className="ml-2 text-sm font-medium text-black"
                                                        >
                                                          Wheelchair
                                                        </label>
                                                      </div>
                                                      <div className="flex items-center mt-3">
                                                        <input
                                                          checked
                                                          id="default-radio-2"
                                                          type="radio"
                                                          value=""
                                                          name="default-radio"
                                                          className="w-4 h-4 "
                                                        />
                                                        <label
                                                          htmlFor="default-radio-2"
                                                          className="ml-2 text-sm font-medium text-black"
                                                        >
                                                          Wheelchair to aircraft door
                                                        </label>
                                                      </div>
                                                      <div className="ml-6  max-h-36 overflow-y-auto">
                                                        <div className="flex items-center mt-3">
                                                          <input
                                                            checked
                                                            id="default-radio-2"
                                                            type="radio"
                                                            value=""
                                                            name="default-radio"
                                                            className="w-4 h-4 "
                                                          />
                                                          <label
                                                            htmlFor="default-radio-2"
                                                            className="ml-2 text-sm font-medium text-black"
                                                          >
                                                            None
                                                          </label>
                                                        </div>
                                                        <div className="flex items-center mt-3">
                                                          <input
                                                            checked
                                                            id="default-radio-2"
                                                            type="radio"
                                                            value=""
                                                            name="default-radio"
                                                            className="w-4 h-4 "
                                                          />
                                                          <label
                                                            htmlFor="default-radio-2"
                                                            className="ml-2 text-sm font-medium text-black"
                                                          >
                                                            Wheelchair
                                                          </label>
                                                        </div>
                                                        <div className="flex items-center mt-3">
                                                          <input
                                                            checked
                                                            id="default-radio-2"
                                                            type="radio"
                                                            value=""
                                                            name="default-radio"
                                                            className="w-4 h-4 "
                                                          />
                                                          <label
                                                            htmlFor="default-radio-2"
                                                            className="ml-2 text-sm font-medium text-black"
                                                          >
                                                            Wheelchair to aircraft door
                                                          </label>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </Accordion.Content>
                                              </Accordion.Panel> */}
                                              <Accordion.Panel>
                                                <Accordion.Title className="bg-white ">
                                                  <span className="text-lg text-black font-extrabold">
                                                    Meal Preference
                                                  </span>
                                                </Accordion.Title>
                                                <Accordion.Content className="bg-white ">
                                                  <div>
                                                    {tripData?.map(
                                                      (
                                                        data: {
                                                          OriginCity: string;
                                                          DestinationCity: string;
                                                        },
                                                        tripIndex: number
                                                      ) => (
                                                        <div
                                                          className="bg-white px-3 xl:my-0 xl:mb-3 w-full   xs:py-2  border border-cadetgray rounded-lg p-3 "
                                                          key={tripIndex}
                                                        >
                                                          <div>
                                                            <p className="text-sm font-medium text-pearlgray">
                                                              {tripIndex === 0
                                                                ? 'Outbound'
                                                                : 'Return'}
                                                            </p>
                                                          </div>
                                                          <div>
                                                            <h1 className="text-lg font-extrabold  text-black">
                                                              {data?.OriginCity} -{' '}
                                                              {data?.DestinationCity}{' '}
                                                            </h1>
                                                          </div>
                                                          <div className="flex items-center mt-3">
                                                            <input
                                                              id={'Regular Meal' + tripIndex}
                                                              type="radio"
                                                              checked={mealTypeChecked(
                                                                'Regular Meal',
                                                                tripIndex
                                                              )}
                                                              onChange={() =>
                                                                mealTypeChange(
                                                                  'Regular Meal',
                                                                  tripIndex,
                                                                  values
                                                                )
                                                              }
                                                              name={'Regular Meal' + tripIndex}
                                                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                                                            />
                                                            <label
                                                              htmlFor={'Regular Meal' + tripIndex}
                                                              className="ml-2 text-sm font-medium text-black"
                                                            >
                                                              {/* Regular Meal */}Standard Meal
                                                            </label>
                                                          </div>
                                                          {mealToDisplay &&
                                                            mealToDisplay?.length > 0 && (
                                                              <div className="flex items-center mt-4">
                                                                <input
                                                                  id={'Dietary Meal' + tripIndex}
                                                                  type="radio"
                                                                  checked={mealTypeChecked(
                                                                    'Dietary Meal',
                                                                    tripIndex
                                                                  )}
                                                                  onChange={() =>
                                                                    mealTypeChange(
                                                                      'Dietary Meal',
                                                                      tripIndex,
                                                                      values
                                                                    )
                                                                  }
                                                                  name={'Dietary Meal' + tripIndex}
                                                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                                                                />
                                                                <label
                                                                  htmlFor={
                                                                    'Dietary Meal' + tripIndex
                                                                  }
                                                                  className="ml-2 text-sm font-medium text-black"
                                                                >
                                                                  {/* <Text
                                                                    field={props.fields.dietaryMeal}
                                                                  /> */}
                                                                  {/* Dietary Meal */}Special Meal
                                                                </label>
                                                              </div>
                                                            )}
                                                          {mealCodeChecked(
                                                            tripIndex,
                                                            'originMeal',
                                                            'returnMeal',
                                                            'Dietary Meal'
                                                          ) !== undefined && (
                                                            <div className="mt-4 ml-6 max-h-36 overflow-y-auto">
                                                              {(tripIndex === 0
                                                                ? departureMealData
                                                                : returnMealData
                                                              )?.map(
                                                                (
                                                                  dt: {
                                                                    Code: string;
                                                                    Label: string;
                                                                    Description: string;
                                                                  },
                                                                  index: number
                                                                ) => (
                                                                  <div
                                                                    className="flex items-center mt-2"
                                                                    key={index}
                                                                  >
                                                                    <input
                                                                      id={dt?.Code + tripIndex}
                                                                      type="radio"
                                                                      checked={
                                                                        mealCodeChecked(
                                                                          tripIndex,
                                                                          'originMealCode',
                                                                          'returnMealCode',
                                                                          dt?.Code
                                                                        )
                                                                          ? true
                                                                          : false
                                                                      }
                                                                      onChange={() =>
                                                                        dietaryMealChange(
                                                                          dt?.Code,
                                                                          tripIndex,
                                                                          values
                                                                        )
                                                                      }
                                                                      name={dt?.Code + tripIndex}
                                                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                                                                    />
                                                                    <label
                                                                      htmlFor={dt?.Code + tripIndex}
                                                                      className="ml-2 text-sm font-medium text-black"
                                                                    >
                                                                      {dt?.Label}
                                                                    </label>
                                                                    {/* {dt?.fields?.description?.value
                                                                      ?.length > 0 && ( */}
                                                                    <div className="relative flex flex-col items-center group">
                                                                      <span className="pl-3">
                                                                        {/* <Image
                                                                                field={
                                                                                  props.fields.info
                                                                                }
                                                                                className=" w-4 h-4 object-cover"
                                                                                alt="tooltip"
                                                                              /> */}
                                                                        <Image
                                                                          src={info}
                                                                          className=" w-4 h-4 object-cover"
                                                                          alt=""
                                                                        />
                                                                      </span>

                                                                      <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex  w-64 pl-3">
                                                                        <span className="relative z-10 p-2 text-xs   whitespace-no-wrap  bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal">
                                                                          {dt?.Description
                                                                            ? dt?.Description
                                                                            : 'Description'}
                                                                        </span>
                                                                        <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
                                                                      </div>
                                                                    </div>
                                                                    {/* )} */}
                                                                  </div>
                                                                )
                                                              )}
                                                            </div>
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                    {/* <div className="py-3 xl:flex md:flex xs:flex h-full items-center justify-center relative gap-3 w-full   m-auto"> */}
                                                    {
                                                      // passengerDetails?.length > 1 && (
                                                      //   <button
                                                      //     type="submit"
                                                      //     className={`w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center ${
                                                      //       tabIndex === 0
                                                      //         ? 'opacity-40 cursor-not-allowed'
                                                      //         : ''
                                                      //     }`}
                                                      //     disabled={tabIndex === 0}
                                                      //     onClick={() =>
                                                      //       setTabIndex((tabIndex) => tabIndex - 1)
                                                      //     }
                                                      //   >
                                                      //     {/* <Text
                                                      //       field={props.fields.previousButton}
                                                      //     /> */}
                                                      //     Previous
                                                      //   </button>
                                                      // )
                                                    }
                                                    {/* <button
                                                        type="submit"
                                                        className={`w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center ${
                                                          tripData?.length === 1
                                                            ? checkValueForOneWay(tabIndex)
                                                              ? ''
                                                              : 'opacity-40 cursor-not-allowed'
                                                            : checkValueForReturn(tabIndex)
                                                            ? ''
                                                            : 'opacity-40 cursor-not-allowed'
                                                        }`}
                                                        onClick={() => {
                                                          checkValueForOneWay(tabIndex)
                                                            ? tabIndex + 1 <
                                                              passengerDetails?.length
                                                              ? setTabIndex(
                                                                  (tabIndex) => tabIndex + 1
                                                                )
                                                              : createBooking('finalSubmit')
                                                            : checkValueForReturn(tabIndex) &&
                                                              tabIndex + 1 <
                                                                passengerDetails?.length
                                                            ? setTabIndex(
                                                                (tabIndex) => tabIndex + 1
                                                              )
                                                            : createBooking('finalSubmit');
                                                        }}
                                                        disabled={
                                                          !(tripData?.length === 1
                                                            ? checkValueForOneWay(tabIndex)
                                                            : checkValueForReturn(tabIndex))
                                                        }
                                                      >
                                                        {tabIndex + 1 ===
                                                        passengerDetails?.length ? (
                                                          <Text field={props.fields.submitButton} />
                                                        ) : (
                                                          <Text field={props.fields.nextButton} />
                                                        )}
                                                      </button> */}
                                                    {/* </div> */}
                                                  </div>
                                                </Accordion.Content>
                                              </Accordion.Panel>
                                            </Accordion>
                                            {!modifyMeal &&
                                              !modifyData &&
                                              !modifyDataFromBooking && (
                                                <div className="flex items-center py-4">
                                                  <input
                                                    id="default-checkbox"
                                                    type="checkbox"
                                                    checked={offerUpdate}
                                                    onChange={(e) => {
                                                      setOfferUpdates(e?.target?.checked);
                                                    }}
                                                    disabled={
                                                      tabIndex !== values?.details?.length - 1
                                                    }
                                                    className="w-4 h-4 text-black-600 bg-gray-100 border-gray-300 rounded  accent-orange-600"
                                                  />
                                                  <label
                                                    htmlFor="default-checkbox"
                                                    className="font-medium text-sm text-black ml-2 "
                                                  >
                                                    I would like to receive exclusive offers and
                                                    news from Beond. I am aware that I can
                                                    unsubscribe at any time.
                                                  </label>
                                                </div>
                                              )}
                                          </div>
                                          <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                                            <div className="flex md:flex block h-full items-center justify-center relative gap-3   py-3 xs:w-full  ">
                                              {(modifyMeal ? passengerDetail : passengerDetails)
                                                ?.length > 1 && (
                                                <button
                                                  type="button"
                                                  className={`xs:justify-center  xs:text-center text-white border bg-aqua   font-bold rounded-lg text-lg inline-flex items-center py-2 text-center w-full ${
                                                    tabIndex === 0
                                                      ? 'opacity-40 cursor-not-allowed'
                                                      : ''
                                                  }`}
                                                  disabled={tabIndex === 0}
                                                  onClick={() => {
                                                    submitBtn(
                                                      'previous',
                                                      values,
                                                      setErrors,
                                                      setTouched,
                                                      tabIndex
                                                    );
                                                  }}
                                                >
                                                  {getFieldName(
                                                    passengerDetailsContent,
                                                    'previousButton'
                                                  )}
                                                </button>
                                              )}
                                              <button
                                                type={
                                                  modifyMeal || modifyData || modifyDataFromBooking
                                                    ? 'button'
                                                    : 'submit'
                                                }
                                                className={`w-full xs:justify-center  xs:text-center text-white border bg-aqua   font-bold rounded-lg text-lg inline-flex items-center py-2 text-centery ${
                                                  modifyMeal || modifyData || modifyDataFromBooking
                                                    ? checkValuesForMeals(tabIndex)
                                                      ? ''
                                                      : 'opacity-40 cursor-not-allowed'
                                                    : tabIndex === values?.details?.length - 1
                                                    ? validateValues(values?.details, tabIndex)
                                                      ? ''
                                                      : 'opacity-30 cursor-not-allowed'
                                                    : validateValues(values?.details, tabIndex)
                                                    ? ''
                                                    : 'opacity-30 cursor-not-allowed'
                                                }`}
                                                // disabled={tabIndex !== values?.details?.length - 1}
                                                // disabled={
                                                //   modifyMeal || modifyData || modifyDataFromBooking
                                                //     ? !checkValuesForMeals(tabIndex)
                                                //     : false
                                                // }
                                                onClick={() => {
                                                  if (
                                                    modifyMeal ||
                                                    modifyData ||
                                                    modifyDataFromBooking
                                                  ) {
                                                    checkValuesForMeals(tabIndex) &&
                                                    tabIndex + 1 < passengerDetail?.length
                                                      ? setTabIndex((tabIndex) => tabIndex + 1)
                                                      : checkValuesForMeals(tabIndex) &&
                                                        finalSubmit(values);
                                                  } else {
                                                    tabIndex !== values?.details?.length - 1 &&
                                                      submitBtn(
                                                        'next',
                                                        values,
                                                        setErrors,
                                                        setTouched,
                                                        tabIndex
                                                      );
                                                  }
                                                }}
                                              >
                                                {tabIndex + 1 === passengerDetails?.length
                                                  ? 'Confirm'
                                                  : getFieldName(
                                                      passengerDetailsContent,
                                                      'nextButton'
                                                    )}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                </Fragment>
                              )}
                            ></FieldArray>

                            {/* <div className="lg:w-w-1/3 my-2 w-full rounded-lg xl:w-2/4 xl:m-auto xl:py-3 xs:py-0 ">
                              <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
                                <button
                                  type={
                                    tabIndex === values?.details?.length - 1 ? 'submit' : 'button'
                                  }
                                  className={`w-full xs:justify-center  xs:text-center text-white bg-aqua font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center  ${
                                    tabIndex === values?.details?.length - 1
                                      ? validateValues(values?.details, tabIndex)
                                        ? ''
                                        : 'opacity-30 cursor-not-allowed'
                                      : 'opacity-30 cursor-not-allowed'
                                  }`}
                                  disabled={tabIndex !== values?.details?.length - 1}
                                >
                                  {getFieldName(passengerDetailsContent, 'continueButton')}
                                </button>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      ) : load?.name === 'search' ? (
        <SearchFlightLoader open={load?.show} />
      ) : load.name === 'exp' ? (
        <SavingExpLoader open={load?.show} />
      ) : (
        <SavingDataLoader open={load?.show} />
      )}
    </main>
  );
};

export default PassengerDetails;
