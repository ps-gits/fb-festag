import Image from 'next/image';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import destination from '../../assets/images/destination.png';

const NoFlight = () => {
  return (
    <main className="mx-0 px-3">
      <div>
        <div>
          <div className="flex justify-between items-center">
            <div className="xl:py-3 xs:py-0 cursor-pointer">
              <FontAwesomeIcon
                icon={faAngleLeft}
                aria-hidden="true"
                className="text-black text-sm font-black h-4 w-4"
              />
              <span className="px-2 text-black text-sm font-black">Back</span>
            </div>
          </div>
          <div className="pt-3">
            <h1 className="text-2xl font-black text-black ">Flight availability</h1>
            <div className="flex flex-col h-screen justify-center">
              <div className="flex justify-center py-10">
                <Image className="w-20 w-20 object-cover" src={destination} alt="" />
              </div>
              <div>
                <div className="text-center">
                  <h1 className="text-lg font-black text-black ">
                    Looks like we don’t have any flights available on those dates
                  </h1>
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-pearlgray my-1 ">
                    We only fly on select days for certain airports. Try picking another date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full xl:w-48 py-3 m-auto ">
            <button
              type="button"
              className="xs:w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
            >
              Change Dates
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NoFlight;
