import * as Yup from 'yup';
// import moment from 'moment';
import Image from 'next/image';
import Select from 'react-select';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { faAngleLeft, faLock } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import SavingDataLoader from 'components/Loader/SavingData';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import { postCreateAccount } from 'src/redux/action/CreateAccount';
// import DateOfBirthModal from 'components/Modal/DateOfBirthModal';
import { civilityCodeOptions } from 'components/Select/SelectOptions';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const CreateAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const optionalFields = [
    // 'Ref',
    // 'TypeCode',
    // 'Currency',
    'MiddleName',
    // 'CultureName',
    // 'CompanyName',
  ];

  const optionalArrayValues = [
    {
      name: 'Emails',
      fields: [],
    },
    // {
    //   name: 'Phones',
    //   fields: ['PhoneTypeCode', 'PhoneLocationTypeCode'],
    // },
    // {
    //   name: 'Addresses',
    //   fields: ['Ref', 'City', 'TypeCode', 'ZipCode', 'Address1', 'CountryNameOrCode'],
    // },
    // {
    //   name: 'Documents',
    //   fields: [
    //     'Ref',
    //     'Gender',
    //     'Surname',
    //     'Firstname',
    //     'DocumentNumber',
    //     'DocumentTypeCode',
    //     'IssueCountryCode',
    //     'DocumentExpiryDate',
    //     'DocumentIssuanceDate',
    //     'NationalityCountryCode',
    //   ],
    // },
  ];

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const createAccountContent = useSelector(
    (state: RootState) => state?.sitecore?.createAccount?.fields
  );
  // const dateOfBirthModalContent = useSelector(
  //   (state: RootState) => state?.sitecore?.passengerDetails?.fields
  // );
  const load = useSelector((state: RootState) => state?.loader?.loader);

  // const [dateModal, setDateModal] = useState(false);

  useEffect(() => {
    dispatch(getSitecoreContent('Create-Account') as unknown as AnyAction);
    dispatch(getSitecoreContent('Passenger-Details') as unknown as AnyAction);
  }, [dispatch]);

  const getValidation = (values: createAccountValues) => {
    let isValid = true;
    Object.keys(values)?.map((item) => {
      const fieldValue = values[item as keyof createAccountValues];
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
    return values?.Password !== values?.ConfirmPassword ? false : isValid;
  };

  return (
    <div
    // onClick={() => {
    //   const modalDob = document.getElementById('modal-dob');
    //   window.onclick = function (event) {
    //     if (event.target == modalDob) {
    //       setDateModal(false);
    //       document.body.style.overflow = 'unset';
    //     }
    //   };
    // }}
    >
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
              <Formik
                enableReinitialize={true}
                initialValues={{
                  CivilityCode: '',
                  Emails: [{ Email: '', Type: 'Primary' }],
                  FirstName: '',
                  Surname: '',
                  MiddleName: '',
                  Password: '',
                  ConfirmPassword: '',
                  // Phones: [
                  //   {
                  //     PhoneNumber: '',
                  //     PhoneTypeCode: '',
                  //     PhoneLocationTypeCode: '',
                  //   },
                  // ],
                  // TypeCode: '',
                  // CultureName: '',
                  // Currency: '',
                  // Login: '',
                  // CompanyName: '',
                  // BirthDate: '',
                  // Addresses: [
                  //   {
                  //     Ref: '',
                  //     TypeCode: '',
                  //     Address1: '',
                  //     ZipCode: '',
                  //     City: '',
                  //     CountryNameOrCode: '',
                  //   },
                  // ],
                  // Documents: [
                  //   {
                  //     Ref: '',
                  //     IssueCountryCode: '',
                  //     NationalityCountryCode: '',
                  //     Gender: '',
                  //     DocumentExpiryDate: '',
                  //     DocumentIssuanceDate: '',
                  //     Firstname: '',
                  //     Surname: '',
                  //     DocumentTypeCode: '',
                  //     DocumentNumber: '',
                  //   },
                  // ],
                }}
                validationSchema={Yup.object().shape({
                  CivilityCode: Yup.string().required('This field is required'),
                  FirstName: Yup.string()
                    .required('This field is required')
                    .max(60, 'Max 60 Characters Allowed'),
                  Surname: Yup.string()
                    .required('This field is required')
                    .max(60, 'Max 60 Characters Allowed'),
                  MiddleName: Yup.string().max(60, 'Max 60 Characters Allowed'),
                  // Login: Yup.string().required('This field is required'),
                  // BirthDate: Yup.string().required('This field is required'),
                  Password: Yup.string()
                    .min(5, 'Min 5 Character Required')
                    .required('This field is required'),
                  ConfirmPassword: Yup.string()
                    .oneOf([Yup.ref('Password')], 'Passwords must match')
                    .min(5, 'Min 5 Character Required')
                    .required('This field is required'),
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
                  // Phones: Yup.array().of(
                  //   Yup.object().shape({
                  //     PhoneNumber: Yup.string().required('This field is required'),
                  //   })
                  // ),
                })}
                onSubmit={(values) => {
                  dispatch(
                    loader({
                      show: true,
                      name: 'save',
                    })
                  );
                  const postData = JSON.parse(JSON.stringify(values));
                  delete postData?.ConfirmPassword;
                  dispatch(postCreateAccount(postData, router) as unknown as AnyAction);
                }}
              >
                {({ values, handleSubmit, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="xs:w-full rounded-lg xl:w-2/4 xl:m-auto   md:m-auto xl:py-0 xl:mt-6 xs:mt-0 xs:pt-20">
                      <div className="flex justify-between items-center xl:py-0 xs:py-3">
                        <div
                          className="xl:py-3 xs:py-0 cursor-pointer"
                          onClick={() => router.push('/')}
                        >
                          <FontAwesomeIcon
                            icon={faAngleLeft}
                            aria-hidden="true"
                            className="text-black text-sm font-black h-4 w-4"
                          />
                          <span className="px-2 text-black text-sm font-black">
                            {getFieldName(createAccountContent, 'backButton')}
                          </span>
                        </div>
                      </div>
                      {/* <DateOfBirthModal
                      id="modal-dob"
                      type="createAccount"
                      closeModal={() => {
                        setDateModal(false);
                        document.body.style.overflow = 'unset';
                      }}
                      showModal={dateModal}
                      setFieldValue={setFieldValue}
                      name="Adult"
                      selectedDate={values?.BirthDate}
                    /> */}
                      <div>
                        <h1 className="text-2xl font-black  text-black">
                          {getFieldName(createAccountContent, 'heading')}
                        </h1>
                      </div>
                      <div className="bg-white px-3   my-2 xs:my-5 w-full rounded-lg  xl:py-3 xs:py-2 ">
                        <div className="mb-2 ">
                          <label className="block mb-2 text-sm font-medium text-black">
                            {getFieldName(createAccountContent, 'title')}
                          </label>
                          <Select
                            options={civilityCodeOptions}
                            className=" text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={getFieldName(createAccountContent, 'title')}
                            value={
                              values?.CivilityCode?.length > 0
                                ? {
                                    label: values?.CivilityCode,
                                    value: values?.CivilityCode,
                                  }
                                : ''
                            }
                            name="CivilityCode"
                            onChange={(e) => {
                              if (e !== null) {
                                setFieldValue(
                                  `CivilityCode`,
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
                            name="CivilityCode"
                            component="span"
                            className="text-xs text-red"
                          />
                        </div>

                        <div className="mb-2 ">
                          <label className="block mb-2 text-sm font-medium text-black">
                            {getFieldName(createAccountContent, 'firstName')}
                          </label>
                          <Field
                            type="text"
                            className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                            placeholder={getFieldName(createAccountContent, 'firstName')}
                            name="FirstName"
                            value={values?.FirstName}
                            autoComplete="off"
                            onChange={(e: { target: { value: string } }) => {
                              setFieldValue(`FirstName`, e.target.value.replace(/[^A-Z]/gi, ''));
                            }}
                          />
                          <ErrorMessage
                            name="FirstName"
                            component="span"
                            className="text-xs text-red"
                          />
                        </div>
                        <div className="mb-2 ">
                          <label className="block mb-2 text-sm font-medium text-black">
                            {getFieldName(createAccountContent, 'middleName')}
                          </label>
                          <Field
                            type="text"
                            className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                            placeholder={getFieldName(createAccountContent, 'middleName')}
                            name="MiddleName"
                            value={values?.MiddleName}
                            autoComplete="off"
                            onChange={(e: { target: { value: string } }) => {
                              setFieldValue(`MiddleName`, e.target.value.replace(/[^A-Z]/gi, ''));
                            }}
                          />
                          <ErrorMessage
                            name="MiddleName"
                            component="span"
                            className="text-xs text-red"
                          />
                        </div>
                        <div className="mb-2 ">
                          <label className="block mb-2 text-sm font-medium text-black">
                            {getFieldName(createAccountContent, 'lastName')}
                          </label>
                          <Field
                            type="text"
                            className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                            placeholder={getFieldName(createAccountContent, 'lastName')}
                            name="Surname"
                            value={values?.Surname}
                            autoComplete="off"
                            onChange={(e: { target: { value: string } }) => {
                              setFieldValue(`Surname`, e.target.value.replace(/[^A-Z]/gi, ''));
                            }}
                          />
                          <ErrorMessage
                            name="Surname"
                            component="span"
                            className="text-xs text-red"
                          />
                        </div>
                        <div className="mb-2 ">
                          <FieldArray
                            name="Emails"
                            render={() => (
                              <div>
                                {values?.Emails?.map((_item, index) => (
                                  <Fragment key={index}>
                                    <label className="block mb-2 text-sm font-medium text-black">
                                      {getFieldName(createAccountContent, 'email')}
                                    </label>
                                    <div className="relative">
                                      <Field
                                        type="text"
                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                        placeholder={getFieldName(createAccountContent, 'email')}
                                        name={`Emails[${index}].Email`}
                                        value={values?.Emails[index].Email}
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
                                      name={`Emails[${index}].Email`}
                                      component="span"
                                      className="text-xs text-red"
                                    />
                                  </Fragment>
                                ))}
                              </div>
                            )}
                          />
                        </div>
                        {/* <FieldArray
                        name="Phones"
                        render={() => (
                          <div>
                            {values?.Phones?.map((_item, index) => (
                              <Fragment key={index}>
                                <div className="mb-2 ">
                                  <label className="block mb-2 text-sm font-medium text-black">
                                    Phone Number
                                  </label>
                                  <div className="relative">
                                    <Field
                                      type="text"
                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                      placeholder="Phone Number"
                                      name={`Phones[${index}].PhoneNumber`}
                                      value={values?.Phones[index].PhoneNumber}
                                      autoComplete="off"
                                    />
                                  </div>
                                  <ErrorMessage
                                    name={`Phones[${index}].PhoneNumber`}
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
                                      name={`Phones[${index}].PhoneTypeCode`}
                                      value={values?.Phones[index].PhoneTypeCode}
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
                                      name={`Phones[${index}].PhoneLocationTypeCode`}
                                      value={values?.Phones[index].PhoneLocationTypeCode}
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        )}
                      /> */}
                        {/* <div className="mb-2 ">
                        <label className="block mb-2 text-sm font-medium text-black">
                          Username
                        </label>
                        <Field
                          type="text"
                          className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                          placeholder="Username"
                          name="Login"
                          value={values?.Login}
                        />
                        <ErrorMessage name="Login" component="span" className="text-xs text-red" />
                      </div> */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            {getFieldName(createAccountContent, 'password')}
                          </label>
                          <Field
                            type="password"
                            className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                            placeholder={getFieldName(createAccountContent, 'password')}
                            name="Password"
                            value={values?.Password}
                            autoComplete="off"
                          />
                        </div>
                        <ErrorMessage
                          name="Password"
                          component="span"
                          className="text-xs text-red"
                        />
                        <div className="mb-2"></div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            {getFieldName(createAccountContent, 'confirmPassword')}
                          </label>
                          <Field
                            type="password"
                            className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                            placeholder={getFieldName(createAccountContent, 'confirmPassword')}
                            name="ConfirmPassword"
                            value={values?.ConfirmPassword}
                            autoComplete="off"
                          />
                        </div>
                        <ErrorMessage
                          name="ConfirmPassword"
                          component="span"
                          className="text-xs text-red"
                        />
                        <div className="mb-2"></div>
                        {/* <div className="mb-2 ">
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
                            name="BirthDate"
                            value={
                              values?.BirthDate?.length > 0
                                ? moment(new Date(values?.BirthDate))
                                    .format('MM-DD-YYYY')
                                    ?.replaceAll('-', '/')
                                : ''
                            }
                            disabled
                            autoComplete="off"
                          />
                          <div className="absolute right-5 top-3 text-slategray">
                            <FontAwesomeIcon icon={faCalendarDays} aria-hidden="true" />
                          </div>
                        </div>
                        <ErrorMessage
                          name="BirthDate"
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
                          name="TypeCode"
                          value={values?.TypeCode}
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
                          name="CultureName"
                          value={values?.CultureName}
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
                          name="Currency"
                          value={values?.Currency}
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
                          name="CompanyName"
                          value={values?.CompanyName}
                        />
                      </div>
                      <FieldArray
                        name="Addresses"
                        render={() => (
                          <div>
                            {values?.Addresses?.map((_item, index) => (
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
                                      name={`Addresses[${index}].Address1`}
                                      value={values?.Addresses[index].Address1}
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
                                      name={`Addresses[${index}].City`}
                                      value={values?.Addresses[index].City}
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        )}
                      />
                      <FieldArray
                        name="Documents"
                        render={() => (
                          <div>
                            {values?.Documents?.map((_item, index) => (
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
                                      name={`Documents[${index}].DocumentTypeCode`}
                                      value={values?.Documents[index].DocumentTypeCode}
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        )}
                      /> */}
                      </div>
                      <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                        <button
                          type="submit"
                          className={`w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center ${
                            getValidation(values) ? '' : 'opacity-40'
                          } `}
                        >
                          {getFieldName(createAccountContent, 'createAccountButton')}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      ) : (
        load.name === 'save' && <SavingDataLoader open={load?.show} />
      )}
    </div>
  );
};

export default CreateAccount;
