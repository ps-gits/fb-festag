import { useSelector } from 'react-redux';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';

const YoungAgeModal = (props: youngAdultAgeModal) => {
  const { id, showModal, closeModal } = props;

  const youngAgeModalContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerDetails?.fields
  );

  return (
    <div>
      {showModal && (
        <div>
          <div
            id={id}
            style={{ display: 'flex' }}
            className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
          >
            <div className="relative w-full xs:max-w-2xl max-h-full bg-white m-auto mt-28">
              <div className="relative bg-white rounded-lg shadow    calendar-modal">
                <div className="p-4 text-center">
                  <FontAwesomeIcon
                    icon={faXmark}
                    aria-hidden="true"
                    className="arrow-modal cursor-pointer text-black"
                    onClick={closeModal}
                  />
                  <div className="my-8">
                    <h1 className="font-black text-xl text-black">
                      {getFieldName(youngAgeModalContent, 'youngPassenger')}
                    </h1>
                    <p className="pt-3 text-slategray text-sm font-normal ">
                      {getFieldName(youngAgeModalContent, 'youngPassengerDescription')}
                    </p>
                  </div>
                  <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full xl:w-48  m-auto">
                    <button
                      type="button"
                      onClick={props.closeModal}
                      className="xs:w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                    >
                      {getFieldName(youngAgeModalContent, 'acceptButton')}
                    </button>
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

export default YoungAgeModal;
