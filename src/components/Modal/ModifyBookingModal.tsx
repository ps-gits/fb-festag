import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';
import { setSelectedMeal } from 'src/redux/reducer/FlightDetails';

const ModifyBookingModal = (props: {
  openModal: () => void;
  featuredAddons?: { name: string; amount: number; quantity: number }[];
  mealDetails?: () => void;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openModal, featuredAddons, mealDetails } = props;

  const modifyBookingModalContent = useSelector(
    (state: RootState) => state?.sitecore?.bookingComplete?.fields
  );

  return (
    <>
      <div>
        <div className="bg-white p-3 rounded-lg">
          {featuredAddons && featuredAddons?.length > 0 ? (
            <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
              <button
                type="button"
                className="w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                onClick={() => {
                  router.push('/yourcart');
                  mealDetails && dispatch(setSelectedMeal(mealDetails));
                }}
              >
                {getFieldName(modifyBookingModalContent, 'viewCart')} ({featuredAddons?.length}{' '}
                {getFieldName(modifyBookingModalContent, 'item')})
              </button>
            </div>
          ) : (
            <>
              <div className="pt-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
                <button
                  onClick={() => openModal()}
                  type="button"
                  className="w-full xs:justify-center  xs:text-center text-aqua border border-aqua bg-white font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                >
                  {getFieldName(modifyBookingModalContent, 'modifyBookingButton')}
                </button>
              </div>
              {/* <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
                <button
                  type="button"
                  className="w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                >
                  {getFieldName(modifyBookingModalContent, 'addPassengerDetailsButton')}
                </button>
              </div> */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ModifyBookingModal;
