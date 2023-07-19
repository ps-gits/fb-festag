import Image from 'next/image';

import logo from '../../../assets/images/blacklogo.png';
import barcode from '../../../assets/images/barcode.png';
import appcard from '../../../assets/images/appcard.png';
import ModifyBookingModal from '../../Modal/ModifyBookingModal';

const BoardingPassesDetails = () => {
  return (
    <div className="xl:mb-0 xs:mb-20">
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="bg-white px-3 py-2 rounded-lg">
          <div className="p-2 flex justify-center items-center">
            <Image className="h-auto w-36 object-cover" src={logo} alt="" />
          </div>
          <div className="flex item-center  justify-between py-3 ">
            <div>
              <p className="font-extrabold  text-4xl text-black">DWC</p>
              <p className="font-medium text-base text-slategray">Dubai</p>
            </div>
            <div>
              <div className="flex items-center"></div>
              <div className="flex flex-col justify-center mt-1 items-center">
                <p className="font-black text-sm text-slategray ">Friday</p>
                <p className="font-medium text-base text-black ">January 10</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-4xl text-black">MLE</p>
              <p className="font-medium text-base text-slategray">Male</p>
            </div>
          </div>

          <div className="flex item-center  justify-between py-3 ">
            <div>
              <p className="font-extrabold  text-sm text-black">08:30</p>
              <div className="mt-0.5">
                <p className="font-medium text-xs text-slategray">10 Feb 2024</p>
              </div>
            </div>
            <div>
              <div className="flex items-center"></div>
              <div className="flex flex-col justify-center mt-1 items-center">
                <p className="font-black text-sm text-black ">3h 20m</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-sm text-black">16:30</p>
              <div className="mt-0.5">
                <div className="mt-0.5">
                  <p className="font-medium text-xs text-slategray">10 Feb 2024</p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="border border-b border-whitegray border-dashed"></div>
          </div>
          <div className="flex item-center  justify-between py-3 ">
            <div>
              <p className="font-medium text-xs text-slategray">Passenger Name</p>
              <div className="mt-0.5">
                <div className="mt-0.5">
                  <p className="font-extrabold  text-base text-black">John Smith</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium text-xs text-slategray">Ticket Number</p>
              <div className="mt-0.5">
                <p className="font-extrabold text-base text-black">GI1561</p>
              </div>
            </div>
          </div>
          <div className="flex item-center  justify-between py-3 ">
            <div>
              <p className="font-medium text-xs text-slategray">Passenger</p>
              <div className="mt-0.5">
                <p className="font-extrabold  text-base text-black">1 Adult </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium text-xs text-slategray">Seat</p>
              <div className="mt-0.5">
                <p className="font-extrabold text-base text-black">6-D</p>
              </div>
            </div>
          </div>
          <div className="flex item-center  justify-between py-3 ">
            <div>
              <p className="font-medium text-xs text-slategray">Class</p>
              <div className="mt-0.5">
                <p className="font-extrabold  text-base text-black">Bliss </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium text-xs text-slategray">Baggage</p>
              <div className="mt-0.5">
                <p className="font-extrabold text-base text-black">42kg</p>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="border border-b border-whitegray border-dashed"></div>
          </div>
          <div className="p-2 flex justify-center items-center">
            <Image className="h-auto w-full object-cover" src={barcode} alt="" />
          </div>
        </div>
        <div className="my-4">
          <div className="p-2 flex justify-center items-center mb-3">
            <Image className="h-auto w-36 object-cover" src={appcard} alt="" />
          </div>
          <div className="xs:not-sr-only	xl:sr-only">
            <div className="fixed w-full left-0 bottom-0 z-50">
              <ModifyBookingModal openModal={() => true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingPassesDetails;

