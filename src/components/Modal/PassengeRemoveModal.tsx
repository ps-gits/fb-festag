import Image from 'next/image';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import img from '../../assets/images/remove.png';

const PassengeRemoveModal = (props: {
  closeModal: () => void;
  showModal: boolean;
  remove: () => void;
  firstName: string;
}) => {
  const { remove, closeModal, showModal, firstName } = props;
  return (
    <>
      {showModal && (
        <div
          id="passenger-remove"
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
        >
          <div className="relative w-full max-w-md max-h-full  m-auto mt-28">
            <div className="relative bg-white rounded-lg shadow  calendar-modal">
              <div className="p-4 text-center ">
                <div>
                  <FontAwesomeIcon
                    icon={faXmark}
                    aria-hidden="true"
                    className="arrow-modal cursor-pointer"
                    onClick={() => {
                      closeModal();
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <Image src={img} className="h-12 w-12 object-contain my-2" alt="" />
                </div>
                <div className="my-3">
                  <p className="font-black text-xl text-black">
                    Are you sure you want to remove {firstName}?
                  </p>
                </div>
                <div className="my-2">
                  <p className="text-slategray font-normal text-sm mb-10">
                    Removing eve from your family won’t remove them from any existing bookings, but
                    you will not be able to automatically add them from your family section in the
                    future
                  </p>
                </div>
                <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                  <div className="flex md:flex block h-full items-center justify-center relative gap-3 py-3 xs:w-full  ">
                    <button
                      type="button"
                      className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 "
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      Go back
                    </button>
                    <button
                      type="button"
                      className="xs:justify-center  xs:text-center text-white bg-red  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12"
                      onClick={() => {
                        remove();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PassengeRemoveModal;
