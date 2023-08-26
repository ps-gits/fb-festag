import { useSelector } from 'react-redux';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';
import { useState } from 'react';

const PromocodeModal = (props: promoCodeModal) => {
  const { id, showModal, closeModal, flightDetails, setFlightDetails } = props;

  const promocodeModalContent = useSelector(
    (state: RootState) => state?.sitecore?.promoCodeModal?.fields
  );

  const [promoCodeEntered, setPromoCodeEntered] = useState('');

  return (
    <div>
      {showModal && (
        <div>
          <div
            id={id}
            style={{ display: 'flex' }}
            className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
          >
            <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
              <div className="relative bg-white rounded-lg shadow    calendar-modal">
                <div className="px-4 pt-5">
                  <FontAwesomeIcon
                    icon={faXmark}
                    aria-hidden="true"
                    className="arrow-modal cursor-pointer text-black"
                    onClick={() => {
                      closeModal(), setPromoCodeEntered('');
                    }}
                  />
                  <div className="my-2">
                    <div className=" text-center">
                      <p className=" text-xl font-black text-black">
                        {getFieldName(promocodeModalContent, 'heading')}
                      </p>
                      <p className="text-slategray font-normal text-sm">
                        {getFieldName(promocodeModalContent, 'content')}
                      </p>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="first_name" className="block text-sm font-medium text-black">
                        {getFieldName(promocodeModalContent, 'label')}
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        className="bg-gray-50 border border-Silvergray text-sm rounded-lg text-black block w-full p-2.5  "
                        placeholder={getFieldName(promocodeModalContent, 'promoCode')}
                        value={promoCodeEntered}
                        onChange={(e) => {
                          setPromoCodeEntered(e?.target?.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full xl:w-full py-3 m-auto ">
                    <button
                      type="button"
                      className={`w-full text-lg font-black xs:justify-center xs:text-center text-white bg-aqua  rounded-lg text-md inline-flex items-center px-5 py-2 text-center  ${
                        promoCodeEntered?.length > 0 ? '' : 'opacity-30'
                      }`}
                      onClick={() => {
                        setFlightDetails({
                          ...flightDetails,
                          promoCode: promoCodeEntered,
                        });
                        closeModal();
                      }}
                    >
                      {getFieldName(promocodeModalContent, 'applyButton')}
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

export default PromocodeModal;
