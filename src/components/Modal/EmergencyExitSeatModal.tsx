import Image from 'next/image';
import { Fragment, useState } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import featuredicon from '../../assets/images/featuredicon.png';

const EmergencyExitSeatModal = (props: {
  isChild: boolean;
  showModal: boolean;
  selectSeat: () => void;
  closeModal: () => void;
}) => {
  const { showModal, isChild, closeModal, selectSeat } = props;

  const [checked, setChecked] = useState(false);

  return (
    <Fragment>
      {showModal && (
        <div
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
          id="emergency-seat-modal"
        >
          <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
            <div className="relative bg-white rounded-lg shadow    calendar-modal">
              <div className="py-5 px-4 ">
                <FontAwesomeIcon
                  icon={faXmark}
                  aria-hidden="true"
                  className="arrow-modal cursor-pointer text-black"
                  onClick={() => {
                    closeModal();
                    checked && setChecked(false);
                  }}
                />
                <div className="flex justify-center">
                  <div className=" gap-3 justify-between p-5 bg-white rounded-lg ">
                    <div className="flex justify-center">
                      <Image src={featuredicon} className="h-14 w-14" alt="" />
                    </div>
                    <div className="pt-3">
                      <div className="flex flex-col text-center justify-center">
                        <p className="font-extrabold text-xl text-black">
                          The selected seat is on an Emergency Exit row
                        </p>
                        {isChild ? (
                          <p className="font-normal text-sm text-pearlgray py-1">
                            The selected passenger is too young to sit in this row.
                          </p>
                        ) : (
                          <p className="font-normal text-sm text-pearlgray py-1">
                            Passengers sitting in the exit row must be physically capable and above
                            12 years old. Please note that this seat is not suitable for elderly
                            individuals, persons with reduced mobility, individuals with hearing
                            impairment, blind persons, or children below the age of 12.
                          </p>
                        )}
                      </div>
                      {!isChild && (
                        <div className="flex items-center my-4">
                          <input
                            id="default-checkbox"
                            type="checkbox"
                            checked={checked}
                            className="accent-orange-600	 text-white w-4 h-4 opacity-70"
                            onChange={() => {
                              setChecked(!checked);
                            }}
                          />
                          <label
                            htmlFor="default-checkbox"
                            className="ml-2 text-sm font-medium text-black "
                          >
                            I accept the terms and conditions{' '}
                          </label>
                        </div>
                      )}
                      {isChild ? (
                        <div className="my-3 flex gap-2 pt-3">
                          <button
                            type="button"
                            className="xl:w-full md:w-full xs:w-full  xs:justify-center xs:items-center  xs:flex text-white border bg-aqua border-aqua font-extrabold rounded-lg text-lg inline-flex items-center px-5 py-2 text-center"
                            onClick={() => {
                              closeModal();
                              checked && setChecked(false);
                            }}
                          >
                            Change Seat
                          </button>
                        </div>
                      ) : (
                        <div className="my-3 flex gap-2">
                          <button
                            type="button"
                            className="xl:w-full md:w-full xs:w-full  xs:justify-center xs:items-center  xs:flex text-aqua border bg-white border-aqua font-extrabold rounded-lg text-lg inline-flex items-center px-5 py-2 text-center"
                            onClick={() => {
                              closeModal();
                              checked && setChecked(false);
                            }}
                          >
                            Change seat
                          </button>
                          <button
                            type="button"
                            className={`xl:w-full md:w-full xs:w-full  xs:justify-center xs:items-center  xs:flex text-white border bg-aqua border-aqua font-extrabold rounded-lg text-lg inline-flex items-center px-5 py-2 text-center ${
                              checked ? '' : 'opacity-40'
                            }`}
                            disabled={!checked}
                            onClick={() => {
                              selectSeat();
                              checked && setChecked(false);
                            }}
                          >
                            Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default EmergencyExitSeatModal;

