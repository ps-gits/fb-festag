import Image from 'next/image';
import { useState } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import {
  Text,
  Field,
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import SearchSeatLoader from './Loader/SearchSeat';
import SavingDataLoader from './Loader/SavingData';
import { ComponentProps } from 'lib/component-props';
import { getImageSrc } from './SearchFlight/SitecoreContent';
import { calculateDob } from './PassengerDetails/CalculateDob';
import { fieldsWithCode } from './PassengerDetails/FieldsData';
import { postModifyBookingSeats } from 'src/redux/action/SearchFlights';
import { setModifyMeal, setSelectedMeal } from 'src/redux/reducer/FlightDetails';

type ChooseMealProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    dietaryMealData: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        name: {
          value: string;
        };
        items: {
          id: string;
          url: string;
          name: string;
          displayName: string;
          fields: {
            name: {
              value: string;
            };
            code: {
              value: string;
            };
            description: {
              value: string;
            };
          };
        }[];
      };
    }[];
    skipButton: Field<string>;
    nextButton: Field<string>;
    previousButton: Field<string>;
    backButton: Field<string>;
    outbound: Field<string>;
    return: Field<string>;
    regularMeal: Field<string>;
    dietaryMeal: Field<string>;
    submitButton: Field<string>;
    info: ImageField;
    selectMealLater: Field<string>;
  };
};

const ChooseMeal = (props: ChooseMealProps): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();

  const modifyDataFromBooking = useSelector(
    (state: RootState) => state?.flightDetails?.modifyDataFromBooking
  );
  const modifyMeal = useSelector((state: RootState) => state?.flightDetails?.modifyMeal);
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const prepareFlightDetails = useSelector((state: RootState) =>
    modifyMeal
      ? state?.flightDetails?.prepareBookingModification
      : !modifyData && !modifyDataFromBooking
      ? state?.flightDetails?.prepareFlight
      : state?.flightDetails?.prepareExchangeFlight
  );
  const flightWay = useSelector((state: RootState) =>
    modifyMeal
      ? state?.flightDetails?.modifyBooking?.OriginDestination
      : !modifyData && !modifyDataFromBooking
      ? state?.flightDetails?.reviewFlight?.OriginDestinations
      : state?.flightDetails?.modifyBooking?.OriginDestination
  );
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
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
  const passengerDetailsContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerDetails?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const passengerDetails = useSelector(
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
  const choosenSeats = useSelector((state: RootState) => state?.flightDetails?.chooseSeats);
  const selectedMeal = useSelector((state: RootState) => state?.flightDetails?.selectedMeal);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);

  const [tabIndex, setTabIndex] = useState(0);

  const [mealSelected, setMealSelected] = useState<mealObjectKeys[]>(
    selectedMeal ? selectedMeal : []
  );

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

  const mealTypeChange = (mealLabel: string, tripIndex: number) => {
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
                    passengerDetails && passengerDetails?.length
                      ? passengerDetails[tabIndex]?.Firstname
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
              passengerDetails && passengerDetails?.length
                ? passengerDetails[tabIndex]?.Firstname
                : '',
            passengerIndex: tabIndex,
          },
        ]);
  };

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

  const dietaryMealChange = (codeValue: string, tripIndex: number) => {
    setMealSelected(
      mealSelected?.map((data) => {
        return data?.passengerIndex === tabIndex
          ? {
              originMeal: data?.originMeal,
              originMealCode: tripIndex === 0 ? codeValue : data?.originMealCode,
              returnMeal: data?.returnMeal,
              returnMealCode: tripIndex === 0 ? data?.returnMealCode : codeValue,
              passengerName: passengerDetails[tabIndex]?.Firstname,
              passengerIndex: tabIndex,
            }
          : data;
      })
    );
  };

  const checkValueForOneWay = (index: number) => {
    const checkData = mealSelected?.find((meal) => meal?.passengerIndex === index);
    return (
      checkData !== undefined &&
      tripData?.length === 1 &&
      (checkData?.originMeal === props?.fields?.regularMeal?.value ||
        (checkData?.originMeal === props?.fields?.dietaryMeal?.value &&
          checkData?.originMealCode?.length > 0))
    );
  };

  const checkValueForReturn = (index: number) => {
    const checkData = mealSelected?.find((meal) => meal?.passengerIndex === index);
    return (
      checkData !== undefined &&
      tripData?.length > 1 &&
      (checkData?.originMeal === props?.fields?.regularMeal?.value ||
        (checkData?.originMeal === props?.fields?.dietaryMeal?.value &&
          checkData?.originMealCode?.length > 0)) &&
      (checkData?.returnMeal === props?.fields?.regularMeal?.value ||
        (checkData?.returnMeal === props?.fields?.dietaryMeal?.value &&
          checkData?.returnMealCode?.length > 0))
    );
  };

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

  const createBooking = (type: string) => {
    dispatch(
      loader({
        name: modifyMeal ? 'save' : 'seats',
        show: true,
      })
    );
    dispatch(setSelectedMeal(type === 'finalSubmit' ? mealSelected : []));
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
            postData['Mobile'] = item['dialCodeMobile'] + item['Mobile'];
          }
          // if (Object.keys(item).includes('Homecontact')) {
          //   postData['Homecontact'] = item['dialCodeHomeContact'] + item['Homecontact'];
          // }
          delete postData?.flagMobile;
          delete postData?.validMobile;
          delete postData?.dialCodeMobile;
          // delete postData?.flagHomeContact;
          // delete postData?.validHomeContact;
          // delete postData?.dialCodeHomeContact;
          return {
            PassengerDetails: {
              ...postData,
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
        postModifyBookingSeats(
          {
            booking: dataToPost,
            PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
            PassengerName: passengerDetails !== undefined ? passengerDetails[0].Surname : '',
            SeatMap: {
              departure:
                seatData && seatData?.length > 0
                  ? seatData?.slice(0, passengerDetails?.length)?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                  : [],
              arrival:
                seatData && seatData?.length > 0
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
                type === 'finalSubmit' && departure && departure?.length > 0
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
                        const findData = allMealData[findPassengerIndex]?.fields?.find(
                          (dt: { Code: string }) => item?.originMealCode === dt?.Code
                        );
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
                type === 'finalSubmit' && arrival && arrival?.length > 0
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
                        const findData = allMealData[findPassengerIndex]?.fields?.find(
                          (dt: { Code: string }) => item?.returnMealCode === dt?.Code
                        );
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
          prepareFlightDetails?.cpd_code
        ) as unknown as AnyAction
      );
    } else {
      router.push('/chooseseats');
      setTimeout(() => {
        dispatch(
          loader({
            name: '',
            show: false,
          })
        );
      }, 1500);
    }
  };

  return (
    <div>
      {!load?.show ? (
        <div>
          <div className="relative">
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
            <div className="bg-cadetgray  xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute   xs:w-full xs:px-3  xl:w-3/4 xl:py-16 index-style  ">
              <div className=" xs:w-full rounded-lg xl:w-2/4 xl:m-auto xl:py-0 xl:mt-6 xs:mt-0 xs:pt-20">
                <div
                  className="flex justify-between items-center xl:py-0 xs:py-3"
                  onClick={() => {
                    modifyMeal
                      ? router.back()
                      : modifyData || modifyDataFromBooking
                      ? router.push('/reviewchange')
                      : router.push('/passengerdetails');

                    if (modifyData || modifyDataFromBooking || modifyMeal) {
                      dispatch(setSelectedMeal([]));
                      dispatch(setModifyMeal(false));
                    }
                  }}
                >
                  <div className="xl:py-3 xs:py-0 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      aria-hidden="true"
                      className="text-black text-sm font-black h-4 w-4"
                    />
                    <span className="px-2 text-black text-sm font-black">
                      <Text field={props.fields.backButton} />
                    </span>
                  </div>
                  <div onClick={() => createBooking('selectMealLater')} className="cursor-pointer">
                    <p className="text-pearlgray hover:text-black text-base font-medium">
                      <Text field={props.fields.selectMealLater} />
                    </p>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black  text-black">
                    <Text field={props.fields.heading} />
                  </h1>
                </div>
                <div className="my-4">
                  <ul className="flex flex-wrap -mb-px text-sm font-medium text-center gap-2 ">
                    {passengerDetails?.map((item: { Firstname: string }, index: number) => (
                      <li role="presentation" key={index}>
                        <button
                          className={`xl:w-full xs:w-full inline-block p-4  ${
                            tabIndex === index
                              ? 'inline-block py-2 px-3 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                              : `borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white ${
                                  tripData?.length === 1
                                    ? checkValueForOneWay(index) || checkValueForOneWay(index - 1)
                                      ? ''
                                      : 'cursor-not-allowed'
                                    : checkValueForReturn(index) || checkValueForReturn(index - 1)
                                    ? ''
                                    : 'cursor-not-allowed'
                                }`
                          }`}
                          onClick={() => {
                            tripData?.length === 1
                              ? (checkValueForOneWay(index) || checkValueForOneWay(index - 1)) &&
                                setTabIndex(index)
                              : (checkValueForReturn(index) || checkValueForReturn(index - 1)) &&
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
                                  ? getImageSrc(passengerDetailsContent, 'passengerBlueLogo')
                                  : getImageSrc(passengerDetailsContent, 'passengerOrangeLogo')
                              }
                              alt=""
                              height={4}
                              width={4}
                            />
                            {item?.Firstname?.charAt(0)?.toUpperCase() + item?.Firstname?.slice(1)}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
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
                        className="bg-white px-3   my-2 xs:my-5 w-full rounded-lg  xl:py-3 xs:py-2 "
                        key={tripIndex}
                      >
                        <div>
                          <p className="text-sm">
                            {tripIndex === 0 ? (
                              <Text field={props.fields.outbound} />
                            ) : (
                              <Text field={props.fields.return} />
                            )}
                          </p>
                        </div>
                        <div>
                          <h1 className="text-lg font-black  text-black">
                            {data?.OriginCity} - {data?.DestinationCity}{' '}
                          </h1>
                        </div>
                        <div className="flex items-center mt-3">
                          <input
                            id={props.fields.regularMeal?.value + tripIndex}
                            type="radio"
                            checked={mealTypeChecked(props?.fields?.regularMeal?.value, tripIndex)}
                            onChange={() =>
                              mealTypeChange(props?.fields?.regularMeal?.value, tripIndex)
                            }
                            name={props.fields.regularMeal?.value + tripIndex}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                          />
                          <label
                            htmlFor={props.fields.regularMeal?.value + tripIndex}
                            className="ml-2 text-sm font-medium text-black"
                          >
                            <Text field={props.fields.regularMeal} />
                          </label>
                        </div>
                        {mealToDisplay && mealToDisplay?.length > 0 && (
                          <div className="flex items-center mt-4">
                            <input
                              id={props.fields.dietaryMeal?.value + tripIndex}
                              type="radio"
                              checked={mealTypeChecked(
                                props?.fields?.dietaryMeal?.value,
                                tripIndex
                              )}
                              onChange={() =>
                                mealTypeChange(props?.fields?.dietaryMeal?.value, tripIndex)
                              }
                              name={props.fields.dietaryMeal?.value + tripIndex}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                            />
                            <label
                              htmlFor={props.fields.dietaryMeal?.value + tripIndex}
                              className="ml-2 text-sm font-medium text-black"
                            >
                              <Text field={props.fields.dietaryMeal} />
                            </label>
                          </div>
                        )}
                        {mealCodeChecked(
                          tripIndex,
                          'originMeal',
                          'returnMeal',
                          props?.fields?.dietaryMeal?.value
                        ) !== undefined &&
                          props?.fields?.dietaryMealData?.map((item, index) => (
                            <div className="mt-4 ml-6 " key={index}>
                              {item?.fields?.items?.filter(
                                (dt) =>
                                  mealToDisplay?.find(
                                    (md: { Code: string }) => md?.Code === dt?.fields?.code?.value
                                  ) !== undefined
                              )?.length > 0 && (
                                <div>
                                  <h1 className="text-lg font-black  text-black">
                                    {item?.fields?.name?.value}
                                  </h1>
                                </div>
                              )}
                              {item?.fields?.items
                                ?.filter(
                                  (dt) =>
                                    mealToDisplay?.find(
                                      (md: { Code: string }) => md?.Code === dt?.fields?.code?.value
                                    ) !== undefined
                                )
                                ?.map((dt, index) => (
                                  <div className="flex items-center mt-2" key={index}>
                                    <input
                                      id={dt?.fields?.code?.value + tripIndex}
                                      type="radio"
                                      checked={
                                        mealCodeChecked(
                                          tripIndex,
                                          'originMealCode',
                                          'returnMealCode',
                                          dt?.fields?.code?.value
                                        )
                                          ? true
                                          : false
                                      }
                                      onChange={() =>
                                        dietaryMealChange(dt?.fields?.code?.value, tripIndex)
                                      }
                                      name={dt?.fields?.code?.value + tripIndex}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                                    />
                                    <label
                                      htmlFor={dt?.fields?.code?.value + tripIndex}
                                      className="ml-2 text-sm font-medium text-black"
                                    >
                                      {dt?.fields?.name?.value}
                                    </label>
                                    {dt?.fields?.description?.value?.length > 0 && (
                                      <div className="relative flex flex-col items-center group">
                                        <span className="pl-3">
                                          <JssImage
                                            field={props.fields.info}
                                            className=" w-4 h-4 object-cover"
                                            alt="tooltip"
                                          />
                                        </span>

                                        <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex  w-64 pl-3">
                                          <span className="relative z-10 p-2 text-xs   whitespace-no-wrap  bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal">
                                            {dt?.fields?.description?.value}
                                          </span>
                                          <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          ))}
                      </div>
                    )
                  )}
                  <div className="py-3 xl:flex md:flex xs:flex h-full items-center justify-center relative gap-3 w-full   m-auto">
                    {passengerDetails?.length > 1 && (
                      <button
                        type="submit"
                        className={`w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center ${
                          tabIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        disabled={tabIndex === 0}
                        onClick={() => setTabIndex((tabIndex) => tabIndex - 1)}
                      >
                        <Text field={props.fields.previousButton} />
                      </button>
                    )}
                    <button
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
                          ? tabIndex + 1 < passengerDetails?.length
                            ? setTabIndex((tabIndex) => tabIndex + 1)
                            : createBooking('finalSubmit')
                          : checkValueForReturn(tabIndex) && tabIndex + 1 < passengerDetails?.length
                          ? setTabIndex((tabIndex) => tabIndex + 1)
                          : createBooking('finalSubmit');
                      }}
                      disabled={
                        !(tripData?.length === 1
                          ? checkValueForOneWay(tabIndex)
                          : checkValueForReturn(tabIndex))
                      }
                    >
                      {tabIndex + 1 === passengerDetails?.length ? (
                        <Text field={props.fields.submitButton} />
                      ) : (
                        <Text field={props.fields.nextButton} />
                      )}
                    </button>
                  </div>
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
    </div>
  );
};

export default withDatasourceCheck()<ChooseMealProps>(ChooseMeal);
