import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ErrorMessages = (props: errorMessageType) => {
  const { showToast, setShowToast } = props;
  return (
    <>
      {showToast?.show && (
        <div
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
        >
          <div className="relative w-11/12 xs:max-w-2xl max-h-full m-auto mt-28">
            <div className="bg-yellowLight border border-yellowError rounded-lg shadow error-container">
              <div className="relative p-5 text-center">
                <FontAwesomeIcon
                  icon={faXmark}
                  aria-hidden="true"
                  className="absolute text-errorText top-3 cursor-pointer right-3"
                  onClick={() =>
                    setShowToast({
                      show: false,
                      sttus: 0,
                      message: '',
                    })
                  }
                />
                <div className="pt-2">
                  <p className="text-left text-errorText text-sm font-normal ">
                    {showToast?.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorMessages;

