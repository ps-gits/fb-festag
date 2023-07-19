import { useSelector } from 'react-redux';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';

const AdultAgeModal = (props: youngAdultAgeModal) => {
  const {
    id,
    values,
    tabIndex,
    showModal,
    lastIndex,
    closeModal,
    submitForm,
    changeIndex,
    setTabIndex,
    setShowModal,
    setPassengerValues,
    ageChangesAccecpted,
    setAgeChangesAccecpted,
  } = props;

  const adultAgeModalContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerDetails?.fields
  );

  return (
    <div>
      {showModal && (
        <div
          id={id}
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
        >
          <div className="relative w-full xs:max-w-2xl max-h-full bg-white m-auto mt-28">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 calendar-modal">
              <div className="p-4 text-center">
                <FontAwesomeIcon
                  icon={faXmark}
                  aria-hidden="true"
                  className="arrow-modal cursor-pointer text-black"
                  onClick={closeModal}
                />
                <div className="my-8">
                  <h1 className="font-black text-xl text-black">
                    {getFieldName(adultAgeModalContent, 'adultPassenger')}
                  </h1>
                  <p className="pt-3 text-slategray text-sm font-normal ">
                    {getFieldName(adultAgeModalContent, 'adultPassengerDescription')}
                  </p>
                </div>
                <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                  <div className="flex md:flex block h-full items-center justify-center relative gap-3 py-3 xs:w-full  ">
                    <button
                      type="button"
                      className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12 "
                      onClick={() => {
                        closeModal();
                        setShowModal({
                          young: false,
                          adult: false,
                          depart: true,
                          return: false,
                        });
                      }}
                    >
                      {getFieldName(adultAgeModalContent, 'editDatesButton')}
                    </button>
                    <button
                      type="button"
                      className="xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center py-2 text-center button-style xl:w-1/12"
                      onClick={() => {
                        if (
                          !ageChangesAccecpted?.includes(tabIndex as number) &&
                          setAgeChangesAccecpted
                        ) {
                          setAgeChangesAccecpted((prev: number[]) => [...prev, tabIndex]);
                        }
                        closeModal();
                        setPassengerValues && setPassengerValues(values);
                        if (lastIndex && changeIndex?.name === 'submit') {
                          submitForm && submitForm();
                        } else {
                          setTabIndex((prev: number) =>
                            changeIndex?.name === 'next'
                              ? prev + 1
                              : changeIndex?.name === 'previous'
                              ? prev - 1
                              : changeIndex?.name === 'changeTab'
                              ? changeIndex?.index
                              : 0
                          );
                        }
                      }}
                    >
                      {getFieldName(adultAgeModalContent, 'acceptButton')}
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

export default AdultAgeModal;
