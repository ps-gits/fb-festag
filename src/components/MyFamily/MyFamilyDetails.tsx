import * as Yup from 'yup';
import moment from 'moment';
import Image from 'next/image';
import Select from 'react-select';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useState, Fragment } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { faAngleLeft, faCalendarDays, faLock, faPlus } from '@fortawesome/free-solid-svg-icons';

// import MyFamily from './Tabs/MyFamily';
import { RootState } from 'src/redux/store';
import { fieldsToInsert } from './familyFields';
import { loader } from 'src/redux/reducer/Loader';
import banner from '../../assets/images/desktopbanner.png';
import userorange from '../../assets/images/userorange.png';
import SavingDataLoader from 'components/Loader/SavingData';
import alertblue from '../../assets/images/passengerblue.png';
import DateOfBirthModal from 'components/Modal/DateOfBirthModal';
import { postPassengerUpdate } from 'src/redux/action/CreateAccount';
import { civilityCodeOptions } from 'components/Select/SelectOptions';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';
import PassengeRemoveModal from 'components/Modal/PassengeRemoveModal';
import { setSavedFamilyDetails } from 'src/redux/reducer/CreateAccount';

const MyFamilyDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const optionalFields = [
    'Ref',
    'Login',
    'TypeCode',
    'Currency',
    'MiddleName',
    'CultureName',
    'CompanyName',
  ];
  const optionalArrayValues = [
    {
      name: 'Emails',
      fields: [],
    },
    {
      name: 'Phones',
      fields: ['PhoneTypeCode', 'PhoneLocationTypeCode'],
    },
    {
      name: 'Addresses',
      fields: ['Ref', 'City', 'TypeCode', 'ZipCode', 'Address1', 'CountryNameOrCode'],
    },
    {
      name: 'Documents',
      fields: [
        'Ref',
        'Gender',
        'Surname',
        'Firstname',
        'DocumentNumber',
        'DocumentTypeCode',
        'IssueCountryCode',
        'DocumentExpiryDate',
        'DocumentIssuanceDate',
        'NationalityCountryCode',
      ],
    },
  ];

  const createAccountContent = useSelector(
    (state: RootState) => state?.sitecore?.createAccount?.fields
  );
  const savedFamilyDetails = useSelector(
    (state: RootState) => state?.createAccount?.savedFamilyDetails
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const userDetails = useSelector((state: RootState) => state?.createAccount?.signIn);
  const familyDetails = useSelector((state: RootState) => state?.createAccount?.familyDetails);

  const [tabIndex, setTabIndex] = useState(0);
  const [dateModal, setDateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [familyValues, setFamilyValues] = useState(
    savedFamilyDetails?.length ? savedFamilyDetails : familyDetails
  );
  const [firstNames, setFirstNames] = useState<string[]>(
    (savedFamilyDetails?.length ? savedFamilyDetails : familyDetails)?.map(
      (item: { FirstName: string }) => item?.FirstName
    )
  );
  const finalFamilyDetails = familyValues?.map((item: familyFieldValues) => {
    const obj = {} as familyFieldValues;
    const itemKeys = Object.keys(item);
    const allKeys = Object.keys(fieldsToInsert)
      ?.filter((item) => itemKeys?.find((dt) => dt === item) === undefined)
      ?.reduce((a, v) => ({ ...a, [v]: '' }), {});

    itemKeys?.map((dt) => {
      if (
        Array.isArray(item[dt as keyof familyFieldValues]) &&
        item[dt as keyof familyFieldValues].length === 0
      ) {
        dt === 'Phones'
          ? (obj[dt] = [
              {
                flagPhone: '',
                validPhone: '',
                PhoneNumber: '',
                PhoneTypeCode: '',
                PhoneLocationTypeCode: '',
              },
            ])
          : dt === 'Addresses'
          ? (obj[dt] = [
              {
                Ref: '',
                TypeCode: '',
                Address1: '',
                ZipCode: '',
                City: '',
                CountryNameOrCode: '',
              },
            ])
          : dt === 'Documents'
          ? (obj[dt] = [
              {
                Ref: '',
                IssueCountryCode: '',
                NationalityCountryCode: '',
                Gender: '',
                DocumentExpiryDate: '',
                DocumentIssuanceDate: '',
                Firstname: '',
                Surname: '',
                DocumentTypeCode: '',
                DocumentNumber: '',
              },
            ])
          : dt === 'Emails' && (item[dt] = [{ Email: '', Type: 'Primary' }]);
      }
    });
    return { ...item, ...obj, ...allKeys };
  });

  const getValidation = (values: familyFieldValues) => {
    let isValid = true;
    if (values) {
      Object?.keys(values)?.map((item) => {
        const fieldValue = values[item as keyof familyFieldValues];
        if (Array.isArray(fieldValue)) {
          const findArrayValue = optionalArrayValues?.find((av) => av?.name === item);
          fieldValue?.map((dt) =>
            Object.keys(dt)?.map((fv) => {
              if (
                findArrayValue !== undefined &&
                !(findArrayValue?.fields as string[])?.includes(fv) &&
                (dt[fv as keyof typeof dt] as string).length === 0
              ) {
                isValid = false;
              }
            })
          );
        } else if (!optionalFields?.includes(item) && fieldValue?.length === 0) {
          isValid = false;
        }
      });
      return isValid;
    } else {
      return true;
    }
  };

  return (
    <main
      onClick={() => {
        const modalDob = document.getElementById('modal-dob');
        const passengerRemove = document.getElementById('passenger-remove');
        window.onclick = function (event) {
          if (event.target == modalDob || event.target == passengerRemove) {
            dateModal && setDateModal(false);
            showModal && setShowModal(false);
            document.body.style.overflow = 'unset';
          }
        };
      }}
    >
      {userDetails?.Login !== undefined ? (
        <>
          {!load?.show ? (
            <div className="relative">
              <div className="xl:not-sr-only	xs:sr-only">
                <div className="xl:w-1/4 xs:w-full">
                  <div>
                    <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                      <Image
                        src={banner}
                        className="xs:absolute  inset-0 h-full w-full object-cover"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-cadetgray  xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute  xl:top-4  xs:top-0 xs:w-full xs:px-3  xl:w-3/4 xl:py-10 index-style ">
                  <div className="xl:w-2/4 xl:m-auto xl:pt-10 xs:pt-20">
                    <div>
                      <div className="flex justify-between items-center xl:py-0 xs:py-3">
                        <div
                          className="xl:py-3 xs:py-0 cursor-pointer"
                          onClick={() => router?.push('/myprofile')}
                        >
                          <FontAwesomeIcon
                            icon={faAngleLeft}
                            aria-hidden="true"
                            className="text-black text-sm font-black h-4 w-4"
                          />
                          <span className="px-2 text-black text-sm font-black">Back</span>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h1 className="text-2xl font-black  text-black">My Family</h1>
                        </div>
                        <div className="py-1">
                          <p className="font-medium text-sm text-pearlgray">
                            Fill in your missing passport information for each passenger
                          </p>
                        </div>
                      </div>
                    </div>
                    <Formik
                      enableReinitialize={true}
                      initialValues={
                        {
                          Users: finalFamilyDetails,
                        } as {
                          Users: familyFieldValues[];
                        }
                      }
                      validationSchema={Yup.object().shape({
                        Users: Yup.array().of(
                          Yup.object().shape({
                            CivilityCode: Yup.string().required('This field is required'),
                            FirstName: Yup.string()
                              .required('This field is required')
                              .max(60, 'Max 60 Characters Allowed'),
                            Surname: Yup.string()
                              .required('This field is required')
                              .max(60, 'Max 60 Characters Allowed'),
                            MiddleName: Yup.string().max(60, 'Max 60 Characters Allowed'),
                            // Login: Yup.string().required('This field is required'),
                            BirthDate: Yup.string().required('This field is required'),
                            // Password: Yup.string()
                            //   .min(5, 'Min 5 Character Required')
                            //   .required('This field is required'),
                            // ConfirmPassword: Yup.string()
                            //   .oneOf([Yup.ref('Password')], 'Passwords must match')
                            //   .min(5, 'Min 5 Character Required')
                            //   .required('This field is required'),
                            Emails: Yup.array().of(
                              Yup.object().shape({
                                Email: Yup.string()
                                  .matches(
                                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    'Must be valid email'
                                  )
                                  .required('This field is required')
                                  .max(100, 'Max 100 Characters Allowed'),
                              })
                            ),
                            Phones: Yup.array().of(
                              Yup.object().shape({
                                PhoneNumber: Yup.string().required('This field is required'),
                                validPhone: Yup.string().required('Phone number is not valid'),
                              })
                            ),
                          })
                        ),
                      })}
                      onSubmit={(values) => {
                        dispatch(
                          loader({
                            show: true,
                            name: 'save',
                          })
                        );
                        const postData = JSON.parse(JSON.stringify(values?.Users))?.map(
                          (item: {
                            _id?: string;
                            __v?: string;
                            Login: string;
                            Emails: [{ Email: string }];
                          }) => {
                            delete item._id;
                            delete item.__v;
                            item.Login = values?.Users[0]?.Emails[0]?.Email;
                            return item;
                          }
                        );
                        setFamilyValues(postData);
                        dispatch(setSavedFamilyDetails(postData));
                        setFirstNames(
                          postData?.map((item: { FirstName: string }) => item?.FirstName)
                        );
                        dispatch(postPassengerUpdate(postData, router) as unknown as AnyAction);
                      }}
                    >
                      {({ values, handleSubmit, setFieldValue, setFieldTouched }) => (
                        <Form onSubmit={handleSubmit}>
                          <FieldArray
                            name="Users"
                            render={(arrayHelper) => (
                              <div>
                                <div className="rounded-lg ">
                                  <div>
                                    <div className="rounded-lg ">
                                      <div>
                                        <div className="my-4">
                                          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center gap-2 ">
                                            {firstNames?.map((item: string, index: number) => (
                                              <li role="presentation" key={index}>
                                                <button
                                                  className={`xl:w-full xs:w-full inline-block p-4  ${
                                                    tabIndex === index
                                                      ? ' inline-block py-2 px-3 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                                                      : 'borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white'
                                                  } ${
                                                    index === tabIndex ||
                                                    getValidation(values?.Users[tabIndex]) ||
                                                    (tabIndex > 0 &&
                                                      getValidation(values?.Users[index]))
                                                      ? 'cursor-pointer'
                                                      : 'cursor-not-allowed'
                                                  }`}
                                                  type="button"
                                                  onClick={() => {
                                                    if (
                                                      getValidation(values?.Users[tabIndex]) ||
                                                      getValidation(values?.Users[index])
                                                    ) {
                                                      values?.Users[tabIndex]?.FirstName?.length > 0
                                                        ? firstNames?.splice(
                                                            tabIndex,
                                                            1,
                                                            values?.Users[tabIndex]?.FirstName
                                                          )
                                                        : firstNames?.splice(
                                                            tabIndex,
                                                            1,
                                                            'Passenger'
                                                          );

                                                      tabIndex === 0
                                                        ? getValidation(values?.Users[tabIndex]) &&
                                                          setTabIndex(index)
                                                        : setTabIndex(index);
                                                    }
                                                  }}
                                                >
                                                  <div className="flex gap-2 items-center">
                                                    <Image
                                                      className="h-4 w-4 object-cover"
                                                      src={
                                                        index === tabIndex ? alertblue : userorange
                                                      }
                                                      alt=""
                                                    />
                                                    {index === 0
                                                      ? item?.charAt(0)?.toUpperCase() +
                                                        item?.slice(1) +
                                                        ' (You)'
                                                      : item?.charAt(0)?.toUpperCase() +
                                                        item?.slice(1)}
                                                  </div>
                                                </button>
                                              </li>
                                            ))}
                                            <li role="presentation">
                                              <button
                                                className={`xl:w-full xs:w-full inline-block p-4 borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white ${
                                                  getValidation(values?.Users[tabIndex])
                                                    ? 'cursor-pointer'
                                                    : 'cursor-not-allowed'
                                                }`}
                                                type="button"
                                                disabled={!getValidation(values?.Users[tabIndex])}
                                                onClick={() => {
                                                  arrayHelper?.insert(
                                                    firstNames?.length,
                                                    fieldsToInsert
                                                  );
                                                  if (
                                                    getValidation(values?.Users[tabIndex]) &&
                                                    firstNames[tabIndex] === 'Passenger' &&
                                                    values?.Users[tabIndex]?.FirstName?.length > 0
                                                  ) {
                                                    firstNames?.splice(
                                                      tabIndex,
                                                      1,
                                                      values?.Users[tabIndex]?.FirstName
                                                    );
                                                  }
                                                  setTabIndex(() => firstNames?.length);
                                                  setFirstNames((prev: string[]) => [
                                                    ...prev,
                                                    'Passenger',
                                                  ]);
                                                }}
                                              >
                                                <div className="flex gap-2 items-center">
                                                  <FontAwesomeIcon
                                                    icon={faPlus}
                                                    aria-hidden="true"
                                                    className="h-4 w-4 text-aqua"
                                                  />
                                                  Add
                                                </div>
                                              </button>
                                            </li>
                                          </ul>
                                        </div>
                                        <div>
                                          <div>
                                            <PassengeRemoveModal
                                              showModal={showModal}
                                              closeModal={() => {
                                                setShowModal(false);
                                                document.body.style.overflow = 'unset';
                                              }}
                                              remove={() => {
                                                setShowModal(false);
                                                arrayHelper.remove(tabIndex);
                                                firstNames?.splice(tabIndex, 1);
                                                setTabIndex(tabIndex - 1);
                                                document.body.style.overflow = 'unset';
                                              }}
                                              firstName={firstNames[tabIndex]}
                                            />
                                            <DateOfBirthModal
                                              id="modal-dob"
                                              type="createAccount"
                                              index={tabIndex}
                                              closeModal={() => {
                                                setDateModal(false);
                                                document.body.style.overflow = 'unset';
                                              }}
                                              showModal={dateModal}
                                              setFieldValue={setFieldValue}
                                              name="Adult"
                                              selectedDate={values?.Users[tabIndex]?.BirthDate}
                                            />
                                            {values?.Users?.map((_userInfo, userIndex: number) => (
                                              <Fragment key={userIndex}>
                                                {tabIndex === userIndex && (
                                                  <div className="bg-white px-3   my-2 xs:my-5 w-full rounded-lg  xl:py-3 xs:py-2 ">
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        {getFieldName(
                                                          createAccountContent,
                                                          'title'
                                                        )}
                                                      </label>
                                                      <Select
                                                        options={civilityCodeOptions}
                                                        className=" text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder={getFieldName(
                                                          createAccountContent,
                                                          'title'
                                                        )}
                                                        value={
                                                          values?.Users[userIndex]?.CivilityCode
                                                            ?.length > 0
                                                            ? {
                                                                label:
                                                                  values?.Users[userIndex]
                                                                    ?.CivilityCode,
                                                                value:
                                                                  values?.Users[userIndex]
                                                                    ?.CivilityCode,
                                                              }
                                                            : ''
                                                        }
                                                        name={`Users[${userIndex}].CivilityCode`}
                                                        onChange={(e) => {
                                                          if (e !== null) {
                                                            setFieldValue(
                                                              `Users[${userIndex}].CivilityCode`,
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
                                                      <ErrorMessage
                                                        name={`Users[${userIndex}].CivilityCode`}
                                                        component="span"
                                                        className="text-xs text-red"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        {getFieldName(
                                                          createAccountContent,
                                                          'firstName'
                                                        )}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={getFieldName(
                                                          createAccountContent,
                                                          'firstName'
                                                        )}
                                                        name={`Users[${userIndex}].FirstName`}
                                                        value={values?.Users[userIndex]?.FirstName}
                                                        autoComplete="off"
                                                        onChange={(e: {
                                                          target: { value: string };
                                                        }) => {
                                                          setFieldValue(
                                                            `Users[${userIndex}].FirstName`,
                                                            e.target.value.replace(/[^A-Z]/gi, '')
                                                          );
                                                        }}
                                                      />
                                                      <ErrorMessage
                                                        name={`Users[${userIndex}].FirstName`}
                                                        component="span"
                                                        className="text-xs text-red"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        {getFieldName(
                                                          createAccountContent,
                                                          'middleName'
                                                        )}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={getFieldName(
                                                          createAccountContent,
                                                          'middleName'
                                                        )}
                                                        name={`Users[${userIndex}].MiddleName`}
                                                        value={values?.Users[userIndex]?.MiddleName}
                                                        autoComplete="off"
                                                        onChange={(e: {
                                                          target: { value: string };
                                                        }) => {
                                                          setFieldValue(
                                                            `Users[${userIndex}].MiddleName`,
                                                            e.target.value.replace(/[^A-Z]/gi, '')
                                                          );
                                                        }}
                                                      />
                                                      <ErrorMessage
                                                        name={`Users[${userIndex}].MiddleName`}
                                                        component="span"
                                                        className="text-xs text-red"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        {getFieldName(
                                                          createAccountContent,
                                                          'lastName'
                                                        )}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={getFieldName(
                                                          createAccountContent,
                                                          'lastName'
                                                        )}
                                                        name={`Users[${userIndex}].Surname`}
                                                        value={values?.Users[userIndex]?.Surname}
                                                        autoComplete="off"
                                                        onChange={(e: {
                                                          target: { value: string };
                                                        }) => {
                                                          setFieldValue(
                                                            `Users[${userIndex}].Surname`,
                                                            e.target.value.replace(/[^A-Z]/gi, '')
                                                          );
                                                        }}
                                                      />
                                                      <ErrorMessage
                                                        name={`Users[${userIndex}].Surname`}
                                                        component="span"
                                                        className="text-xs text-red"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <FieldArray
                                                        name={`Users[${userIndex}].Emails`}
                                                        render={() => (
                                                          <div>
                                                            {values?.Users[userIndex]?.Emails?.map(
                                                              (_item, index) => (
                                                                <Fragment key={index}>
                                                                  <label className="block mb-2 text-sm font-medium text-black">
                                                                    {getFieldName(
                                                                      createAccountContent,
                                                                      'email'
                                                                    )}
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder={getFieldName(
                                                                        createAccountContent,
                                                                        'email'
                                                                      )}
                                                                      name={`Users[${userIndex}].Emails[${index}].Email`}
                                                                      value={
                                                                        values?.Users[userIndex]
                                                                          ?.Emails[index].Email
                                                                      }
                                                                      onChange={(e: {
                                                                        target: { value: string };
                                                                      }) => {
                                                                        setFieldTouched(
                                                                          `Users[${userIndex}].Emails[${index}].Email`,
                                                                          true
                                                                        );
                                                                        setFieldValue(
                                                                          `Users[${userIndex}].Emails[${index}].Email`,
                                                                          e.target.value
                                                                        );
                                                                      }}
                                                                      autoComplete="off"
                                                                    />
                                                                    <div>
                                                                      <FontAwesomeIcon
                                                                        icon={faLock}
                                                                        aria-hidden="true"
                                                                        className="text-hilightgray text-sm font-black h-4 w-4 absolute top-3 right-4"
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                  <ErrorMessage
                                                                    name={`Users[${userIndex}].Emails[${index}].Email`}
                                                                    component="span"
                                                                    className="text-xs text-red"
                                                                  />
                                                                </Fragment>
                                                              )
                                                            )}
                                                          </div>
                                                        )}
                                                      />
                                                    </div>
                                                    <FieldArray
                                                      name={`Users[${userIndex}].Phones`}
                                                      render={() => (
                                                        <div>
                                                          {values?.Users[userIndex]?.Phones?.map(
                                                            (_item, index) => (
                                                              <Fragment key={index}>
                                                                <div className="mb-2 ">
                                                                  <label className="block mb-2 text-sm font-medium text-black">
                                                                    Phone Number
                                                                  </label>
                                                                  <div className="relative">
                                                                    <IntlTelInput
                                                                      defaultCountry={
                                                                        values?.Users[userIndex]
                                                                          .Phones[index].flagPhone
                                                                          ?.length > 0
                                                                          ? values?.Users[userIndex]
                                                                              .Phones[index]
                                                                              .flagPhone
                                                                          : 'ae'
                                                                      }
                                                                      value={
                                                                        values?.Users[userIndex]
                                                                          .Phones[index]
                                                                          .PhoneNumber !==
                                                                          undefined &&
                                                                        values?.Users[userIndex]
                                                                          .Phones[index].PhoneNumber
                                                                          ?.length > 0
                                                                          ? values?.Users[userIndex]
                                                                              .Phones[index]
                                                                              .PhoneNumber
                                                                          : ''
                                                                      }
                                                                      fieldName={`Users[${userIndex}].Phones[${index}].PhoneNumber`}
                                                                      onPhoneNumberBlur={() => {
                                                                        setFieldTouched(
                                                                          `Users[${userIndex}].Phones[${index}].PhoneNumber`,
                                                                          true
                                                                        );
                                                                      }}
                                                                      placeholder="Enter Your Number"
                                                                      onPhoneNumberChange={(
                                                                        ...args
                                                                      ) => {
                                                                        setFieldValue(
                                                                          `Users[${userIndex}].Phones[${index}].PhoneNumber`,
                                                                          `${args[1]?.replace(
                                                                            /\D+/g,
                                                                            ''
                                                                          )}`
                                                                        );
                                                                        setFieldTouched(
                                                                          `Users[${userIndex}].Phones[${index}].validPhone`,
                                                                          true
                                                                        );
                                                                        setFieldValue(
                                                                          `Users[${userIndex}].Phones[${index}].flagPhone`,
                                                                          args[2]?.iso2
                                                                        );
                                                                        if (
                                                                          !args[0] &&
                                                                          args[1]?.replace(
                                                                            /\D+/g,
                                                                            ''
                                                                          ).length > 0
                                                                        ) {
                                                                          setFieldValue(
                                                                            `Users[${userIndex}].Phones[${index}].validPhone`,
                                                                            ``
                                                                          );
                                                                        } else if (
                                                                          args[0] &&
                                                                          args[1]?.replace(
                                                                            /\D+/g,
                                                                            ''
                                                                          ).length > 0
                                                                        ) {
                                                                          setFieldValue(
                                                                            `Users[${userIndex}].Phones[${index}].validPhone`,
                                                                            `validPhone`
                                                                          );
                                                                        }
                                                                      }}
                                                                      onSelectFlag={(...event) => {
                                                                        setFieldValue(
                                                                          `Users[${userIndex}].Phones[${index}].PhoneNumber`,
                                                                          ``
                                                                        );
                                                                        setFieldValue(
                                                                          `Users[${userIndex}].Phones[${index}].flagPhone`,
                                                                          event[1].iso2
                                                                        );
                                                                      }}
                                                                      inputClassName="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                    />
                                                                  </div>
                                                                  {values?.Users[userIndex].Phones[
                                                                    index
                                                                  ].PhoneNumber?.length > 0 && (
                                                                    <ErrorMessage
                                                                      name={`Users[${userIndex}].Phones[${index}].validPhone`}
                                                                      className="text-xs text-red"
                                                                      component="p"
                                                                    />
                                                                  )}
                                                                  <ErrorMessage
                                                                    name={`Users[${userIndex}].Phones[${index}].PhoneNumber`}
                                                                    component="span"
                                                                    className="text-xs text-red"
                                                                  />
                                                                </div>
                                                                <div className="mb-2 ">
                                                                  <label className="block mb-2 text-sm font-medium text-black">
                                                                    Phone TypeCode
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder="Phone TypeCode"
                                                                      name={`Users[${userIndex}].Phones[${index}].PhoneTypeCode`}
                                                                      value={
                                                                        values?.Users[userIndex]
                                                                          ?.Phones[index]
                                                                          .PhoneTypeCode
                                                                      }
                                                                      autoComplete="off"
                                                                    />
                                                                  </div>
                                                                </div>
                                                                <div className="mb-2 ">
                                                                  <label className="block mb-2 text-sm font-medium text-black">
                                                                    Phone Location TypeCode
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder="Phone Location TypeCode"
                                                                      name={`Users[${userIndex}].Phones[${index}].PhoneLocationTypeCode`}
                                                                      value={
                                                                        values?.Users[userIndex]
                                                                          ?.Phones[index]
                                                                          .PhoneLocationTypeCode
                                                                      }
                                                                      autoComplete="off"
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </Fragment>
                                                            )
                                                          )}
                                                        </div>
                                                      )}
                                                    />
                                                    {/* <div className="mb-2 ">
                                            <label className="block mb-2 text-sm font-medium text-black">
                                              Username
                                            </label>
                                            <Field
                                              type="text"
                                              className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                              placeholder="Username"
                                              name={`Users[${userIndex}].Login`}
                                              value={values?.Users[userIndex]?.Login}
                                              autoComplete="off"
                                            />
                                            <ErrorMessage
                                              name={`Users[${userIndex}].Login`}
                                              component="span"
                                              className="text-xs text-red"
                                            />
                                          </div> */}
                                                    {/* <div>
                                            <label className="block mb-2 text-sm font-medium text-black">
                                              {getFieldName(createAccountContent, 'password')}
                                            </label>
                                            <Field
                                              type="password"
                                              className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                              placeholder={getFieldName(
                                                createAccountContent,
                                                'password'
                                              )}
                                              name={`Users[${userIndex}].Password`}
                                              value={values?.Users[userIndex]?.Password}
                                              autoComplete="off"
                                            />
                                          </div>
                                          <ErrorMessage
                                            name={`Users[${userIndex}].Password`}
                                            component="span"
                                            className="text-xs text-red"
                                          />
                                          <div className="mb-2"></div>
                                          <div>
                                            <label className="block mb-2 text-sm font-medium text-black">
                                              {getFieldName(
                                                createAccountContent,
                                                'confirmPassword'
                                              )}
                                            </label>
                                            <Field
                                              type="password"
                                              className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                              placeholder={getFieldName(
                                                createAccountContent,
                                                'confirmPassword'
                                              )}
                                              name={`Users[${userIndex}].ConfirmPassword`}
                                              value={values?.Users[userIndex]?.ConfirmPassword}
                                              autoComplete="off"
                                            />
                                          </div>
                                          <ErrorMessage
                                            name={`Users[${userIndex}].ConfirmPassword`}
                                            component="span"
                                            className="text-xs text-red"
                                          />
                                          <div className="mb-2"></div> */}
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        Date of Birth
                                                      </label>
                                                      <div
                                                        onClick={() => {
                                                          setDateModal(true);
                                                          document.body.style.overflow = 'hidden';
                                                        }}
                                                        className="relative cursor-pointer"
                                                      >
                                                        <Field
                                                          type="text"
                                                          className="bg-white border cursor-pointer border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                          placeholder="MM/DD/YYYY"
                                                          name={`Users[${userIndex}].BirthDate`}
                                                          value={
                                                            values?.Users[userIndex]?.BirthDate
                                                              ?.length > 0
                                                              ? moment(
                                                                  new Date(
                                                                    values?.Users[
                                                                      userIndex
                                                                    ]?.BirthDate
                                                                  )
                                                                )
                                                                  .format('MM-DD-YYYY')
                                                                  ?.replaceAll('-', '/')
                                                              : ''
                                                          }
                                                          onFocus={() => {
                                                            setDateModal(true);
                                                            document.body.style.overflow = 'hidden';
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                        <div className="absolute right-5 top-3 text-slategray">
                                                          <FontAwesomeIcon
                                                            icon={faCalendarDays}
                                                            aria-hidden="true"
                                                          />
                                                        </div>
                                                      </div>
                                                      <ErrorMessage
                                                        name={`Users[${userIndex}].BirthDate`}
                                                        component="span"
                                                        className="text-xs text-red"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        TypeCode
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder="TypeCode"
                                                        name={`Users[${userIndex}].TypeCode`}
                                                        value={values?.Users[userIndex]?.TypeCode}
                                                        autoComplete="off"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        Culture Name
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder="Culture Name"
                                                        name={`Users[${userIndex}].CultureName`}
                                                        value={
                                                          values?.Users[userIndex]?.CultureName
                                                        }
                                                        autoComplete="off"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        Currency
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder="Currency"
                                                        name={`Users[${userIndex}].Currency`}
                                                        value={values?.Users[userIndex]?.Currency}
                                                        autoComplete="off"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        Company Name
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder="Company Name"
                                                        name={`Users[${userIndex}].CompanyName`}
                                                        value={
                                                          values?.Users[userIndex]?.CompanyName
                                                        }
                                                        autoComplete="off"
                                                      />
                                                    </div>
                                                    <FieldArray
                                                      name={`Users[${userIndex}].Addresses`}
                                                      render={() => (
                                                        <div>
                                                          {values?.Users[userIndex]?.Addresses?.map(
                                                            (_item, index) => (
                                                              <Fragment key={index}>
                                                                <div className="mb-2 ">
                                                                  <label className="block mb-2 text-sm font-medium text-black">
                                                                    Address
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder="Address"
                                                                      name={`Users[${userIndex}].Addresses[${index}].Address1`}
                                                                      value={
                                                                        values?.Users[userIndex]
                                                                          ?.Addresses[index]
                                                                          .Address1
                                                                      }
                                                                      autoComplete="off"
                                                                    />
                                                                  </div>
                                                                </div>
                                                                <div className="mb-2 ">
                                                                  <label className="block mb-2 text-sm font-medium text-black">
                                                                    City
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder="City"
                                                                      name={`Users[${userIndex}].Addresses[${index}].City`}
                                                                      value={
                                                                        values?.Users[userIndex]
                                                                          ?.Addresses[index].City
                                                                      }
                                                                      autoComplete="off"
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </Fragment>
                                                            )
                                                          )}
                                                        </div>
                                                      )}
                                                    />
                                                    <FieldArray
                                                      name={`Users[${userIndex}].Documents`}
                                                      render={() => (
                                                        <div>
                                                          {values?.Users[userIndex]?.Documents?.map(
                                                            (_item, index) => (
                                                              <Fragment key={index}>
                                                                <div className="mb-2 ">
                                                                  <label className="block mb-2 text-sm font-medium text-black">
                                                                    Document TypeCode
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder="Document TypeCode"
                                                                      name={`Users[${userIndex}].Documents[${index}].DocumentTypeCode`}
                                                                      value={
                                                                        values?.Users[userIndex]
                                                                          ?.Documents[index]
                                                                          .DocumentTypeCode
                                                                      }
                                                                      autoComplete="off"
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </Fragment>
                                                            )
                                                          )}
                                                        </div>
                                                      )}
                                                    />
                                                    {tabIndex > 0 && (
                                                      <div className="flex justify-center mb-3">
                                                        <label
                                                          htmlFor="default-checkbox"
                                                          className="font-medium text-lg text-red cursor-pointer"
                                                          onClick={() => {
                                                            setShowModal(true);
                                                            document.body.style.overflow = 'hidden';
                                                          }}
                                                        >
                                                          Remove Family Member
                                                        </label>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </Fragment>
                                            ))}
                                            <div className="flex gap-5">
                                              {tabIndex !== 0 && firstNames?.length > 1 && (
                                                <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                                                  <button
                                                    type="button"
                                                    className={`w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center `}
                                                    onClick={() => {
                                                      if (tabIndex > 0) {
                                                        values?.Users[tabIndex]?.FirstName?.length >
                                                        0
                                                          ? firstNames?.splice(
                                                              tabIndex,
                                                              1,
                                                              values?.Users[tabIndex]?.FirstName
                                                            )
                                                          : firstNames?.splice(
                                                              tabIndex,
                                                              1,
                                                              'Passenger'
                                                            );
                                                      }
                                                      setTabIndex(() => tabIndex - 1);
                                                    }}
                                                  >
                                                    Previous
                                                  </button>
                                                </div>
                                              )}
                                              <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                                                <button
                                                  type={'button'}
                                                  className={`w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center ${
                                                    getValidation(values?.Users[tabIndex])
                                                      ? 'cursor-pointer'
                                                      : 'opacity-40 cursor-not-allowed'
                                                  } `}
                                                  onClick={() => {
                                                    if (tabIndex === firstNames?.length - 1) {
                                                      handleSubmit();
                                                    } else {
                                                      getValidation(values?.Users[tabIndex]) &&
                                                        setTabIndex(() => tabIndex + 1);
                                                      values?.Users[tabIndex]?.FirstName?.length > 0
                                                        ? firstNames?.splice(
                                                            tabIndex,
                                                            1,
                                                            values?.Users[tabIndex]?.FirstName
                                                          )
                                                        : firstNames?.splice(
                                                            tabIndex,
                                                            1,
                                                            'Passenger'
                                                          );
                                                    }
                                                  }}
                                                >
                                                  {tabIndex === firstNames?.length - 1
                                                    ? 'Submit'
                                                    : 'Next'}
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
                            )}
                          />
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            load?.name === 'save' && <SavingDataLoader open={load?.show} />
          )}
        </>
      ) : (
        <div className="mb-10 ml-10">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          User Not Logged In.
          <br />
          <br />
          <button className="cursor-pointer" onClick={() => router.push('/signin')}>
            SignIn Page
          </button>
        </div>
      )}
    </main>
  );
};

export default MyFamilyDetails;
