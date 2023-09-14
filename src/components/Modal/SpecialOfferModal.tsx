import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Image from 'next/image';
import DarkCar from '../../assets/images/black-dark-car.png';

const SpecialOfferModal = (props: { showOffer: boolean; closeModal: () => void }) => {
  const { showOffer, closeModal } = props;
  const router = useRouter();

  return (
    <>
      {showOffer && (
        <div>
          <div
            style={{ display: 'flex' }}
            className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
          >
            <div className="relative lg:w-10/12 xl:w-6/12 max-h-full m-auto">
              <div className="relative bg-white">
                <div className="xl:flex md:flex xs:block w-80 lg:w-full xs:h-auto relative flex-wrap">
                  <div className="w-full xl:w-5/12 lg:w-1/2">
                    <div className="overflow-hidden w-full h-80 lg:h-full lg:w-full">
                      <Image
                        src={DarkCar}
                        alt="Sitecore"
                        className="h-full w-full"
                        width={1000}
                        height={1000}
                      />
                    </div>
                  </div>

                  <div className="lg:relative xl:w-7/12 lg:w-1/2 w-full xl:py-12 py-0 lg:py-10 flex items-center">
                    <FontAwesomeIcon
                      icon={faXmark}
                      aria-hidden="true"
                      className="absolute cursor-pointer text-white lg:text-black right-6 top-6"
                      onClick={closeModal}
                    />
                    <div className="p-6 lg:p-10 md:p-8 text-center">
                      <h2 className="text-3xl xl:text-5xl lg:text-4xl md:text-2xl md:mb-6 lg:mb-8 mb-3 font-bold text-black xl:leading-tight">
                        Make your journey truly special
                      </h2>
                      <p className="text-md md:text-lg text-pearlgray md:mb-6 lg:mb-8 mb-3 leading-8">
                        Complimentary private chauffeur service is included on our Bliss fare for
                        all web bookings made from now until 30 September 2023.
                      </p>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            {closeModal()}
                            router.push('/')
                          }}
                          className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
                        >
                          Book Now
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
    </>
  );
};

export default SpecialOfferModal;
