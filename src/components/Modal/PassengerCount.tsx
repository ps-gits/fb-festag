import Image from 'next/image';
import { useState } from 'react';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import { setPassengerDetails } from 'src/redux/reducer/PassengerDetails';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';
import { completeFlightDetails } from 'components/FlightAvailability/Tabs/MatrixFunctions';
import { setReviewFlightData, setSelectedFlightData } from 'src/redux/reducer/FlightDetails';
import { postSearchFlights, postSearchExchangeFlights } from 'src/redux/action/SearchFlights';

const PassengerCount = (props: modalType) => {
  const {
    id,
    name,
    adult,
    navigate,
    childrens,
    showModal,
    closeModal,
    modifyBooking,
    flightDetails,
    setSelectFlight,
    setFlightDetails,
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const selectedDetailsForFlight = useSelector(
    (state: RootState) => state?.flightDetails?.reviewFlight
  );
  const flightAvailablityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const findBookingInfo = useSelector((state: RootState) => state?.flightDetails?.findBooking);
  const modalContent = useSelector((state: RootState) => state?.sitecore?.passengerModal?.fields);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);

  const [passengerCount, setPassengerCount] = useState({
    adult: adult as number,
    children: childrens as number,
  });

  const selectedFareFamily = flightAvailablityContent?.find(
    (item: { name: string }) => item?.name === 'delight'
  );

  const handleIncrement = (type: string) => {
    if (type === 'adult') {
      setPassengerCount({
        adult: passengerCount?.adult + 1,
        children: passengerCount?.children,
      });
    } else if (type === 'children') {
      setPassengerCount({
        adult: passengerCount?.adult,
        children: passengerCount?.children + 1,
      });
    }
  };

  const handleDecrement = (type: string) => {
    if (type === 'adult') {
      setPassengerCount({
        adult: passengerCount?.adult - 1,
        children: passengerCount?.children,
      });
    } else if (type === 'children') {
      setPassengerCount({
        adult: passengerCount?.adult,
        children: passengerCount?.children - 1,
      });
    }
  };

  const searchFlight = () => {
    if (modifyBooking) {
      const dataToPost = {
        PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
        RefETTicketFare: modifyBookingInfo?.RefETTicketFare,
        PassangerLastname: findBookingInfo?.PassengerName,
        Passengers:
          passengerCount && (passengerCount?.children as number) > 0
            ? [
                {
                  Ref: 'P1',
                  RefClient: '',
                  PassengerQuantity: passengerCount?.adult as number,
                  PassengerTypeCode: 'AD',
                },
                {
                  Ref: 'P2',
                  RefClient: '',
                  PassengerQuantity: passengerCount?.children as number,
                  PassengerTypeCode: 'CHD',
                },
              ]
            : [
                {
                  Ref: 'P1',
                  RefClient: '',
                  PassengerQuantity: passengerCount?.adult as number,
                  PassengerTypeCode: 'AD',
                },
              ],
        OriginDestinations: modifyBookingInfo?.OriginDestination?.map(
          (item: {
            TargetDate: Date;
            OriginCode: string;
            DepartureDate: string;
            DestinationCode: string;
          }) => {
            return {
              OriginCode: item?.OriginCode,
              Extensions: null,
              DestinationCode: item?.DestinationCode,
              TargetDate: item?.DepartureDate,
            };
          }
        ),
      };
      dispatch(
        loader({
          show: true,
          name: 'search',
        })
      );
      dispatch(postSearchExchangeFlights(dataToPost, router, true) as unknown as AnyAction);
    } else {
      setSelectFlight &&
        setSelectFlight({
          display: false,
          name: '',
          index: 0,
          details: completeFlightDetails,
        });
      selectedDetailsForFlight?.DateFlexible && dispatch(setSelectedFlightData([]));
      const searchFlightData = {
        DateFlexible: selectedDetailsForFlight?.DateFlexible,
        Passengers:
          passengerCount && (passengerCount?.children as number) > 0
            ? [
                {
                  Ref: 'P1',
                  RefClient: '',
                  PassengerQuantity: passengerCount?.adult as number,
                  PassengerTypeCode: 'AD',
                },
                {
                  Ref: 'P2',
                  RefClient: '',
                  PassengerQuantity: passengerCount?.children as number,
                  PassengerTypeCode: 'CHD',
                },
              ]
            : [
                {
                  Ref: 'P1',
                  RefClient: '',
                  PassengerQuantity: passengerCount?.adult as number,
                  PassengerTypeCode: 'AD',
                },
              ],
        OriginDestinations: selectedDetailsForFlight?.OriginDestinations,
      };
      dispatch(
        loader({
          show: true,
          name: 'search',
        })
      );
      dispatch(setPassengerDetails([]));
      dispatch(setReviewFlightData(searchFlightData));
      dispatch(
        postSearchFlights(
          searchFlightData,
          navigate as boolean,
          selectedFareFamily?.value,
          router
        ) as unknown as AnyAction
      );
    }
  };

  return (
    <div>
      {showModal && (
        <div
          id={id}
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
        >
          <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 calendar-modal">
              <div className="py-5 px-4 text-center">
                <FontAwesomeIcon
                  icon={faXmark}
                  aria-hidden="true"
                  className="arrow-modal cursor-pointer text-black"
                  onClick={() => {
                    closeModal();
                    if (name === 'flightAvailability') {
                      setPassengerCount({
                        adult: adult as number,
                        children: childrens as number,
                      });
                    }
                  }}
                />
                <div>
                  <h3 className="mb-0 text-xl text-black font-black">
                    {getFieldName(modalContent, 'heading')}
                  </h3>
                  <p className="text-sm text-pearlgray opacity-50 xs:mb-3">
                    {getFieldName(modalContent, 'content')}
                  </p>
                  <div className="text-left py-3">
                    <div className="flex">
                      <div className="flex justify-between w-full">
                        <div className="flex gap-3 w-6/12">
                          <div className="flex justify-center flex-col">
                            <p className="text-lg text-black font-black">
                              {getFieldName(modalContent, 'adult')}
                            </p>
                            <p className="text-sm font-normal text-black">
                              {getFieldName(modalContent, 'adultInfo')}
                            </p>
                          </div>
                        </div>
                        <div className="w-5/12 xs:flex xs:justify-end">
                          <div className="custom-number-input h-10 w-32">
                            <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                              <button
                                onClick={() => handleDecrement('adult')}
                                disabled={passengerCount && (passengerCount?.adult as number) < 2}
                                data-action="decrement"
                                className={`bg-lightblue text-gray-600 rounded-sm  hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l ${
                                  passengerCount && (passengerCount?.adult as number) < 2
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                                } outline-none`}
                              >
                                <span className="m-auto text-2xl font-thin text-aqua ">−</span>
                              </button>
                              <input
                                type="text"
                                className="  text-center w-full  font-semibold text-md   md:text-basecursor-default flex items-center text-black  outline-none"
                                name="custom-input-number"
                                disabled
                                value={passengerCount ? passengerCount?.adult : 0}
                              ></input>
                              <button
                                onClick={() => handleIncrement('adult')}
                                data-action="increment"
                                disabled={
                                  passengerCount &&
                                  (passengerCount?.children as number) +
                                    (passengerCount?.adult as number) >
                                    8
                                }
                                className={`bg-lightblue text-gray-600 rounded-sm  hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r ${
                                  passengerCount &&
                                  (passengerCount?.children as number) +
                                    (passengerCount?.adult as number) >
                                    8
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                                }`}
                              >
                                <span className="m-auto text-2xl font-thin text-aqua ">+</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-left py-3">
                    <div className="flex">
                      <div className="flex justify-between w-full">
                        <div className="flex gap-3 w-6/12">
                          <div className="flex justify-center flex-col">
                            <p className="text-lg font-black text-black ">
                              {getFieldName(modalContent, 'children')}
                            </p>
                            <p className="text-sm font-normal text-black">
                              {getFieldName(modalContent, 'childrenInfo')}
                            </p>
                          </div>
                        </div>
                        <div className="w-5/12 xs:flex xs:justify-end">
                          <div className="custom-number-input h-10 w-32">
                            <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                              <button
                                onClick={() => handleDecrement('children')}
                                disabled={(passengerCount?.children as number) === 0}
                                data-action="decrement"
                                className={`bg-lightblue  text-gray-600 rounded-sm  h-full w-20 rounded-l ${
                                  passengerCount && (passengerCount?.children as number) < 1
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                                } outline-none`}
                              >
                                <span className="m-auto text-2xl font-thin text-aqua">−</span>
                              </button>
                              <input
                                type="text"
                                className=" text-center rounded-sm w-full  font-semibold text-md   md:text-basecursor-default flex items-center text-black outline-none"
                                name="custom-input-number"
                                disabled
                                value={passengerCount?.children}
                              ></input>
                              <button
                                onClick={() => handleIncrement('children')}
                                data-action="increment"
                                disabled={
                                  passengerCount &&
                                  (passengerCount?.children as number) +
                                    (passengerCount?.adult as number) >
                                    8
                                }
                                className={`bg-lightblue h-full w-20 rounded-r ${
                                  passengerCount &&
                                  (passengerCount?.children as number) +
                                    (passengerCount?.adult as number) >
                                    8
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                                }`}
                              >
                                <span className="m-auto text-2xl font-thin text-aqua">+</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="my-6">
                    <div className="flex gap-3 ">
                      <div className="flex justify-center items-center">
                        <Image
                          className="h-6 w-7 object-cover"
                          src={getImageSrc(modalContent, 'passengerLogo') as string}
                          alt="passengerLogo"
                          width={8}
                          height={8}
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <p className="text-sm  text-black font-black">
                          {getFieldName(modalContent, 'groupBooking')}
                        </p>
                        <p className="text-xs font-black text-pearlgray">
                          {getFieldName(modalContent, 'groupBookingInfo')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-7 flex justify-center">
                  <button
                    type="button"
                    className="xl:w-full md:w-full xs:w-full  xs:justify-center xs:items-center  xs:flex text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center"
                    onClick={() => {
                      closeModal();
                      setFlightDetails({
                        ...flightDetails,
                        ...passengerCount,
                      });
                      if (name === 'flightAvailability') {
                        searchFlight();
                      }
                    }}
                  >
                    {getFieldName(modalContent, 'doneButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerCount;
