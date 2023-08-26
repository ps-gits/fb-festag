import * as Yup from 'yup';
import Image from 'next/image';
import { AnyAction } from 'redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik, ErrorMessage, Field } from 'formik';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import SignInLoader from 'components/Loader/SignInLoader';
import { postSignIn } from 'src/redux/action/CreateAccount';
import SavingDataLoader from 'components/Loader/SavingData';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const createAccountContent = useSelector(
    (state: RootState) => state?.sitecore?.createAccount?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);

  useEffect(() => {
    // createAccountContent === undefined &&
    dispatch(getSitecoreContent('Date-Modal') as unknown as AnyAction);
    dispatch(getSitecoreContent('Create-Account') as unknown as AnyAction);
  }, [dispatch]);

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
                          {getFieldName(createAccountContent, 'backButton')}
                        </span>
                      </div>
                      <div className="xs:px-0 xl:px-0 my-2 h-full items-center justify-center relative gap-3">
                        <h1 className="text-4xl font-black xs:text-white xl:text-black family-style">
                          {getFieldName(createAccountContent, 'signInHeading')}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-64 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                <Image
                  src={getImageSrc(createAccountContent, 'banner') as string}
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
                  Login: '',
                  Password: '',
                }}
                validationSchema={Yup.object().shape({
                  Login: Yup.string()
                    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Must be valid email')
                    .required('This field is required')
                    .max(100, 'Max 100 Characters Allowed'),
                  Password: Yup.string()
                    .min(5, 'Min 5 Character Required')
                    .required('This field is required'),
                })}
                onSubmit={(values) => {
                  dispatch(
                    loader({
                      show: true,
                      name: 'signin',
                    })
                  );
                  dispatch(postSignIn(values, router) as unknown as AnyAction);
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
                                {getFieldName(createAccountContent, 'email')}
                              </label>
                              <Field
                                type="text"
                                name="Login"
                                value={values?.Login}
                                className="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder={getFieldName(createAccountContent, 'email')}
                                autoComplete="off"
                              />
                              <ErrorMessage
                                component="p"
                                name="Login"
                                className="text-xs text-red"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-black">
                                {getFieldName(createAccountContent, 'password')}
                              </label>
                              <Field
                                type="password"
                                name="Password"
                                value={values?.Password}
                                className="bg-white border border-graylight text-black text-sm rounded-md focus:ring-blue focus:border-blue block w-full p-2.5    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder={getFieldName(createAccountContent, 'password')}
                                autoComplete="off"
                              />
                              <ErrorMessage
                                component="p"
                                name="Password"
                                className="text-xs text-red"
                              />
                            </div>
                            <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                              <button
                                type="submit"
                                className={`w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center ${
                                  values?.Login?.length > 0 && values?.Password?.length > 0
                                    ? ''
                                    : 'opacity-30 cursor-not-allowed'
                                }`}
                              >
                                {getFieldName(createAccountContent, 'signInButton')}
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
                src={getImageSrc(createAccountContent, 'bottomBanner') as string}
                className="xs:absolute  inset-0 h-full w-full object-cover"
                alt=""
                height={200}
                width={160}
              />
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
            </div>
          </div>
        </div>
      ) : load.name === 'save' ? (
        <SavingDataLoader open={load?.show} />
      ) : (
        load?.name === 'signin' && <SignInLoader open={load?.show} />
      )}
    </>
  );
};

export default SignIn;
