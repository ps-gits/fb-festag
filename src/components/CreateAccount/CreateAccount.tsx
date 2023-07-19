import React from 'react';
import * as Yup from 'yup';
import Image from 'next/image';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faLock } from '@fortawesome/free-solid-svg-icons';

import banner from '../../assets/images/desktopbanner.png';

const CreateAccount = () => {
  return (
    <div>
      <div>
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
          <div className="bg-cadetgray  xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute   xs:w-full xs:px-3  xl:w-3/4 xl:py-16 index-style  ">
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string()
                  .min(5, 'Min 5 Character Required')
                  .required('This field is required'),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref('password')], 'Passwords must match')
                  .required('This field is required'),
                email: Yup.string().email('Must be valid email').required('This field is required'),
              })}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="xs:w-full rounded-lg xl:w-2/4 xl:m-auto   md:m-auto xl:py-0 xl:mt-6 xs:mt-0 xs:pt-20">
                    <div className="flex justify-between items-center xl:py-0 xs:py-3">
                      <div className="xl:py-3 xs:py-0 cursor-pointer">
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          aria-hidden="true"
                          className="text-black text-sm font-black h-4 w-4"
                        />
                        <span className="px-2 text-black text-sm font-black">Back</span>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-black  text-black">Create an Account </h1>
                    </div>
                    <div className="bg-white px-3   my-2 xs:my-5 w-full rounded-lg  xl:py-3 xs:py-2 ">
                      <div className="mb-2 ">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-black">
                            Email Address
                          </label>
                          <div className="relative">
                            <Field
                              type="text"
                              className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                              placeholder="Email Address"
                              name="email"
                              value={values?.email}
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
                        </div>
                        <ErrorMessage name="email" component="span" className="text-xs text-red" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-black">
                          Password
                        </label>
                        <Field
                          type="password"
                          className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                          placeholder="Password"
                          name="password"
                          value={values?.password}
                        />
                      </div>
                      <ErrorMessage name="password" component="span" className="text-xs text-red" />
                      <div className="mb-2"></div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-black">
                          Confirm Password
                        </label>
                        <Field
                          type="password"
                          className="bg-white border border-graylight text-black text-sm rounded-md  f block w-full p-2.5  "
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          value={values?.confirmPassword}
                        />
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="span"
                        className="text-xs text-red"
                      />
                      <div className="mb-2"></div>
                    </div>
                    <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                      <button
                        type="submit"
                        className="w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-lg  items-center px-5 py-2 text-center"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
