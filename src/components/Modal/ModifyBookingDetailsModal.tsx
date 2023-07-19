import Image from 'next/image';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'src/redux/store';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const ModifyBookingDetailsModal = (props: modifyBookingDetailsModal) => {
  const {
    id,
    adult,
    childrens,
    showModal,
    departDate,
    returnDate,
    seatsLabel,
    closeModal,
    datesModify,
    seatsModify,
    cancelBooking,
    fareFamilyName,
    passengerModify,
  } = props;

  const passengerContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerModal?.fields
  );
  const flightAvailabilityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const modifyBookingDetailsModalContent = useSelector(
    (state: RootState) => state?.sitecore?.modifyBookingModal?.fields
  );

  const modifyBookingInfo = useSelector(
    (state: RootState) => state?.flightDetails?.modifyBooking?.OriginDestination
  );
  const reviewTripContent = useSelector((state: RootState) => state?.sitecore?.reviewTrip?.fields);

  const findFareFamilyInfo = flightAvailabilityContent?.find(
    (item: { name: string }) => item?.name === fareFamilyName?.toLowerCase() + 'Logo'
  )?.jsonValue?.value;

  return (
    <div>
      {showModal && (
        <div
          id={id}
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
        >
          <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 calendar-modal ">
              <div className="p-4 text-center">
                <FontAwesomeIcon
                  icon={faXmark}
                  aria-hidden="true"
                  className="arrow-modal cursor-pointer"
                  onClick={() => {
                    closeModal();
                  }}
                />
                <div className="my-3">
                  <p className="font-black text-xl text-black">
                    {getFieldName(modifyBookingDetailsModalContent, 'heading')}
                  </p>
                </div>
                <div className="my-2">
                  <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                    <div className="flex gap-3">
                      <div className="flex justify-center items-center">
                        <Image
                          className="h-5 w-5 object-containt"
                          src={getImageSrc(modifyBookingDetailsModalContent, 'changeDateLogo')}
                          alt=""
                          height={5}
                          width={5}
                        />
                      </div>
                      <div>
                        <p className="text-black font-medium text-lg">
                          {getFieldName(modifyBookingDetailsModalContent, 'changeDate')}
                        </p>
                        <p className="text-sm font-medium text-pearlgray">
                          {modifyBookingInfo?.length === 1
                            ? departDate
                            : departDate + ' - ' + returnDate}
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-2 flex items-center cursor-pointer"
                      onClick={() => datesModify()}
                    >
                      <p className="font-black text-xs text-aqua">
                        {getFieldName(modifyBookingDetailsModalContent, 'modifyButton')}
                      </p>
                      <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                    <div className="flex gap-3">
                      <div className="flex justify-center items-center">
                        <Image
                          className="h-5 w-5 object-containt"
                          src={getImageSrc(reviewTripContent, 'passengerLogo')}
                          alt=""
                          height={5}
                          width={5}
                        />
                      </div>
                      <div>
                        <p className="text-black font-medium text-lg">
                          {getFieldName(reviewTripContent, 'passengerLabel')}
                        </p>
                        <p className="text-sm font-medium text-pearlgray">
                          {`${adult} ${getFieldName(passengerContent, 'adult')} ${
                            childrens > 0
                              ? ', ' + childrens + ` ${getFieldName(passengerContent, 'children')}`
                              : ''
                          }`}
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-2 flex items-center cursor-pointer"
                      onClick={() => passengerModify()}
                    >
                      <p className="font-black text-xs text-aqua">
                        {getFieldName(modifyBookingDetailsModalContent, 'modifyButton')}
                      </p>
                      <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                    <div className="flex gap-3">
                      <div className="flex justify-center items-center">
                        <Image
                          className="h-5 w-5 object-containt"
                          src={getImageSrc(modifyBookingDetailsModalContent, 'seatSelectionLogo')}
                          alt=""
                          height={5}
                          width={5}
                        />
                      </div>
                      <div>
                        <p className="text-black font-medium text-lg">
                          {getFieldName(modifyBookingDetailsModalContent, 'seatSelection')}
                        </p>
                        <p className="text-sm font-medium text-pearlgray">
                          {seatsLabel && seatsLabel?.length > 0
                            ? seatsLabel?.map((item, index) =>
                                index === seatsLabel?.length - 1 ? item?.Text : item?.Text + ' , '
                              )
                            : getFieldName(
                                modifyBookingDetailsModalContent,
                                'seatSelectionContent'
                              )}
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-2 flex items-center cursor-pointer"
                      onClick={() => seatsModify()}
                    >
                      <p className="font-black text-xs text-aqua">
                        {seatsLabel && seatsLabel?.length > 0
                          ? getFieldName(modifyBookingDetailsModalContent, 'modifyButton')
                          : getFieldName(modifyBookingDetailsModalContent, 'chooseButton')}
                      </p>
                      <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                    <div className="flex gap-3">
                      <div className="flex justify-center items-center">
                        <Image
                          className="h-5 w-5 object-containt"
                          src={findFareFamilyInfo?.src}
                          alt="farefamily"
                          height={5}
                          width={5}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-pearlgray">
                          {getFieldName(modifyBookingDetailsModalContent, 'fareFamily')}
                        </p>
                        <p className="text-black font-medium text-lg">
                          {fareFamilyName?.charAt(0)?.toUpperCase() +
                            fareFamilyName?.slice(1)?.trim()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center cursor-pointer">
                      <p className="font-black text-xs text-aqua">
                        {getFieldName(modifyBookingDetailsModalContent, 'modifyButton')}
                      </p>
                      <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                    <div className="flex gap-3">
                      <div className="flex justify-center items-center">
                        <Image
                          className="h-5 w-5 object-containt"
                          src={getImageSrc(modifyBookingDetailsModalContent, 'cancelLogo')}
                          alt=""
                          height={5}
                          width={5}
                        />
                      </div>
                      <div>
                        <p className="text-black font-medium text-lg">
                          {getFieldName(modifyBookingDetailsModalContent, 'cancel')}
                        </p>
                        <p className="text-sm font-medium text-pearlgray">
                          {getFieldName(modifyBookingDetailsModalContent, 'cancelContent')}
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-2 flex items-center cursor-pointer"
                      onClick={() => cancelBooking()}
                    >
                      <p className="font-black text-xs text-aqua">
                        {getFieldName(modifyBookingDetailsModalContent, 'cancelButton')}
                      </p>
                      <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                    </div>
                  </div>
                </div>

                <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full m-auto">
                  <button
                    onClick={() => {
                      closeModal();
                    }}
                    type="button"
                    className="w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                  >
                    {getFieldName(modifyBookingDetailsModalContent, 'closeButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyBookingDetailsModal;
