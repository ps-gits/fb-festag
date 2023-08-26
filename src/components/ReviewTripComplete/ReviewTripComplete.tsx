import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import wine from '../../assets/images/wine.png';
import cake from '../../assets/images/cake.png';
import group from '../../assets/images/group.png';
import chair from '../../assets/images/chair.png';
import couple from '../../assets/images/couple.png';
import flower from '../../assets/images/flower.png';
import booking from '../../assets/images/booking.png';
import carblue from '../../assets/images/carblue.png';
import xcircle from '../../assets/images/xcircle.png';
import utensils from '../../assets/images/utensils.png';
import briefcase from '../../assets/images/briefcase.png';
import champagne from '../../assets/images/champagne.png';
import banner from '../../assets/images/desktopbanner.png';
import orangechair from '../../assets/images/orangechair.png';
import planetakeoff from '../../assets/images/planetakeoff.png';
import flightbanner from '../../assets/images/flightbanner.png';
import calendardays from '../../assets/images/calendardays.png';
import planetopcurve from '../../assets/images/planetopcurve.png';
import planebottomcurve from '../../assets/images/planebottomcurve.png';

const ReviewTripComplete = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative">
      <div className="xl:not-sr-only	xs:sr-only">
        <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
          <Image src={banner} className="xs:absolute  inset-0 h-full w-full object-cover" alt="" />
        </div>
        <div className="xl:not-sr-only	xs:sr-only">
          <div className="fixed top-24 right-3.5  xl:m-auto price-modal ">
            <div>
              <div className="bg-white p-3 rounded-lg">
                <div className="pt-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                  <button
                    onClick={() => setShowModal(!showModal)}
                    type="button"
                    className="xs:w-full xs:justify-center  xs:text-center text-aqua border border-aqua bg-white focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                  >
                    Modify Booking
                  </button>
                </div>
                <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full   m-auto">
                  <button
                    type="button"
                    className="xs:w-full  xs:justify-center  xs:text-center text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                  >
                    Add Passenger Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-24 xl:mt-0 xs:pt-20">
        <div className="xl:w-2/4 xl:m-auto xs:w-full">
          <div className="flex justify-between items-center xl:py-0 xs:py-3">
            <div className="xl:py-3 xs:py-0 cursor-pointer">
              <FontAwesomeIcon
                icon={faAngleLeft}
                aria-hidden="true"
                className="text-black text-sm font-black h-4 w-4"
              />
              <span className="px-2 text-black text-sm font-black">Back</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-black">Review your trip</h1>
          </div>
          <div className="py-1">
            <p className="font-medium text-base text-pearlgray">
              Please review and confirm all your trip details
            </p>
          </div>
          <div className="py-2 xl:w-2/4 md:w-6/12 xs:w-64 ">
            <div className="text-aqua text-sm font-normal p-2 border-aqua border bg-tabsky rounded-lg flex gap-2 items-center">
              <div className="text-aqua text-base font-black">Booking Ref: 1HS68323</div>
              <div>
                <Image className="h-6 w-6 object-cover" src={booking} alt="" />
              </div>
            </div>
          </div>
          <div>
            <div className=" xs:block gap-2 py-3">
              <div className="bg-white  xl:w-full mb-3 rounded-2xl">
                <div className="w-full overflow-hidden relative">
                  <Image
                    src={flightbanner}
                    className="absolute inset-0  w-full object-containt rounded-tl-2xl rounded-tr-2xl"
                    alt=""
                  />
                  <div className="relative">
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
                    <div className="h-full items-center justify-center relative gap-3">
                      <div className=" my-2 items-center justify-center relative gap-3 px-6">
                        <div className="flex items-center justify-center">
                          <div className="mt-6">
                            <Image
                              className="h-10 w-full object-contain"
                              src={planetopcurve}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="flex item-center  justify-between items-center mt-5 mb-5 px-6 ">
                          <div>
                            <h1 className="text-4xl font-extrabold  text-white ">DWC</h1>
                            <p className="font-medium text-base text-cadetgray">Dubai</p>
                          </div>

                          <div className="text-right">
                            <h1 className='text-4xl font-extrabold  text-white "'>MLE</h1>
                            <p className="font-medium text-base text-cadetgray">Male</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center">
                            <div className="mb-6">
                              <Image
                                className="h-10 w-full object-containt"
                                src={planebottomcurve}
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div>
                    <div className="flex gap-4 relative">
                      <div className="bg-lightorange  h-10 w-12 flex justify-center items-center rounded-full z-50">
                        <Image className="h-4 w-4 object-contain " src={planetakeoff} alt="" />
                      </div>
                      <div className="absolute h-full top-4 left-5 border-dashed border-Silvergray border "></div>
                      <div className="w-full">
                        <div className="flex justify-between w-full">
                          <div className="">
                            <p className="font-extrabold text-2xl text-black">DWC</p>
                            <p className="font-normal text-xs text-pearlgray">
                              Dubai International Airport
                            </p>
                          </div>
                          <div className="">
                            <p className="font-black text-2xl text-black text-end">08:30</p>
                            <p className="font-normal text-xs text-pearlgray text-end">10 Feb 24</p>
                          </div>
                        </div>
                        <div className="bg-white p-3 my-2 xl:w-full rounded-lg border border-cadetgray ">
                          <div className="flex gap-3 items-center my-1">
                            <Image className="h-5 w-5 object-contain" src={carblue} alt="" />
                            <p className="font-black text-sm text-black">Luxury Pick-up</p>
                          </div>
                          <div className="flex gap-3 py-2">
                            <Image className="h-5 w-5 object-contain" src={wine} alt="" />
                            <p className="font-black text-sm text-black">Lounge Access</p>
                          </div>
                          <div className="flex gap-3 py-2">
                            <Image className="h-5 w-5 object-contain" src={chair} alt="" />
                            <div>
                              <p className="font-black text-sm text-black">Seats</p>
                              <p className="font-medium text-xs text-slategray">6D, 6F, 7D, 7F</p>
                            </div>
                          </div>
                          <div className="flex gap-3 py-2">
                            <Image className="h-5 w-5 object-contain" src={briefcase} alt="" />
                            <div>
                              <p className="font-black text-sm text-black">Baggage 1x32kg</p>
                              <p className="font-medium text-xs text-slategray">
                                Cabin Baggage 7kg
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 py-2">
                            <Image className="h-5 w-5 object-contain" src={utensils} alt="" />
                            <p className="font-black text-sm text-black">In-flight luxury dining</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 ">
                      <div className="bg-lightorange  h-10 w-12 flex justify-center items-center rounded-full z-50">
                        <Image className="h-4 w-4 object-contain " src={planetakeoff} alt="" />
                      </div>

                      <div className="w-full">
                        <div className="flex justify-between w-full">
                          <div className="">
                            <p className="font-extrabold text-2xl text-black">MLE</p>
                            <p className="font-normal text-xs text-pearlgray">
                              Male International Airport
                            </p>
                          </div>
                          <div className="">
                            <p className="font-black text-2xl text-black text-end">16:30</p>
                            <p className="font-normal text-xs text-pearlgray text-end">10 Feb 24</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-10">
                    <div className="flex gap-4 relative">
                      <div className="bg-black h-10 w-12 flex justify-center items-center rounded-full z-50">
                        <Image className="h-4 w-4 object-contain " src={planetakeoff} alt="" />
                      </div>
                      <div className="absolute h-full top-7 left-5 border-dashed border-Silvergray border "></div>
                      <div className="w-full">
                        <div className="flex justify-between w-full">
                          <div className="">
                            <p className="font-extrabold text-2xl text-black">MLE</p>
                            <p className="font-normal text-xs text-pearlgray">
                              Male International Airport
                            </p>
                          </div>
                          <div className="">
                            <p className="font-black text-2xl text-black text-end">17:45</p>
                            <p className="font-normal text-xs text-pearlgray text-end">17 Feb 24</p>
                          </div>
                        </div>
                        <div className="bg-white p-3 my-2 xl:w-full rounded-lg border border-cadetgray ">
                          <div className="flex gap-3 py-2">
                            <Image className="h-5 w-5 object-contain" src={wine} alt="" />
                            <p className="font-black text-sm text-black">Lounge Access</p>
                          </div>
                          <div className="flex gap-3 my-1">
                            <Image className="h-5 w-5 object-contain" src={chair} alt="" />
                            <div>
                              <p className="font-black text-sm text-black">Seats</p>
                              <p className="font-medium text-xs text-slategray">6D, 6F, 7D, 7F</p>
                            </div>
                          </div>
                          <div className="flex gap-3 py-2">
                            <Image className="h-5 w-5 object-contain" src={briefcase} alt="" />
                            <div>
                              <p className="font-black text-sm text-black">Baggage 1x32kg</p>
                              <p className="font-medium text-xs text-slategray">
                                Cabin Baggage 7kg
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 py-2">
                            <Image className="h-5 w-5 object-contain" src={utensils} alt="" />
                            <p className="font-black text-sm text-black">In-flight luxury dining</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 ">
                      <div className="bg-black h-10 w-12 flex justify-center items-center rounded-full z-50">
                        <Image className="h-4 w-4 object-contain " src={planetakeoff} alt="" />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between w-full">
                          <div className="">
                            <p className="font-extrabold text-2xl text-black">DWC</p>
                            <p className="font-normal text-xs text-pearlgray">
                              Dubai International Airport
                            </p>
                          </div>
                          <div className="">
                            <p className="font-black text-2xl text-black text-end">23:55</p>
                            <p className="font-normal text-xs text-pearlgray text-end">10 Feb 24</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                      <div className="flex gap-3">
                        <div className="flex justify-center items-center">
                          <Image className="h-5 w-5 object-containt" src={group} alt="" />
                        </div>
                        <div>
                          <p className="text-black font-medium text-lg">Passengers</p>
                          <p className="text-sm font-medium text-pearlgray">2 Adults, 2 Children</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="font-black text-sm text-aqua cursor-pointer"> Modify</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                      <div className="flex gap-3">
                        <div className="flex justify-center items-center">
                          <Image className="h-5 w-5 object-containt" src={orangechair} alt="" />
                        </div>
                        <div>
                          <p className="text-black font-medium text-lg">Seat Selection</p>
                          <p className="text-sm font-medium text-pearlgray">Change your seats</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="font-black text-sm text-aqua cursor-pointer"> Modify</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                      <div className="flex gap-3">
                        <div className="flex justify-center items-center">
                          <Image className="h-5 w-5 object-containt" src={flower} alt="" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-pearlgray">Fare Family</p>
                          <p className="text-black font-medium text-lg ">Bliss</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="font-black text-sm text-aqua cursor-pointer"> Modify</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-purpal p-4 rounded-bl-2xl rounded-br-2xl">
                  <h1 className="font-black text-base black text-black">Price Breakdown</h1>
                  <div className="flex justify-between py-1">
                    <p className="font-medium text-xs text-pearlgray">Bliss Ticket x4</p>
                    <p className="font-medium text-xs text-pearlgray">$12,000</p>
                  </div>
                  <div className="flex justify-between py-1">
                    <p className="font-medium text-xs text-pearlgray">Seat Upgrade x4</p>
                    <p className="font-medium text-xs text-pearlgray">$1,000</p>
                  </div>
                  <div className="flex justify-between py-1">
                    <p className="font-medium text-xs text-pearlgray">Taxes & Charges</p>
                    <p className="font-medium text-xs text-pearlgray">$1,000</p>
                  </div>
                  <div className="flex justify-between py-1">
                    <p className="font-black text-sm text-black">Total Price</p>
                    <p className="font-black text-sm text-black">$1,000</p>
                  </div>
                </div>
              </div>
              <div className="xs:mb-40 xl:mb-0">
                <div>
                  <h1 className="font-black text-xl text-black">Featured Add-ons</h1>
                </div>
                <div className="bg-white  xl:w-full mt-3 rounded-lg">
                  <div className="flex p-3 justify-between items-center">
                    <div>
                      <h1 className="text-base font-black text-black">Champagne</h1>
                      <p className="text-xs font-normal text-pearlgray">
                        Enjoy unlimited champagne throughout the entire duration of the flight
                      </p>
                      <p className="font-black text-sm text-aqua">$150 Per Person</p>
                    </div>
                    <div>
                      <Image
                        className="h-28 w-44 object-contain rounded-md"
                        src={champagne}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white  xl:w-full mt-3 rounded-lg">
                  <div className="flex p-3 justify-between items-center ">
                    <div>
                      <h1 className="text-base font-black text-black">Celebration Cake</h1>
                      <p className="text-xs font-normal text-pearlgray">
                        Unlimited cake to celebrate your special occasion
                      </p>
                      <p className="font-black text-sm text-aqua">$100 Per Person</p>
                    </div>
                    <div>
                      <Image className="h-32 w-32 object-contain rounded-md" src={cake} alt="" />
                    </div>
                  </div>
                </div>
                <div className="bg-white  xl:w-full mt-3 rounded-lg">
                  <div className="flex p-3 justify-between items-center">
                    <div>
                      <h1 className="text-base font-black text-black">Honeymoon Package</h1>
                      <p className="text-xs font-normal text-pearlgray">
                        Enjoy unlimited champagne and caviar onboard the flight
                      </p>
                      <p className="font-black text-sm text-aqua">$250 Per Person</p>
                    </div>
                    <div>
                      <Image className="h-36 w-36 object-contain " src={couple} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showModal == true && (
            <div>
              <div
                style={{ display: 'flex' }}
                className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
              >
                <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
                  <div className="relative bg-white rounded-lg shadow    calendar-modal ">
                    <div className="p-4 text-center">
                      <FontAwesomeIcon
                        icon={faXmark}
                        aria-hidden="true"
                        className="arrow-modal cursor-pointer"
                        onClick={() => {
                          setShowModal(!showModal);
                        }}
                      />

                      <div className="my-3">
                        <p className="font-black text-xl text-black">Modify Your Booking</p>
                      </div>
                      <div className="my-2">
                        <Link href="changedate">
                          <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                            <div className="flex gap-3">
                              <div className="flex justify-center items-center">
                                <Image
                                  className="h-5 w-5 object-containt"
                                  src={calendardays}
                                  alt=""
                                />
                              </div>
                              <div>
                                <p className="text-black font-medium text-lg">Change Dates</p>
                                <p className="text-sm font-medium text-pearlgray">
                                  10 Feb - 17 Feb 24
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center">
                              <p className="font-black text-xs text-aqua"> Modify</p>
                              <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                            </div>
                          </div>
                        </Link>
                        <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                          <div className="flex gap-3">
                            <div className="flex justify-center items-center">
                              <Image className="h-5 w-5 object-containt" src={group} alt="" />
                            </div>
                            <div>
                              <p className="text-black font-medium text-lg">Passengers</p>
                              <p className="text-sm font-medium text-pearlgray">
                                2 Adults, 2 Children
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center cursor-pointer">
                            <p className="font-black text-xs text-aqua"> Modify</p>
                            <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                          <div className="flex gap-3">
                            <div className="flex justify-center items-center">
                              <Image className="h-5 w-5 object-containt" src={orangechair} alt="" />
                            </div>
                            <div>
                              <p className="text-black font-medium text-lg">Seat Selection</p>
                              <p className="text-sm font-medium text-pearlgray">
                                No seats selected yet
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center cursor-pointer">
                            <p className="font-black text-xs text-aqua"> Choose</p>
                            <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                          <div className="flex gap-3">
                            <div className="flex justify-center items-center">
                              <Image className="h-5 w-5 object-containt" src={flower} alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-pearlgray">Fare Family</p>
                              <p className="text-black font-medium text-lg">Bliss</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center cursor-pointer">
                            <p className="font-black text-xs text-aqua"> Modify</p>
                            <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
                          <div className="flex gap-3">
                            <div className="flex justify-center items-center">
                              <Image className="h-5 w-5 object-containt" src={xcircle} alt="" />
                            </div>
                            <div>
                              <p className="text-black font-medium text-lg">Cancel Your Booking</p>
                              <p className="text-sm font-medium text-pearlgray">Cancel your trip</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center cursor-pointer">
                            <p className="font-black text-xs text-aqua"> Cancel</p>
                            <FontAwesomeIcon icon={faAngleRight} className="h-4 w-4 text-aqua" />
                          </div>
                        </div>
                      </div>

                      <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full m-auto">
                        <button
                          onClick={() => {
                            setShowModal(!showModal);
                          }}
                          type="button"
                          className="w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="xs:not-sr-only	xl:sr-only">
            <div className="fixed w-full left-0 bottom-0 z-50">
              <div className="mt-6">
                <div className="bg-white p-3">
                  <div className="pt-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full xl:w-48  m-auto">
                    <button
                      onClick={() => setShowModal(!showModal)}
                      type="button"
                      className="xs:w-full  xs:justify-center  xs:text-center text-aqua border border-aqua bg-white font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                    >
                      Modify Booking
                    </button>
                  </div>
                  <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full xl:w-48  m-auto">
                    <button
                      type="button"
                      className="xs:w-full  xs:justify-center  xs:text-center text-white bg-aqua font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                    >
                      Add Passenger Details
                    </button>
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

export default ReviewTripComplete;
