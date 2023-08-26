import * as Yup from 'yup';
import Image from 'next/image';
import Select from 'react-select';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useState, Fragment } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { faAngleLeft, faCalendarDays, faLock, faPlus } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import { ComponentProps } from 'lib/component-props';
import SavingDataLoader from 'components/Loader/SavingData';
import DateOfBirthModal from 'components/Modal/DateOfBirthModal';
import { postPassengerUpdate } from 'src/redux/action/CreateAccount';
import { civilityCodeOptions } from 'components/Select/SelectOptions';
import PassengeRemoveModal from 'components/Modal/PassengeRemoveModal';
import { setSavedFamilyDetails } from 'src/redux/reducer/CreateAccount';

type MyFamilyProps = ComponentProps & {
  fields: {
    heading: {
      value: string;
    };
    back: {
      value: string;
    };
    description: {
      value: string;
    };
    you: {
      value: string;
    };
    addButton: {
      value: string;
    };
    submitButton: {
      value: string;
    };
    nextButton: {
      value: string;
    };
    familyMemberRemove: {
      value: string;
    };
    previousButton: {
      value: string;
    };
    notLoggedIn: {
      value: string;
    };
    signIn: {
      value: string;
    };
    phoneNumberPlace: {
      value: string;
    };
    dobPlaceHolder: {
      value: string;
    };
    CivilityCode: string;
    passengerBlue: {
      value: {
        src: string;
        alt: string;
        width: string;
        height: string;
      };
    };
    passengerOrange: {
      value: {
        src: string;
        alt: string;
        width: string;
        height: string;
      };
    };
    sideBanner: {
      value: {
        src: string;
        alt: string;
        width: string;
        height: string;
      };
    };
    calenderIcon: {
      value: {
        src: string;
        alt: string;
        width: string;
        height: string;
      };
    };
    Emails: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        Email: {
          value: string;
        };
        Type: {
          value: string;
        };
      };
    }[];
    FirstName: string;
    Surname: string;
    MiddleName: string;
    Phones: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        flagPhone: {
          value: string;
        };
        validPhone: {
          value: string;
        };
        PhoneNumber: {
          value: string;
        };
        PhoneTypeCode: {
          value: string;
        };
        PhoneLocationTypeCode: {
          value: string;
        };
      };
    }[];
    TypeCode: string;
    CultureName: string;
    Currency: string;
    Login: string;
    CompanyName: string;
    BirthDate: string;
    Addresses: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        Ref: {
          value: string;
        };
        TypeCode: {
          value: string;
        };
        Address1: {
          value: string;
        };
        ZipCode: {
          value: string;
        };
        City: {
          value: string;
        };
        CountryNameOrCode: {
          value: string;
        };
      };
    }[];
    Documents: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        Ref: {
          value: string;
        };
        IssueCountryCode: {
          value: string;
        };
        NationalityCountryCode: {
          value: string;
        };
        Gender: {
          value: string;
        };
        DocumentExpiryDate: {
          value: string;
        };
        DocumentIssuanceDate: {
          value: string;
        };
        Firstname: {
          value: string;
        };
        Surname: {
          value: string;
        };
        DocumentTypeCode: {
          value: string;
        };
        DocumentNumber: {
          value: string;
        };
      };
    }[];
  };
};

const MyFamily = (props: MyFamilyProps): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();

  const fieldsUpperCase = {} as familyFieldValues;
  Object.keys(props?.fields).map((item) => {
    if (/^[A-Z]/.test(item)) {
      fieldsUpperCase[item as keyof familyFieldValues] = (
        props?.fields as unknown as familyFieldValues
      )[item as keyof familyFieldValues] as string &
        { Email: string; Type: string }[] &
        {
          flagPhone: string;
          validPhone: string;
          PhoneNumber: string;
          PhoneTypeCode: string;
          PhoneLocationTypeCode: string;
        }[] &
        {
          Ref: string;
          TypeCode: string;
          Address1: string;
          ZipCode: string;
          City: string;
          CountryNameOrCode: string;
        }[] &
        {
          Ref: string;
          IssueCountryCode: string;
          NationalityCountryCode: string;
          Gender: string;
          DocumentExpiryDate: string;
          DocumentIssuanceDate: string;
          Firstname: string;
          Surname: string;
          DocumentTypeCode: string;
          DocumentNumber: string;
        }[];
    }
  });

  const optionalFields: string[] = [
    // 'Login',
    // 'TypeCode',
    // 'Currency',
    // 'MiddleName',
    // 'CultureName',
    // 'CompanyName',
  ];

  const optionalArrayValues: { name: string; fields: string[] }[] = [
    // {
    //   name: 'Emails',
    //   fields: [],
    // },
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

  const finalFieldsObject = {} as familyFieldValues;
  const displayFields = {} as {
    City: string;
    Email: string;
    Surname: string;
    Address1: string;
    Currency: string;
    TypeCode: string;
    BirthDate: string;
    FirstName: string;
    MiddleName: string;
    CultureName: string;
    CompanyName: string;
    PhoneNumber: string;
    CivilityCode: string;
    PhoneTypeCode: string;
    DocumentTypeCode: string;
    PhoneLocationTypeCode: string;
  };

  Object.keys(fieldsUpperCase).map((item) => {
    if (Array.isArray(fieldsUpperCase[item as keyof familyFieldValues])) {
      const arrayFields = {} as {
        Email: string;
      };

      (
        fieldsUpperCase[item as keyof familyFieldValues] as unknown as {
          fields: { field: { value: string } };
        }[]
      ).map((dt) => {
        const optionalFieldsName: string[] = [];
        Object.keys(dt?.fields).map((key) => {
          if (
            dt?.fields[
              key as keyof {
                field: {
                  value: string;
                };
              }
            ].value?.length &&
            dt?.fields[
              key as keyof {
                field: {
                  value: string;
                };
              }
            ].value?.includes('&')
          ) {
            arrayFields[
              dt?.fields[
                key as keyof {
                  field: {
                    value: string;
                  };
                }
              ].value?.split('&')[0] as keyof {
                Email: string;
              }
            ] = '';
            displayFields[
              dt?.fields[
                key as keyof {
                  field: {
                    value: string;
                  };
                }
              ].value?.split('&')[0] as keyof {
                Email: string;
              }
            ] =
              dt?.fields[
                key as keyof {
                  field: {
                    value: string;
                  };
                }
              ].value?.split('&')[1] === 'isOptional=true'
                ? dt?.fields[
                    key as keyof {
                      field: {
                        value: string;
                      };
                    }
                  ].value?.split('&')[0]
                : dt?.fields[
                    key as keyof {
                      field: {
                        value: string;
                      };
                    }
                  ].value?.split('&')[1];

            const isOptional =
              dt?.fields[
                key as keyof {
                  field: {
                    value: string;
                  };
                }
              ].value?.split('&');

            isOptional[isOptional?.length - 1] === 'isOptional=true' &&
              !optionalFieldsName?.includes(isOptional[0]) &&
              optionalFieldsName?.push(isOptional[0]);
          } else if (
            dt?.fields[
              key as keyof {
                field: {
                  value: string;
                };
              }
            ].value?.length
          ) {
            arrayFields[
              dt?.fields[
                key as keyof {
                  field: {
                    value: string;
                  };
                }
              ].value as keyof {
                Email: string;
              }
            ] = '';
            displayFields[
              dt?.fields[
                key as keyof {
                  field: {
                    value: string;
                  };
                }
              ].value as keyof {
                Email: string;
              }
            ] = dt?.fields[
              key as keyof {
                field: {
                  value: string;
                };
              }
            ].value as keyof {
              Email: string;
            };
          }
        });
        optionalArrayValues?.push({
          name: item,
          fields: optionalFieldsName,
        });
      });
      finalFieldsObject[
        item as keyof {
          Emails: string;
        }
      ] = [
        arrayFields as { Email: string; Type: string } & {
          flagPhone: string;
          validPhone: string;
          PhoneNumber: string;
          PhoneTypeCode: string;
          PhoneLocationTypeCode: string;
        } & string & {
            Ref: string;
            TypeCode: string;
            Address1: string;
            ZipCode: string;
            City: string;
            CountryNameOrCode: string;
          } & {
            Ref: string;
            IssueCountryCode: string;
            NationalityCountryCode: string;
            Gender: string;
            DocumentExpiryDate: string;
            DocumentIssuanceDate: string;
            Firstname: string;
            Surname: string;
            DocumentTypeCode: string;
            DocumentNumber: string;
          },
      ];
    } else {
      finalFieldsObject[item as keyof familyFieldValues] = '' as string &
        { Email: string; Type: string }[] &
        {
          flagPhone: string;
          validPhone: string;
          PhoneNumber: string;
          PhoneTypeCode: string;
          PhoneLocationTypeCode: string;
        }[] &
        {
          Ref: string;
          TypeCode: string;
          Address1: string;
          ZipCode: string;
          City: string;
          CountryNameOrCode: string;
        }[] &
        {
          Ref: string;
          IssueCountryCode: string;
          NationalityCountryCode: string;
          Gender: string;
          DocumentExpiryDate: string;
          DocumentIssuanceDate: string;
          Firstname: string;
          Surname: string;
          DocumentTypeCode: string;
          DocumentNumber: string;
        }[];

      const getOptionalFields = (
        fieldsUpperCase[item as keyof familyFieldValues] as unknown as { value: string }
      )?.value?.split('&');

      getOptionalFields[getOptionalFields?.length - 1] === 'isOptional=true' &&
        !optionalFields?.includes(item) &&
        optionalFields?.push(item);

      displayFields[
        item as keyof {
          Email: string;
        }
      ] = (
        fieldsUpperCase[item as keyof familyFieldValues] as unknown as { value: string }
      )?.value?.includes('&')
        ? (
            fieldsUpperCase[item as keyof familyFieldValues] as unknown as { value: string }
          )?.value?.split('&')[1] === 'isOptional=true'
          ? (
              fieldsUpperCase[item as keyof familyFieldValues] as unknown as { value: string }
            )?.value?.split('&')[0]
          : (
              fieldsUpperCase[item as keyof familyFieldValues] as unknown as { value: string }
            )?.value?.split('&')[1]
        : (fieldsUpperCase[item as keyof familyFieldValues] as unknown as { value: string })?.value;
    }
  });

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
    const allKeys = Object.keys(finalFieldsObject)
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
                        src={props.fields.sideBanner.value.src}
                        className="xs:absolute  inset-0 h-full w-full object-cover"
                        alt=""
                        height={974}
                        width={504}
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
                          <span className="px-2 text-black text-sm font-black">
                            {props.fields.back.value}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div>
                          <h1 className="text-2xl font-black  text-black">
                            {props.fields.heading.value}
                          </h1>
                        </div>
                        <div className="py-1">
                          <p className="font-medium text-sm text-pearlgray">
                            {props.fields.description.value}
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
                                                        index === tabIndex
                                                          ? `${props.fields.passengerBlue.value.src}`
                                                          : `${props.fields.passengerOrange.value.src}`
                                                      }
                                                      alt=""
                                                      width={17}
                                                      height={17}
                                                    />
                                                    {index === 0
                                                      ? `${item
                                                          ?.charAt(0)
                                                          ?.toUpperCase()}${item?.slice(1)} ${
                                                          props.fields.you.value
                                                        }`
                                                      : // item?.charAt(0)?.toUpperCase() +
                                                        //   item?.slice(1) +
                                                        //   {props.fields.you.value}
                                                        item?.charAt(0)?.toUpperCase() +
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
                                                    finalFieldsObject
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
                                                  {props.fields.addButton.value}
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
                                              name="Child"
                                              selectedDate={values?.Users[tabIndex]?.BirthDate}
                                            />
                                            {values?.Users?.map((_userInfo, userIndex: number) => (
                                              <Fragment key={userIndex}>
                                                {tabIndex === userIndex && (
                                                  <div className="bg-white px-3   my-2 xs:my-5 w-full rounded-lg  xl:py-3 xs:py-2 ">
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        {displayFields?.CivilityCode}
                                                      </label>
                                                      <Select
                                                        options={civilityCodeOptions}
                                                        className=" text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder={displayFields?.CivilityCode}
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
                                                        {displayFields.FirstName}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={displayFields.FirstName}
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
                                                        {displayFields.MiddleName}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={displayFields.MiddleName}
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
                                                        {displayFields.Surname}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={displayFields.Surname}
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
                                                                    {displayFields.Email}
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder={
                                                                        displayFields.Email
                                                                      }
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
                                                                        setFieldValue(
                                                                          `Users[${userIndex}].Emails[${index}].Type`,
                                                                          'Primary'
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
                                                                    {displayFields.PhoneNumber}
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
                                                                      placeholder={
                                                                        props.fields
                                                                          .phoneNumberPlace.value
                                                                      }
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
                                                                      inputClassName="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                                                    {displayFields.PhoneTypeCode}
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder={
                                                                        displayFields.PhoneTypeCode
                                                                      }
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
                                                                    {
                                                                      displayFields.PhoneLocationTypeCode
                                                                    }
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder={
                                                                        displayFields.PhoneLocationTypeCode
                                                                      }
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
                                                        {displayFields.BirthDate}
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
                                                          className="bg-white border cursor-pointer border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                          placeholder={
                                                            props.fields.dobPlaceHolder.value
                                                          }
                                                          name={`Users[${userIndex}].BirthDate`}
                                                          value={
                                                            values?.Users[userIndex]?.BirthDate
                                                              ?.length > 0
                                                              ? values?.Users[
                                                                  userIndex
                                                                ]?.BirthDate?.replaceAll('-', '/')
                                                              : ''
                                                          }
                                                          onFocus={() => {
                                                            setDateModal(true);
                                                            document.body.style.overflow = 'hidden';
                                                          }}
                                                          disabled={dateModal ? true : false}
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
                                                        {displayFields.TypeCode}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={displayFields.TypeCode}
                                                        name={`Users[${userIndex}].TypeCode`}
                                                        value={values?.Users[userIndex]?.TypeCode}
                                                        autoComplete="off"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        {displayFields.CultureName}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={displayFields.CultureName}
                                                        name={`Users[${userIndex}].CultureName`}
                                                        value={
                                                          values?.Users[userIndex]?.CultureName
                                                        }
                                                        autoComplete="off"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        {displayFields.Currency}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={displayFields.Currency}
                                                        name={`Users[${userIndex}].Currency`}
                                                        value={values?.Users[userIndex]?.Currency}
                                                        autoComplete="off"
                                                      />
                                                    </div>
                                                    <div className="mb-2 ">
                                                      <label className="block mb-2 text-sm font-medium text-black">
                                                        {displayFields.CompanyName}
                                                      </label>
                                                      <Field
                                                        type="text"
                                                        className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                        placeholder={displayFields.CompanyName}
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
                                                                    {displayFields.Address1}
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder={
                                                                        displayFields.Address1
                                                                      }
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
                                                                    {displayFields.City}
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder={
                                                                        displayFields.City
                                                                      }
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
                                                                    {displayFields.DocumentTypeCode}
                                                                  </label>
                                                                  <div className="relative">
                                                                    <Field
                                                                      type="text"
                                                                      className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                                                                      placeholder={
                                                                        displayFields.DocumentTypeCode
                                                                      }
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
                                                          {props.fields.familyMemberRemove.value}
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
                                                    {props.fields.previousButton.value}
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
                                                    ? `${props.fields.submitButton.value}`
                                                    : `${props.fields.nextButton.value}`}
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
          {props.fields.notLoggedIn.value}
          <br />
          <br />
          <button className="cursor-pointer" onClick={() => router.push('/signin')}>
            {props.fields.signIn.value}
          </button>
        </div>
      )}
    </main>
  );
};

export default withDatasourceCheck()<MyFamilyProps>(MyFamily);
