import * as Yup from 'yup';
import moment from 'moment';
import Image from 'next/image';
import Select from 'react-select';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import IntlTelInput from 'react-intl-tel-input';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Field, Formik, FieldArray, ErrorMessage } from 'formik';
import { faAngleLeft, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'src/redux/store';
import { calculateDob } from './CalculateDob';
import StepsInfo from '../SearchFlight/StepsInfo';
import { loader } from 'src/redux/reducer/Loader';
import YoungAgeModal from '../Modal/YoungAgeModal';
import AdultAgeModal from '../Modal/AdultAgeModal';
import SearchSeatLoader from '../Loader/SearchSeat';
import DateOfBirthModal from '../Modal/DateOfBirthModal';
import { fieldsWithName, fieldsWithCode } from './FieldsData';
import SearchFlightLoader from '../Loader/SearchFlightLoader';
import { civilityCodeOptions } from '../Select/SelectOptions';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import DepartReturnDateModal from '../Modal/DepartReturnDateModal';
import { setPassengerDetails } from 'src/redux/reducer/PassengerDetails';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const PassengerDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const optionalFields = ['Middlename'];

  const prepareFlightDetails = useSelector(
    (state: RootState) => state?.flightDetails?.prepareFlight
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
  const storedPassengerData = useSelector((state: RootState) => state?.passenger?.passengersData);
  const chooseSeatsContent = useSelector((state: RootState) => state?.sitecore?.chooseSeat?.fields);

  const { adult, children, returnDate, originCode, departDate, dateFlexible, destinationCode } =
    selectedDetailsForFlight;

  const [tabIndex, setTabIndex] = useState(0);
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
  const [passengerValues, setPassengerValues] = useState<detailsObj[]>(
    storedPassengerData && storedPassengerData?.details
      ? storedPassengerData?.details?.slice(0, adult + (children ? children : 0))
      : []
  );
  const [ageChangesAccecpted, setAgeChangesAccecpted] = useState<number[]>([]);

  useEffect(() => {
    if (chooseSeatsContent === undefined) {
      dispatch(getSitecoreContent('Choose-Seat') as unknown as AnyAction);
    }
  }, [chooseSeatsContent, dispatch]);

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
        const findFieldData = fieldsWithCode?.find((dt) => dt?.Code === fieldItem?.Code);
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

  const findHomeContactField = fields?.map((item: { name: string }[]) => {
    const findField = item?.find((item: { name: string }) => item?.name === 'Homecontact');
    return findField;
  });

  const phoneValidation = fields?.map((_fieldItem: { name: string }[], fieldIndex: number) => {
    const validationData = [
      'Mobile',
      'Homecontact',
      'Mobile',
      'Homecontact',
      'Mobile',
      'Homecontact',
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
        } else if (
          index === 1 &&
          findHomeContactField?.length &&
          findHomeContactField[fieldIndex] &&
          item === findHomeContactField[fieldIndex]?.name
        ) {
          return {
            name: 'validHomeContact',
            validation: Yup.string().required('Phone number is not valid'),
          };
        } else if (
          index === 2 &&
          findMobileField?.length &&
          findMobileField[fieldIndex] &&
          item === findMobileField[fieldIndex]?.name
        ) {
          return {
            name: 'flagMobile',
          };
        } else if (
          index === 3 &&
          findHomeContactField?.length &&
          findHomeContactField[fieldIndex] &&
          item === findHomeContactField[fieldIndex]?.name
        ) {
          return {
            name: 'flagHomeContact',
          };
        } else if (
          index === 4 &&
          findMobileField?.length &&
          findMobileField[fieldIndex] &&
          item === findMobileField[fieldIndex]?.name
        ) {
          return {
            name: 'dialCodeMobile',
          };
        } else if (
          index === 5 &&
          findHomeContactField?.length &&
          findHomeContactField[fieldIndex] &&
          item === findHomeContactField[fieldIndex]?.name
        ) {
          return {
            name: 'dialCodeHomeContact',
          };
        }
      })
      ?.filter((item) => item !== undefined);
    return validationData;
  });

  const passengerDetails = [
    ...new Array(adult ? adult : 1)?.fill(getFieldName(passengerDetailsContent, 'adult')),
    ...new Array(children ? children : 0)?.fill(getFieldName(passengerDetailsContent, 'child')),
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
    const findLengthZero = checkLength
      ?.filter((item) => item !== undefined)
      ?.find((item) => item === 0);
    return findLengthZero !== undefined ? false : true;
  };

  const finalSubmit = (values: { details: detailsObj[] }) => {
    dispatch(
      loader({
        show: true,
        name: 'seats',
      })
    );
    router.push('/chooseseats');
    dispatch(setPassengerDetails(values));
    setTimeout(() => {
      dispatch(
        loader({
          show: false,
          name: '',
        })
      );
    }, 2000);
  };

  const initialValues = () => {
    return passengerDetails?.map((_item, index) => {
      return {
        ...Object.fromEntries(finalNameFields?.map((item) => [item?.name, ''])),
        ...Object.fromEntries(
          fields
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
          }
        };
      }}
    >
      {!load?.show ? (
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
          <div className="bg-cadetgray  xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute   xs:w-full xs:px-3  xl:w-3/4 xl:py-16 index-style ">
            <div className="xl:not-sr-only	xs:sr-only">
              <StepsInfo selected={2} />
            </div>
            <div className="lg:w-1/3  w-full rounded-lg xl:w-2/4 xl:m-auto xl:py-0 xl:mt-3 xs:mt-0 xs:pt-20">
              <DepartReturnDateModal
                editDate={true}
                closeModal={() => {
                  setShowModal({
                    young: false,
                    adult: false,
                    depart: false,
                    return: false,
                  });
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
                    router.push('/flightavailability');
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
                            {passengerDetails?.map((item, index) => {
                              return (
                                <li key={index} role="presentation">
                                  <button
                                    className={`xl:w-full xs:w-full inline-block p-4  ${
                                      tabIndex === index
                                        ? ' inline-block py-2 px-2 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                                        : 'borbgder-transparent p-4 inline-block py-2 px-5  rounded-2xl font-medium bg-white'
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
                                    <div className="flex gap-2 items-center">
                                      <Image
                                        className="h-4 w-4 object-cover"
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
                                        height={4}
                                        width={4}
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
                                            (item === 'Child' ? index - adult + 1 : index + 1)}
                                      </div>
                                    </div>
                                  </button>
                                </li>
                              );
                            })}
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
                            index={tabIndex}
                            closeModal={() => {
                              setDateModal(false);
                            }}
                            showModal={dateModal}
                            setFieldValue={setFieldValue}
                            name={passengerDetails[tabIndex]}
                            selectedDate={values?.details[tabIndex].Dob}
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
                                        className="bg-white px-3  lg:w-w-1/3 my-2 xs:my-5 w-full rounded-lg xl:w-2/4 xl:m-auto xl:py-3 xs:py-2 "
                                      >
                                        <div>
                                          <div className="my-2">
                                            <p className="font-medium text-xs text-slategray">
                                              {passengerDetails[index]}
                                            </p>
                                            <h1 className="text-lg font-black text-black">
                                              {getFieldName(passengerDetailsContent, 'passenger')}{' '}
                                              {index + 1}
                                            </h1>
                                          </div>
                                          <form>
                                            <div className="grid gap-4 mb-5 md:grid-cols-1">
                                              {finalNameFields?.map((fieldItem, fieldIndex) => {
                                                return (
                                                  <div key={fieldIndex}>
                                                    {fieldItem?.name === 'Middlename' ? (
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
                                                        {fieldItem?.name === 'CivilityCode'
                                                          ? getFieldName(
                                                              passengerDetailsContent,
                                                              'salutation'
                                                            )
                                                          : fieldItem?.fieldName}
                                                      </label>
                                                    )}
                                                    {fieldItem?.name === 'CivilityCode' ? (
                                                      <Select
                                                        options={civilityCodeOptions}
                                                        className=" text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                                                  values?.details[index][
                                                                    fieldItem?.name as string
                                                                  ],
                                                                value:
                                                                  values?.details[index][
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
                                                          dropdownIndicator: (provided) => ({
                                                            ...provided,
                                                            svg: {
                                                              fill: 'text-slategrey',
                                                            },
                                                          }),
                                                        }}
                                                        components={{
                                                          IndicatorSeparator: () => null,
                                                        }}
                                                      />
                                                    ) : (
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder={fieldItem?.fieldName}
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
                                                            e.target.value?.replace(/[0-9]+/g, '')
                                                          );
                                                        }}
                                                        autoComplete="off"
                                                      />
                                                    )}

                                                    {!optionalFields?.includes(
                                                      fieldItem?.name as string
                                                    ) &&
                                                      displayError && (
                                                        <ErrorMessage
                                                          name={`details[${index}].${fieldItem?.name}`}
                                                          className="text-xs text-red"
                                                          component="p"
                                                        />
                                                      )}
                                                  </div>
                                                );
                                              })}
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
                                                    return fieldItem?.name === 'Mobile' ||
                                                      fieldItem?.name === 'Homecontact' ? (
                                                      <div key={fieldIndex}>
                                                        <label className="block mb-2 text-sm font-medium text-black">
                                                          {fieldItem?.fieldName}
                                                        </label>
                                                        <IntlTelInput
                                                          defaultCountry={
                                                            fieldItem?.name === 'Mobile'
                                                              ? values?.details[index]['flagMobile']
                                                                  ?.length > 0
                                                                ? values?.details[index][
                                                                    'flagMobile'
                                                                  ]
                                                                : countryCode
                                                              : values?.details[index][
                                                                  'flagHomeContact'
                                                                ]?.length > 0
                                                              ? values?.details[index][
                                                                  'flagHomeContact'
                                                                ]
                                                              : countryCode
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
                                                          onPhoneNumberChange={(...args) => {
                                                            setFieldValue(
                                                              `details[${index}].${fieldItem?.name}`,
                                                              `${args[1]}`
                                                            );
                                                            fieldItem?.name === 'Mobile'
                                                              ? (setFieldValue(
                                                                  `details[${index}].flagMobile`,
                                                                  args[2]?.iso2
                                                                ),
                                                                setFieldValue(
                                                                  `details[${index}].dialCodeMobile`,
                                                                  `${'+' + args[2]?.dialCode}`
                                                                ))
                                                              : (setFieldValue(
                                                                  `details[${index}].flagHomeContact`,
                                                                  args[2]?.iso2
                                                                ),
                                                                setFieldValue(
                                                                  `details[${index}].dialCodeHomeContact`,
                                                                  `${'+' + args[2]?.dialCode}`
                                                                ));
                                                            if (!args[0] && args[1].length > 0) {
                                                              fieldItem?.name === 'Mobile'
                                                                ? setFieldValue(
                                                                    `details[${index}].validMobile`,
                                                                    ``
                                                                  )
                                                                : setFieldValue(
                                                                    `details[${index}].validHomeContact`,
                                                                    ``
                                                                  );
                                                            } else if (
                                                              args[0] &&
                                                              args[1].length > 0
                                                            ) {
                                                              fieldItem?.name === 'Mobile'
                                                                ? setFieldValue(
                                                                    `details[${index}].validMobile`,
                                                                    `validMobile`
                                                                  )
                                                                : setFieldValue(
                                                                    `details[${index}].validHomeContact`,
                                                                    `validHomeContact`
                                                                  );
                                                            }
                                                          }}
                                                          onSelectFlag={(...event) => {
                                                            setFieldValue(
                                                              `details[${index}].${fieldItem?.name}`,
                                                              ``
                                                            );
                                                            fieldItem?.name === 'Mobile'
                                                              ? setFieldValue(
                                                                  `details[${index}].flagMobile`,
                                                                  event[1].iso2
                                                                )
                                                              : setFieldValue(
                                                                  `details[${index}].flagHomeContact`,
                                                                  event[1].iso2
                                                                );
                                                          }}
                                                          inputClassName="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        />
                                                        {displayError &&
                                                          findHomeContactField !== undefined &&
                                                          fieldItem?.name === 'Homecontact' &&
                                                          values?.details[index].Homecontact
                                                            ?.length > 0 && (
                                                            <ErrorMessage
                                                              name={`details[${index}].validHomeContact`}
                                                              className="text-xs text-red"
                                                              component="p"
                                                            />
                                                          )}
                                                        {displayError &&
                                                          findMobileField !== undefined &&
                                                          fieldItem?.name === 'Mobile' &&
                                                          values?.details[index].Mobile?.length >
                                                            0 && (
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
                                                          }}
                                                          className="relative cursor-pointer"
                                                        >
                                                          <Field
                                                            type="text"
                                                            className="bg-white border cursor-pointer border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder={getFieldName(
                                                              passengerDetailsContent,
                                                              'mmddyy'
                                                            )}
                                                            name={`details[${index}].${fieldItem?.name}`}
                                                            value={
                                                              values?.details[index][
                                                                fieldItem?.name
                                                              ]?.length > 0
                                                                ? moment(
                                                                    new Date(
                                                                      values?.details[index][
                                                                        fieldItem?.name
                                                                      ]
                                                                    )
                                                                  )
                                                                    .format('MM-DD-YYYY')
                                                                    ?.replaceAll('-', '/')
                                                                : ''
                                                            }
                                                            disabled
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
                                                          className="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                          placeholder={fieldItem?.fieldName}
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
                                                              e.target.value?.replace(/[0-9]+/g, '')
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
                                        <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                                          <div className="flex md:flex block h-full items-center justify-center relative gap-3   py-3 xs:w-full  ">
                                            <button
                                              type="button"
                                              className={`xs:justify-center  xs:text-center text-white border bg-aqua   font-bold rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 ${
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
                                            <button
                                              type={
                                                tabIndex === values?.details?.length - 1
                                                  ? 'button'
                                                  : 'submit'
                                              }
                                              className={`xs:justify-center  xs:text-center text-white border bg-aqua   font-bold rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 ${
                                                tabIndex === values?.details?.length - 1
                                                  ? 'opacity-40 cursor-not-allowed'
                                                  : validateValues(values?.details, tabIndex)
                                                  ? ''
                                                  : 'opacity-30 cursor-not-allowed'
                                              }`}
                                              disabled={tabIndex === values?.details?.length - 1}
                                              onClick={() => {
                                                submitBtn(
                                                  'next',
                                                  values,
                                                  setErrors,
                                                  setTouched,
                                                  tabIndex
                                                );
                                              }}
                                            >
                                              {getFieldName(passengerDetailsContent, 'nextButton')}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                )}
                              </Fragment>
                            )}
                          ></FieldArray>

                          <div className="lg:w-w-1/3 my-2 w-full rounded-lg xl:w-2/4 xl:m-auto xl:py-3 xs:py-0 ">
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      ) : load?.name === 'search' ? (
        <SearchFlightLoader open={load?.show} />
      ) : (
        <SearchSeatLoader open={load?.show} />
      )}
    </main>
  );
};

export default PassengerDetails;
