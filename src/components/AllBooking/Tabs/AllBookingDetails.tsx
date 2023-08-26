import Image from 'next/image';
import { Fragment } from 'react';

import repeat from '../../../assets/images/repeat.png';
import carwhite from '../../../assets/images/carwhite.png';
import plane from '../../../assets/images/planetakeoff.png';
import whiteuser from '../../../assets/images/whiteuser.png';
// import dooropen from '../../../assets/images/dooropen.png';

const AllBookingTab = (props: {
  bookingList: {
    name: string;
    surname: string;
    originCode: string;
    originDate: string;
    destinationCode: string;
    destinationDate: string;
  }[];
}) => {
  const { bookingList } = props;

  const passengerList = bookingList?.filter(
    (item, index) =>
      bookingList?.findIndex((dt) => dt?.name === item?.name && dt?.surname === item?.surname) ===
      index
  );

  return (
    <div className="xl:mb-0 xs:mb-20 ">
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
        {passengerList?.map((item, index) => (
          <div className="mb-3" key={index}>
            <div className="bg-white p-4 rounded-lg text-xl font-extrabold">
              <h1>{item?.name + ' ' + item?.surname}</h1>
              <div className="my-3">
                {bookingList?.map((listItem, listIndex) => (
                  <Fragment key={listIndex}>
                    {listItem?.name === item?.name && listItem?.surname === item?.surname && (
                      <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                        <div className="mb-3">
                          <div className="flex gap-3 items-center">
                            <div className="bg-lightorange  p-2 rounded-full">
                              <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                            </div>
                            <div className="w-full">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-black font-black text-base">
                                    {listItem?.originCode} - {listItem?.destinationCode}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center cursor-pointer">
                                  <p className="font-black text-xs text-aqua">Complete Booking</p>
                                </div>
                              </div>
                              <p className="text-xs font-normal text-pearlgray">
                                {listItem?.originDate} - {listItem?.destinationDate}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 my-3">
                          <div className=" p-4 py-2 px-2 bg-white rounded-2xl border-cadetgray border text-black ">
                            <div className="flex gap-2 items-center">
                              <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                              <p className="text-xs font-medium">4 Passengers</p>
                            </div>
                          </div>
                          <div className=" p-4 py-2 px-2 bg-white rounded-2xl border-cadetgray border text-black ">
                            <div className="flex gap-2 items-center">
                              <Image className="h-5 w-5 object-cover" src={repeat} alt="" />
                              <p className="text-xs font-medium">Return</p>
                            </div>
                          </div>
                          <div className=" p-4 py-2 px-2 bg-white rounded-2xl border-cadetgray border text-black ">
                            <div className="flex gap-2 items-center">
                              <Image className="h-5 w-5 object-cover" src={carwhite} alt="" />
                              <p className="text-xs font-medium">Transfer</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBookingTab;
