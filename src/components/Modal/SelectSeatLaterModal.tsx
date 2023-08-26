import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const SelectSeatLaterModal = (props: {
  showModal: boolean;
  closeModal: () => void;
  createBooking: () => void;
}) => {
  const { showModal, closeModal, createBooking } = props;
  return (
    <div>
      {showModal && (
        <div
          id="select-seat-later-modal"
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
        >
          <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
            <div className="relative bg-white rounded-lg shadow    calendar-modal">
              <div className="py-5 px-4 ">
                <FontAwesomeIcon
                  icon={faXmark}
                  aria-hidden="true"
                  className="arrow-modal cursor-pointer text-black"
                  onClick={() => closeModal()}
                />
                <div className="flex justify-center">
                  <div className=" gap-3 justify-between p-5 bg-white rounded-lg ">
                    <div className="pt-3">
                      <div className="flex flex-col text-center justify-center">
                        <p className="font-extrabold text-xl text-black">
                          Prefer to Choose Your Seats Later?
                        </p>
                        <p className="font-normal text-sm text-pearlgray py-1">
                          To ensure a smooth and tailored journey, we recommend selecting your
                          desired seats at your earliest convenience.
                        </p>
                      </div>
                      <div className="my-3 flex gap-2 pt-3">
                        <button
                          type="button"
                          className="xl:w-full md:w-full xs:w-full  xs:justify-center xs:items-center  xs:flex text-white border bg-aqua border-aqua font-extrabold rounded-lg text-lg inline-flex items-center px-5 py-2 text-center"
                          onClick={() => createBooking()}
                        >
                          Complete Booking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectSeatLaterModal;

