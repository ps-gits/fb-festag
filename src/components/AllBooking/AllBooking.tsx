import Image from 'next/image';
import { useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AllBookingDetails from './Tabs/AllBookingDetails';
import banner from '../../assets/images/desktopbanner.png';
import ModifyBookingModal from '../Modal/ModifyBookingModal';

const AllBooking = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <main>
      <div className="relative">
        <div className="py-5 px-3  ">
          <div className="">
            <div className="xl:not-sr-only	xs:sr-only">
              <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                <Image
                  src={banner}
                  className="xs:absolute  inset-0 h-full w-full object-cover"
                  alt=""
                />
              </div>
              <div className="xl:not-sr-only	xs:sr-only">
                <div className="fixed top-16 right-3.5  xl:m-auto price-modal">
                  <ModifyBookingModal openModal={() => true} />
                </div>
              </div>
            </div>
          </div>
          <div className="xl:w-9/12 ">
            <div>
              <div className="rounded-lg">
                <div className="xl:w-2/4 xl:m-auto">
                  <div className=" xl:mt-20 x xs:mt-0 xs:px-0 xl:px-0">
                    <div>
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 right-4 flex items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon
                              icon={faSearch}
                              aria-hidden="true"
                              className="text-hilightgray text-sm font-black h-5 w-5"
                            />
                          </div>

                          <input
                            type="text"
                            id="search"
                            className="block w-full px-4 py-2  text-basetext border border-slategray rounded "
                            placeholder="Search for a booking"
                            // onChange={(e) => {
                            //   setLoading(true);
                            //   setSelectOptions([]);
                            //   searchDataWithDelay(e?.target?.value);
                            // }}
                            autoComplete="off"
                          />
                          <button
                            type="submit"
                            className="text-white absolute right-2.5 bottom-2.5  font-medium rounded-lg text-sm px-4 py-2  "
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-base text-pearlgray opacity-50">
                        Welcome back, Agent Name
                      </p>
                      <div>
                        <h1 className="text-2xl font-black  text-black">All Bookings </h1>
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <ul className="flex flex-wrap text-sm font-medium text-center border-graylight border-b">
                      <li role="presentation" onClick={() => setTabIndex(0)} className="w-1/3">
                        <button
                          className={`xl:w-full xs:w-full inline-block py-4 flex justify-center  ${
                            tabIndex === 0
                              ? ' inline-block py-2 px-2 bg-gray  border-aqua border-b text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3   font-medium bg-gray'
                          } `}
                          type="button"
                          onClick={() => setTabIndex(0)}
                        >
                          <div className="flex gap-2 items-center">Active</div>
                        </button>
                      </li>
                      <li role="presentation" onClick={() => setTabIndex(1)} className="w-1/3">
                        <button
                          className={`xl:w-full xs:w-full inline-block py-4 flex justify-center  ${
                            tabIndex === 1
                              ? ' inline-block py-2 px-2 bg-gray  border-aqua border-b text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3   font-medium bg-gray'
                          } `}
                          type="button"
                          onClick={() => setTabIndex(1)}
                        >
                          <div className="flex gap-2 items-center">Past</div>
                        </button>
                      </li>
                      <li role="presentation" onClick={() => setTabIndex(2)} className="w-1/3">
                        <button
                          className={`xl:w-full xs:w-full inline-block py-4 flex justify-center  ${
                            tabIndex === 2
                              ? ' inline-block py-2 px-2 bg-gray  border-aqua border-b text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3   font-medium bg-gray'
                          } `}
                          type="button"
                          onClick={() => setTabIndex(2)}
                        >
                          <div className="flex gap-2 items-center">Cancelled</div>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    {tabIndex === 0 && (
                      <div>
                        <AllBookingDetails />
                      </div>
                    )}
                    {tabIndex === 1 && (
                      <div>
                        <AllBookingDetails />
                      </div>
                    )}
                    {tabIndex === 2 && (
                      <div>
                        <AllBookingDetails />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AllBooking;
