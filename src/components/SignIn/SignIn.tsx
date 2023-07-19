import * as Yup from 'yup';
import Image from 'next/image';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik, ErrorMessage, Field } from 'formik';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import FindYourBookingLoader from '../Loader/FindYourBooking';
import { postModifyBooking } from 'src/redux/action/SearchFlights';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const findBookingContent = useSelector(
    (state: RootState) => state?.sitecore?.findBooking?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <>
      {!load?.show ? (
        <div>
          <div>
            <div className="xl:flex ">
              <div>
                <div className=" xl:bg-cadetgray xs:bg-white xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none xl:left-0 inherit xs:absolute xs:left-3  xl:top-14 xl:w-3/4  xs:w-full ">
                  <div>
                    <div className="xl:relative xl:w-2/4 xl:m-auto  xl:top-10  xs:absolute xs:top-24 items-center justify-center  gap-3 h-0  z-50 ">
                      <div
                        className="xl:py-3 xs:py-0 cursor-pointer"
                        onClick={() => router.push('/')}
                      >
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          aria-hidden="true"
                          className="xl:text-black xs:text-white text-sm font-black h-4 w-4"
                        />
                        <span className="px-2 xl:text-black xs:text-white   text-sm font-black">
                          {getFieldName(findBookingContent, 'backButton')}
                        </span>
                      </div>
                      <div className="xs:px-0 xl:px-0 my-2 h-full items-center justify-center relative gap-3">
                        <h1 className="text-4xl font-black xs:text-white xl:text-black family-style">
                          {/* {getFieldName(findBookingContent, 'heading')} */}
                          Sign In To Beond
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-64 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                <Image
                  src={getImageSrc(findBookingContent, 'banner') as string}
                  className="xs:absolute  inset-0 h-full w-full object-cover"
                  alt=""
                  height={200}
                  width={160}
                />
              </div>
            </div>
            <div className="banner-fix xl:w-full ">
              <Formik
                initialValues={{
                  PnrCode: '',
                  PassengerName: '',
                }}
                validationSchema={Yup.object().shape({
                  PassengerName: Yup.string().required(
                    getFieldName(findBookingContent, 'errorMessage')
                  ),
                  PnrCode: Yup.string().required(getFieldName(findBookingContent, 'errorMessage')),
                })}
                onSubmit={(values) => {
                  dispatch(
                    loader({
                      show: true,
                      name: 'findbooking',
                    })
                  );
                  dispatch(
                    postModifyBooking(
                      { ...values, ID: values?.PnrCode },
                      router
                    ) as unknown as AnyAction
                  );
                }}
              >
                {({ handleSubmit, values }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="xl:bg-cadetgray xs:bg-white xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute  xl:top-4  xs:top-52 width-auto xl:w-3/4 ">
                      <div className="px-2 ">
                        <div className="xl:w-2/4 xl:m-auto">
                          <div className="py-4 xl:mt-48 text-sm font-medium   text-black bg-white p-3 rounded-lg ">
                            <div className="mb-2">
                              <label className="block mb-2 text-sm font-medium text-black">
                                {/* {getFieldName(findBookingContent, 'lastName')} */}
                                Email Address
                              </label>
                              <Field
                                type="text"
                                name="PassengerName"
                                value={values?.PassengerName}
                                className="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                // placeholder={getFieldName(
                                //   findBookingContent,
                                //   'lastNamePlaceholder'
                                // )}
                                placeholder="Enter Email"
                                autoComplete="off"
                              />
                              <ErrorMessage
                                component="p"
                                name="PassengerName"
                                className="text-xs text-red"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-black">
                                {/* {getFieldName(findBookingContent, 'bookingReferenceNumber')} */}
                                Password
                              </label>
                              <Field
                                type="text"
                                name="PnrCode"
                                value={values?.PnrCode}
                                className="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                // placeholder={getFieldName(
                                //   findBookingContent,
                                //   'bookingReferenceNumberPlaceholder'
                                // )}
                                placeholder="Enter Password"
                                autoComplete="off"
                              />
                              <ErrorMessage
                                component="p"
                                name="PnrCode"
                                className="text-xs text-red"
                              />
                            </div>
                            <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                              <button
                                type="submit"
                                className={`w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center ${
                                  values?.PassengerName?.length > 0 && values?.PnrCode?.length > 0
                                    ? ''
                                    : 'opacity-30 cursor-not-allowed'
                                }`}
                              >
                                {/* {getFieldName(findBookingContent, 'findBookingButton')} */}
                                Log In
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
          <div className="xs:not-sr-only	xl:sr-only">
            <div className="w-full h-36 overflow-hidden absolute bottom-0">
              <Image
                src={getImageSrc(findBookingContent, 'bottomBanner') as string}
                className="xs:absolute  inset-0 h-full w-full object-cover"
                alt=""
                height={200}
                width={160}
              />
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
            </div>
          </div>
        </div>
      ) : (
        load.name === 'findbooking' && <FindYourBookingLoader open={load?.show} />
      )}
    </>
  );
};

export default SignIn;
