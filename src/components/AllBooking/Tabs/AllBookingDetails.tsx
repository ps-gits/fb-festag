import Image from 'next/image';

import repeat from '../../../assets/images/repeat.png';
import carwhite from '../../../assets/images/carwhite.png';
import dooropen from '../../../assets/images/dooropen.png';
import plane from '../../../assets/images/planetakeoff.png';
import whiteuser from '../../../assets/images/whiteuser.png';

const BoardingPassesDetails = () => {
  return (
    <div className="xl:mb-0 xs:mb-20 ">
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="mb-3">
          <div className="bg-white p-4 rounded-lg">
            <h1>David Miller</h1>
            <div className="my-3">
              <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                <div className="mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-lightorange  p-2 rounded-full">
                      <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-black font-medium text-lg">DWC - MLE</p>
                        </div>
                        <div className="mt-2 flex items-center cursor-pointer">
                          <p className="font-black text-xs text-aqua">Complete Booking</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-pearlgray">10 Feb - 17 Feb 2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-3/4">
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                      <p className="text-sm">4 Passengers</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={repeat} alt="" />
                      <p className="text-sm">Return</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={carwhite} alt="" />
                      <p className="text-sm">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow">
                <div className="mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-lightorange  p-2 rounded-full">
                      <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-black font-medium text-lg">Anantara Maldives</p>
                        </div>
                        <div className="mt-2 flex items-center cursor-pointer">
                          <p className="font-black text-xs text-aqua">Complete Booking</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-pearlgray">10 Feb - 17 Feb 2024</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-3/4">
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={dooropen} alt="" />
                      <p className="text-sm">1 Room</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                      <p className="text-sm">4 Guests</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={carwhite} alt="" />
                      <p className="text-sm">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="bg-white p-4 rounded-lg">
            <h1>John Smith</h1>
            <div className="my-3">
              <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                <div className="mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-lightorange  p-2 rounded-full">
                      <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-black font-medium text-lg">DWC - MLE</p>
                        </div>
                        <div className="mt-2 flex items-center cursor-pointer">
                          <p className="font-black text-xs text-aqua">View Booking</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-pearlgray">10 Feb - 17 Feb 2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-3/4">
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                      <p className="text-sm">4 Passengers</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={repeat} alt="" />
                      <p className="text-sm">Return</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={carwhite} alt="" />
                      <p className="text-sm">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow">
                <div className="mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-lightorange  p-2 rounded-full">
                      <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-black font-medium text-lg">Anantara Maldives</p>
                        </div>
                        <div className="mt-2 flex items-center cursor-pointer">
                          <p className="font-black text-xs text-aqua">View Booking</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-pearlgray">10 Feb - 17 Feb 2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-3/4">
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={dooropen} alt="" />
                      <p className="text-sm">1 Room</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                      <p className="text-sm">4 Guests</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={carwhite} alt="" />
                      <p className="text-sm">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="bg-white p-4 rounded-lg">
            <h1>John Smith</h1>
            <div className="my-3">
              <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                <div className="mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-lightorange  p-2 rounded-full">
                      <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-black font-medium text-lg">DWC - MLE</p>
                        </div>
                        <div className="mt-2 flex items-center cursor-pointer">
                          <p className="font-black text-xs text-aqua">View Booking</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-pearlgray">10 Feb - 17 Feb 2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-3/4">
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                      <p className="text-sm">4 Passengers</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={repeat} alt="" />
                      <p className="text-sm">Return</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={carwhite} alt="" />
                      <p className="text-sm">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="bg-white p-4 rounded-lg">
            <h1>Diane King</h1>
            <div className="my-3">
              <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                <div className="mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-lightorange  p-2 rounded-full">
                      <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-black font-medium text-lg">DWC - MLE</p>
                        </div>
                        <div className="mt-2 flex items-center cursor-pointer">
                          <p className="font-black text-xs text-aqua">View Booking</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-pearlgray">10 Feb - 17 Feb 2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-3/6">
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                      <p className="text-sm">4 Passengers</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={repeat} alt="" />
                      <p className="text-sm">One Way</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                <div className="mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-lightorange  p-2 rounded-full">
                      <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-black font-medium text-lg">Anantara Maldives</p>
                        </div>
                        <div className="mt-2 flex items-center cursor-pointer">
                          <p className="font-black text-xs text-aqua">View Booking</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-pearlgray">10 Feb - 17 Feb 2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-3/4">
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={dooropen} alt="" />
                      <p className="text-sm">1 Room</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                      <p className="text-sm">4 Guests</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={carwhite} alt="" />
                      <p className="text-sm">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow">
                <div className="mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-lightorange  p-2 rounded-full">
                      <Image className="h-5 w-5 object-containt" src={plane} alt="" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-black font-medium text-lg">MLE - DUB</p>
                        </div>
                        <div className="mt-2 flex items-center cursor-pointer">
                          <p className="font-black text-xs text-aqua">View Booking</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-pearlgray">10 Feb - 17 Feb 2024</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-3/6">
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={dooropen} alt="" />
                      <p className="text-sm">1 Room</p>
                    </div>
                  </div>
                  <div className="xl:w-full xs:w-full p-4 py-2 px-2 bg-white rounded-2xl border-aqua border text-black font-black">
                    <div className="flex gap-2 items-center">
                      <Image className="h-5 w-5 object-cover" src={whiteuser} alt="" />
                      <p className="text-sm">4 Guests</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingPassesDetails;
