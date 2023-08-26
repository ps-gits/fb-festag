import Image from 'next/image';
import { useEffect } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import star from '../../assets/images/star.png';
import plane from '../../assets/images/group.png';
// import car from '../../assets/images/whitecar.png';
import repeat from '../../assets/images/repeat.png';
import carwhite from '../../assets/images/carwhite.png';
// import dooropen from '../../assets/images/dooropen.png';
import whiteuser from '../../assets/images/whiteuser.png';
import banner from '../../assets/images/profilebanner.png';
import whiteplane from '../../assets/images/planetakeoff.png';
import { getAllBooking } from 'src/redux/action/SearchFlights';
import { getFamilyDetails } from 'src/redux/action/CreateAccount';
import { setSavedFamilyDetails } from 'src/redux/reducer/CreateAccount';

const MyProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const userDetails = useSelector((state: RootState) => state?.createAccount?.signIn);
  const allBookingData = useSelector(
    (state: RootState) => state?.flightDetails?.allBooking?.active
  );

  useEffect(() => {
    if (userDetails?.Login !== undefined) {
      dispatch(getAllBooking() as unknown as AnyAction);
      dispatch(getFamilyDetails(userDetails?.Login) as unknown as AnyAction);
      dispatch(setSavedFamilyDetails([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <main>
      {userDetails?.Login !== undefined ? (
        <div className="relative">
          <div className="xl:not-sr-only	xs:sr-only">
            <div className="xl:w-1/4 xs:w-full">
              <div>
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
                        <div className="pb-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
                          <button
                            type="button"
                            className="w-full xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                          >
                            Start a New Booking
                          </button>
                        </div>

                        <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
                          <button
                            type="button"
                            className="w-full xs:justify-center  xs:text-center text-aqua border border-aqua bg-white font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                          >
                            Account Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-cadetgray  xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute  xl:top-4  xs:top-0 xs:w-full xs:px-3  xl:w-3/4 xl:py-10 index-style ">
              <div className="xl:w-2/4 xl:m-auto xl:pt-10 xs:pt-20">
                <div>
                  <div>
                    <div>
                      <p className=" font-medium text-base text-pearlgray">
                        Welcome back,{' '}
                        {userDetails?.FirstName?.charAt(0)?.toUpperCase() +
                          userDetails?.FirstName?.slice(1)}
                      </p>
                      <h1 className="text-2xl font-black  text-black">Overview</h1>
                    </div>
                    <div className="py-1">
                      <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                        <div>
                          <div className="flex gap-3 items-center">
                            <div className="  p-2 rounded-full">
                              <Image className="h-5 w-6 object-containt" src={plane} alt="" />
                            </div>
                            <div className="w-full">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-black font-medium text-lg">My Family</p>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-pearlgray">
                                2 Adults, 2 Children
                              </p>
                            </div>
                            <div
                              className="mt-2 flex items-center cursor-pointer"
                              onClick={() => router.push('/myfamily')}
                            >
                              <p className="font-black text-sm text-aqua">Edit </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {allBookingData?.length > 0 && (
                      <div className="py-1">
                        <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                          <div className="flex justify-between">
                            <div className="py-2">
                              <h1 className="text-xl  font-extrabold text-black">
                                Your Upcoming Trips
                              </h1>
                            </div>
                            <div className="mt-2 flex items-center cursor-pointer">
                              <p className=" text-base text-aqua font-medium">View All </p>
                            </div>
                          </div>
                          {allBookingData?.map(
                            (
                              item: {
                                originCode: string;
                                destinationCode: string;
                                originDate: string;
                                destinationDate: string;
                              },
                              index: number
                            ) => (
                              <div
                                className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3"
                                key={index}
                              >
                                <div className="flex gap-3  ">
                                  <div className="bg-lightorange  p-2 rounded-full w-14 h-10 flex justify-center">
                                    <Image
                                      className="h-5 w-5 object-containt"
                                      src={whiteplane}
                                      alt=""
                                    />
                                  </div>
                                  <div className="w-full">
                                    <div className="flex justify-between">
                                      <div>
                                        <p className="text-black font-black text-base">
                                          {item?.originCode} - {item?.destinationCode}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-xs font-normal text-pearlgray">
                                      {item?.originDate} - {item?.destinationDate}
                                    </p>
                                  </div>
                                  <div className="mt-2 flex  cursor-pointer">
                                    <p className="font-black text-xs text-aqua whitespace-nowrap">
                                      View Booking
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2 my-3">
                                  <div className=" p-4 py-2 px-2 bg-white rounded-2xl border-cadetgray border text-black ">
                                    <div className="flex gap-2 items-center">
                                      <Image
                                        className="h-5 w-5 object-cover"
                                        src={whiteuser}
                                        alt=""
                                      />
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
                                      <Image
                                        className="h-5 w-5 object-cover"
                                        src={carwhite}
                                        alt=""
                                      />
                                      <p className="text-xs font-medium">Transfer</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                          <div className="flex flex-wrap -mb-px text-sm font-medium text-center  text-black ">
                            <div className="flex md:flex block h-full items-center justify-center relative gap-3 py-3 xs:w-full  ">
                              <button
                                type="button"
                                className="xs:justify-center  xs:text-center text-aqua border border-aqua bg-white  font-black rounded-lg text-lg inline-flex items-center py-2 text-center w-full "
                              >
                                Add a booking
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-white p-3 rounded-lg border  border-cadetgray drop-shadow mb-3">
                      <div>
                        <div className="flex gap-3 items-center">
                          <div className="  p-2 rounded-full">
                            <Image className="h-5 w-6 object-containt" src={star} alt="" />
                          </div>
                          <div className="w-full">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-black font-medium text-lg">My Promo Codes</p>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-pearlgray">2 Active Codes</p>
                          </div>
                          <div className="mt-2 flex items-center cursor-pointer">
                            <p className="font-black text-sm text-aqua">View </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          User Not Logged In.
          <br />
          <br />
          <button className="cursor-pointer" onClick={() => router.push('/signin')}>
            SignIn Page
          </button>
        </div>
      )}
    </main>
  );
};

export default MyProfile;
