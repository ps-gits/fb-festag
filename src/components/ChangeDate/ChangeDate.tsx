import Link from 'next/link';
import Image from 'next/image';
import ReactDatePicker from 'react-datepicker';

import banner from '../../assets/images/desktopbanner.png';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChangeDate = () => {
  return (
    <div className="relative">
      <div className="xl:not-sr-only	xs:sr-only">
        <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
          <Image src={banner} className="xs:absolute  inset-0 h-full w-full object-cover" alt="" />
        </div>
      </div>
      <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-24 xl:mt-0 xs:pt-20 ">
        <div className="xl:w-2/4 xl:m-auto xs:w-full">
          <div>
            <Link href="bookingcomplete">
              <div className="flex justify-between items-center xl:py-0 xs:py-2">
                <div className="xl:py-3 xs:py-0 cursor-pointer">
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    aria-hidden="true"
                    className="text-black text-sm font-black h-4 w-4"
                  />
                  <span className="px-2 text-black text-sm font-black">Back</span>
                </div>
              </div>
            </Link>
            <div className="calendarstyle pb-3">
              <h3 className="mb-0 text-2xl text-black font-black">Change Dates</h3>
              <p className="text-sm text-pearlgray opacity-50 xs:mb-2">
                We only fly from DWC on these dates
              </p>
            </div>
            <div>
              <div className="bg-white text-center p-4 rounded-lg">
                <>
                  <div>
                    <p className="font-medium text-sm text-pearlgray">Trip Length</p>
                    <p className="font-black text-lg text-black"> 7 days</p>
                  </div>
                </>
                <div className="bg-white">
                  <ReactDatePicker
                    inline
                    selectsRange
                    locale="en-gb"
                    onChange={(date) => console.log(date)}
                  />
                </div>
                <div className="my-2 xl:w-2/4 xs:w-4/6 m-auto">
                  <div className="rounded-lg">
                    <div className="border border-Silvergray py-2 flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-graylight  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray peer-checked:bg-blue"></div>
                        <span className="ml-3 text-sm font-medium text-black">
                          My dates are flexible
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xl:w-auto py-3">
                <button
                  type="button"
                  className="w-full xs:justify-center  text-white bg-aqua  font-black text-lg rounded-lg  inline-flex items-center px-5 py-2 text-center "
                >
                  Change Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeDate;
