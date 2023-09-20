import Image from 'next/image';
import { AnyAction } from 'redux';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import AllBookingDetails from './Tabs/AllBookingDetails';
import banner from '../../assets/images/desktopbanner.png';
import { getAllBooking } from 'src/redux/action/SearchFlights';

const AllBooking = () => {
  const dispatch = useDispatch();

  const allBookingData = useSelector((state: RootState) => state?.flightDetails?.allBooking);

  const [tabIndex, setTabIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [bookingList, setBookingList] = useState(allBookingData);

  useEffect(() => {
    dispatch(getAllBooking() as unknown as AnyAction);
  }, [dispatch]);

  useEffect(() => {
    bookingList?.length === 0 && setBookingList(allBookingData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBookingData]);

  return (
    <main>
      <div className="relative">
        <div className="py-5 px-3   bg-cadetgray">
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
                <div className="fixed top-24 right-3.5  xl:m-auto price-modal">
                  <div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className=" lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
                        <button
                          type="button"
                          className="w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                        >
                          Create New Booking
                        </button>
                      </div>
                    </div>
                  </div>
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
                            value={searchText}
                            className="block w-full px-4 py-2  text-basetext border border-slategray rounded "
                            placeholder="Search for a booking"
                            onChange={(e) => {
                              setSearchText(e.target.value);
                              if (e.target.value.length > 0) {
                                setBookingList(
                                  allBookingData?.filter(
                                    (item: {
                                      name: string;
                                      surname: string;
                                      originCode: string;
                                      originDate: string;
                                      destinationCode: string;
                                      destinationDate: string;
                                    }) =>
                                      item &&
                                      ((item.name + item.surname)
                                        ?.replaceAll(/\s/g, '')
                                        ?.toLowerCase()
                                        ?.includes(e.target.value?.replaceAll(/\s/g, '')) ||
                                        item.originCode?.toLowerCase()?.includes(e.target.value) ||
                                        item.destinationCode
                                          ?.toLowerCase()
                                          ?.includes(e.target.value))
                                  )
                                );
                              } else {
                                setBookingList(allBookingData);
                              }
                            }}
                            autoComplete="off"
                          />
                          {/* <button
                            type="submit"
                            className="text-white absolute right-2.5 bottom-2.5  font-medium rounded-lg text-sm px-4 py-2  "
                          >
                            Search
                          </button> */}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-base text-pearlgray font-medium opacity-50 mb-2">
                        Welcome back, Agent Name
                      </p>
                      <div>
                        <h1 className="text-2xl font-black  text-black">All Bookings </h1>
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <ul className="flex flex-wrap text-sm font-medium text-center border-graylight border-b">
                      <li onClick={() => setTabIndex(0)} className="w-1/3">
                        <button
                          className={`xl:w-full xs:w-full inline-block py-4 flex justify-center  ${
                            tabIndex === 0
                              ? ' inline-block py-2 px-2 bg-gray  border-aqua border-b text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3   font-medium bg-gray'
                          } `}
                          type="button"
                        >
                          <div className="flex gap-2 items-center">Active</div>
                        </button>
                      </li>
                      <li
                        //  onClick={() => setTabIndex(1)}
                        className="w-1/3"
                      >
                        <button
                          className={`xl:w-full xs:w-full inline-block py-4 flex justify-center  ${
                            tabIndex === 1
                              ? ' inline-block py-2 px-2 bg-gray  border-aqua border-b text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3   font-medium bg-gray'
                          } `}
                          type="button"
                        >
                          <div className="flex gap-2 items-center">Past</div>
                        </button>
                      </li>
                      <li
                        // onClick={() => setTabIndex(2)}
                        className="w-1/3"
                      >
                        <button
                          className={`xl:w-full xs:w-full inline-block py-4 flex justify-center  ${
                            tabIndex === 2
                              ? ' inline-block py-2 px-2 bg-gray  border-aqua border-b text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3   font-medium bg-gray'
                          } `}
                          type="button"
                        >
                          <div className="flex gap-2 items-center">Cancelled</div>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    {tabIndex === 0 && (
                      <div>
                        <AllBookingDetails bookingList={bookingList} />
                      </div>
                    )}
                    {tabIndex === 1 && (
                      <div>
                        <AllBookingDetails bookingList={bookingList} />
                      </div>
                    )}
                    {tabIndex === 2 && (
                      <div>
                        <AllBookingDetails bookingList={bookingList} />
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
