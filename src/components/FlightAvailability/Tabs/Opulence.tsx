import moment from 'moment';
// import Image from 'next/image';
// import { AnyAction } from 'redux';
import { useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import FlightInfo from './FlightInfo';
import { RootState } from 'src/redux/store';
// import { loader } from 'src/redux/reducer/Loader';
// import PassengerCount from '../../Modal/PassengerCount';
// import { setSelectedFlightData } from 'src/redux/reducer/FlightDetails';
import { commonArrivalData, commonDepartureData } from './MatrixFunctions';
// import { postPrepareExchangeFlights } from 'src/redux/action/SearchFlights';

const Opulence = (props: flightAvaliabilityTab) => {
  const {
    // router,
    // PnrCode,
    showModal,
    fareFamily,
    modifyData,
    // adultLabel,
    noDataFound,
    notAvailable,
    setShowModal,
    selectFlight,
    // modifyButton,
    // childrenLabel,
    // passengerLogo,
    // confirmButton,
    // passengerCount,
    showFlightInfo,
    setSelectFlight,
    // passengersLabel,
    // PassangerLastname,
    setShowFlightInfo,
    // setPassengerCount,
  } = props;

  // const dispatch = useDispatch();

  const flightData = useSelector(
    (state: RootState) => state?.flightDetails?.searchFlight?.opulence
  );
  const selectedDetailsForFlight = useSelector(
    (state: RootState) => state?.flightDetails?.reviewFlight?.OriginDestinations
  );

  const flightInfo = flightData?.find(
    (item: { OriginCode: string }) => item !== undefined && item?.OriginCode?.length > 1
  );

  const sortedFlights = (
    flightData?.length < 9
      ? selectedDetailsForFlight?.length === 1
        ? flightData
        : [
            ...flightData,
            ...new Array(9 - flightData?.length).fill({
              TotalAmount: -1,
              Otr: new Date().toJSON(),
            }),
          ]
      : flightData?.slice(0, 9)
  )?.map((item: flightInfo, _index: number, arr: flightInfo[]) => {
    const findDate = arr?.find(
      (dt) =>
        (dt as flightInfo)?.Otr ===
          commonDepartureData(flightData)?.find((data) => data?.Otr === item.Otr)?.Otr &&
        (dt as flightInfo)?.Dtr ===
          commonArrivalData(flightData)?.find((data) => data?.Dtr === item.Dtr)?.Dtr
    );
    return findDate
      ? findDate
      : {
          TotalAmount: -1,
        };
  });

  useEffect(() => {
    if (selectFlight?.details !== undefined && selectFlight?.name === fareFamily) {
      const displayIndex = sortedFlights?.findIndex(
        (_sf: flightInfo, listIndex: number) =>
          selectFlight?.details?.Otr ===
            (commonDepartureData(flightData)?.length < 3
              ? [
                  ...commonDepartureData(flightData),
                  ...new Array(3 - commonDepartureData(flightData)?.length).fill({
                    TotalAmount: -1,
                    Dtr: '',
                  }),
                ]
              : commonDepartureData(flightData)?.slice(0, 3))[listIndex % 3]?.Otr &&
          (selectedDetailsForFlight?.length === 1
            ? true
            : selectFlight?.details?.Dtr ===
              (commonArrivalData(flightData)?.length < 3
                ? [
                    ...commonArrivalData(flightData),
                    ...new Array(3 - commonArrivalData(flightData)?.length).fill({
                      TotalAmount: -1,
                      Dtr: '',
                    }),
                  ]
                : commonArrivalData(flightData)?.slice(0, 3))[Math.floor(listIndex / 3)]?.Dtr)
      );
      if (displayIndex !== -1) {
        setSelectFlight({
          ...selectFlight,
          index: displayIndex,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFlight?.name]);

  return (
    <div>
      {!showFlightInfo ? (
        <div className=" rounded-lg bg-gray-50 dark:bg-gray-800">
          <div>
            <div className=" xl:pt-3">
              <div className="lg:flex md:flex block h-full relative gap-3 xl:w-full xs:w-full border border-cadetgray rounded-lg">
                <div className="bg-white lg:w-w-1/3 w-full rounded-lg  ">
                  {flightData?.length > 0 && sortedFlights?.length > 0 ? (
                    <div className="grid grid-cols-4">
                      <div className="bg-white flex flex-col justify-center text-black p-4 border-b border-r border-aqua  items-center">
                        <div className="flex gap-1">
                          <p className="font-semibold text-xs text-black whitespace-nowrap text-small">
                            {flightInfo?.OriginCode} - {flightInfo?.DestinationCode}
                          </p>
                          {flightInfo?.OriginCode?.length > 0 && (
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              aria-hidden="true"
                              className="text-black text-sm font-black h-3 w-3"
                            />
                          )}
                        </div>
                        {selectedDetailsForFlight?.length > 1 &&
                          flightInfo?.DestinationCode?.length > 0 && (
                            <div className="flex gap-1">
                              <p className="font-semibold text-xs text-black  whitespace-nowrap text-small">
                                {flightInfo?.DestinationCode} - {flightInfo?.OriginCode}
                              </p>
                              <FontAwesomeIcon
                                icon={faArrowDown}
                                aria-hidden="true"
                                className="text-black text-sm font-black h-3 w-3"
                              />
                            </div>
                          )}
                      </div>
                      {(commonDepartureData(flightData)?.length < 3
                        ? [
                            ...commonDepartureData(flightData),
                            ...new Array(3 - commonDepartureData(flightData)?.length).fill({
                              TotalAmount: -1,
                              Otr: '',
                            }),
                          ]
                        : commonDepartureData(flightData)?.slice(0, 3)
                      )?.map((item: { Otr: string }, index: number) => {
                        return (
                          <div
                            key={`opulence1-${index}`}
                            className={`bg-white p-4 font-extrabold text-xs flex flex-col text-black justify-center items-center border-b border-aqua ${
                              selectFlight?.display && selectFlight?.details?.Otr === item?.Otr
                                ? 'border-b-4'
                                : ''
                            }`}
                          >
                            {item.Otr?.length > 0 ? (
                              <>
                                <p className="text-black">
                                  {moment
                                    .utc(item?.Otr)
                                    .toDate()
                                    .toUTCString()
                                    ?.split(',')[0]
                                    ?.trim()}
                                </p>
                                <p className="text-black">
                                  {moment
                                    .utc(item.Otr)
                                    .toDate()
                                    .toUTCString()
                                    ?.split(',')[1]
                                    ?.trim()
                                    ?.substring(0, 6)}
                                </p>
                              </>
                            ) : selectedDetailsForFlight?.length === 1 ? (
                              ''
                            ) : (
                              <div className="py-2">-</div>
                            )}
                          </div>
                        );
                      })}
                      {(commonArrivalData(flightData)?.length < 3
                        ? [
                            ...commonArrivalData(flightData),
                            ...new Array(3 - commonArrivalData(flightData)?.length).fill({
                              TotalAmount: -1,
                              Dtr: '',
                            }),
                          ]
                        : commonArrivalData(flightData)?.slice(0, 3)
                      )?.map((item: { Dtr: string }, index: number, arr: { Dtr: string }[]) => {
                        return (
                          <Fragment key={`opulence2-${index}`}>
                            <div
                              className={`${
                                selectedDetailsForFlight?.length === 1 &&
                                index > arr?.filter((data) => data?.Dtr?.length === 0)?.length
                                  ? ''
                                  : (selectedDetailsForFlight?.length === 1 && index === 0) ||
                                    selectedDetailsForFlight?.length === 2
                                  ? 'bg-white border-r border-aqua '
                                  : 'bg-white border-aqua '
                              } ${
                                selectedDetailsForFlight?.length !== 1
                                  ? item?.Dtr?.length > 0
                                    ? 'p-4 font-extrabold text-xs flex flex-col text-black justify-center items-center'
                                    : 'flex justify-center items-center'
                                  : ''
                              } ${
                                (selectFlight?.display &&
                                  selectFlight?.details?.Dtr === item?.Dtr) ||
                                (selectFlight?.display && selectedDetailsForFlight?.length === 1)
                                  ? (selectedDetailsForFlight?.length === 1 && index === 0) ||
                                    selectedDetailsForFlight?.length === 2
                                    ? 'border-r-4'
                                    : modifyData
                                    ? 'border-r-4'
                                    : ''
                                  : ''
                              }`}
                            >
                              {selectedDetailsForFlight?.length !== 1 && item?.Dtr?.length > 0 ? (
                                <>
                                  <p className="text-black">
                                    {moment
                                      .utc(item?.Dtr)
                                      .toDate()
                                      .toUTCString()
                                      ?.split(',')[0]
                                      .trim()}
                                  </p>
                                  <p className="text-black">
                                    {moment
                                      .utc(item?.Dtr)
                                      .toDate()
                                      .toUTCString()
                                      ?.split(',')[1]
                                      .trim()
                                      .substring(0, 6)}
                                  </p>
                                </>
                              ) : selectedDetailsForFlight?.length === 1 ? (
                                ''
                              ) : (
                                <div className="py-2">-</div>
                              )}
                            </div>
                            {sortedFlights?.map((_dt: flightInfo, listIndex: number) => {
                              const displayData = sortedFlights?.find(
                                (sf: flightInfo) =>
                                  sf?.Otr ===
                                    (commonDepartureData(flightData)?.length < 3
                                      ? [
                                          ...commonDepartureData(flightData),
                                          ...new Array(
                                            3 - commonDepartureData(flightData)?.length
                                          ).fill({
                                            TotalAmount: -1,
                                            Dtr: '',
                                          }),
                                        ]
                                      : commonDepartureData(flightData)?.slice(0, 3))[listIndex % 3]
                                      ?.Otr &&
                                  (selectedDetailsForFlight?.length === 1
                                    ? true
                                    : sf?.Dtr ===
                                      (commonArrivalData(flightData)?.length < 3
                                        ? [
                                            ...commonArrivalData(flightData),
                                            ...new Array(
                                              3 - commonArrivalData(flightData)?.length
                                            ).fill({
                                              TotalAmount: -1,
                                              Dtr: '',
                                            }),
                                          ]
                                        : commonArrivalData(flightData)?.slice(0, 3))[
                                        Math.floor(listIndex / 3)
                                      ]?.Dtr)
                              );
                              return (
                                <Fragment key={`delight3-${listIndex}`}>
                                  {listIndex >= index * 3 && listIndex < (index + 1) * 3 && (
                                    <div
                                      className={`py-6 border flex flex-col  justify-center items-center text-center cursor-pointer ${
                                        selectFlight?.display &&
                                        selectFlight?.index === listIndex &&
                                        displayData &&
                                        displayData?.TotalAmount > 0 &&
                                        selectFlight?.details?.TotalAmount ===
                                          displayData?.TotalAmount
                                          ? 'bg-lightaqua border-aqua'
                                          : 'bg-white border-gray'
                                      }`}
                                      onClick={() => {
                                        displayData &&
                                          displayData?.TotalAmount > 0 &&
                                          setSelectFlight({
                                            display: true,
                                            name: fareFamily,
                                            index: listIndex,
                                            details: displayData as flightInfo,
                                          });
                                      }}
                                    >
                                      {displayData && displayData?.TotalAmount > 0 ? (
                                        <div className="py-2">
                                          <p className="text-xs font-extrabold text-black">
                                            {(displayData?.currency ? displayData?.currency : '') +
                                              ' ' +
                                              Math.floor(displayData?.TotalAmount)?.toLocaleString(
                                                'en-GB'
                                              )}
                                          </p>
                                          <p className="font-medium text-xs text-yellow">
                                            {displayData?.BestPrice?.length > 0
                                              ? `${displayData?.BestPrice}`
                                              : ''}
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="py-2 text-xs text-black font-extrabold">
                                          {notAvailable}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Fragment>
                              );
                            })}
                          </Fragment>
                        );
                      })}
                    </div>
                  ) : (
                    <div>{noDataFound}</div>
                  )}
                </div>
              </div>
              <div>
                {/* <div className="bg-white px-3 py-2 rounded-lg mb-2">
                  <div>
                    <h2 id="accordion-collapse-heading-1">
                      <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500">
                        <div className="flex gap-3">
                          <div className="flex justify-center items-center">
                            {passengerLogo !== undefined && (
                              <Image
                                src={passengerLogo}
                                className="h-5 w-5 object-cover"
                                alt=""
                                height={5}
                                width={5}
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-black font-black text-xl">{passengersLabel}</div>
                            <p className="text-sm font-normal text-neviblue">
                              {`${passengerCount?.adult} ${adultLabel} ${
                                passengerCount && passengerCount?.children > 0
                                  ? `, ${passengerCount?.children} ${childrenLabel}`
                                  : ''
                              }`}
                            </p>
                          </div>
                        </div>
                        <div
                          className="mt-2 cursor-pointer"
                          onClick={() => {
                            setShowModal({
                              depart: false,
                              return: false,
                              passenger: true,
                              compareFareFamily: false,
                            });
                            document.body.style.overflow = 'hidden';
                          }}
                        >
                          <p className="font-black text-sm text-aqua">{modifyButton}</p>
                        </div>
                      </div>
                      <PassengerCount
                        navigate={false}
                        id="modal-passenger-opulence"
                        name="flightAvailability"
                        modifyBooking={modifyData}
                        closeModal={() => {
                          setShowModal({
                            depart: false,
                            return: false,
                            passenger: false,
                            compareFareFamily: false,
                          });
                          document.body.style.overflow = 'unset';
                        }}
                        adult={passengerCount?.adult}
                        flightDetails={passengerCount}
                        showModal={showModal?.passenger}
                        setSelectFlight={setSelectFlight}
                        childrens={passengerCount?.children}
                        setFlightDetails={setPassengerCount}
                      />
                    </h2>
                  </div>
                </div> */}
              </div>
              <div>
                {/* <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full xl:w-full py-3 m-auto">
                  <button
                    type="button"
                    disabled={
                      !selectFlight?.display && selectFlight?.details?.OriginCode?.length > 1
                    }
                    className={`w-full  xs:justify-center  xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center  ${
                      selectFlight?.display && selectFlight?.details?.OriginCode?.length > 1
                        ? ''
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (selectFlight?.display && selectFlight?.details?.OriginCode?.length > 1) {
                        if (modifyData) {
                          dispatch(
                            loader({
                              show: true,
                              name: 'search',
                            })
                          );
                          dispatch(setSelectedFlightData(selectFlight));
                          dispatch(
                            postPrepareExchangeFlights(
                              {
                                PassangerLastname: PassangerLastname,
                                PnrCode: PnrCode,
                                RefItinerary: selectFlight?.details?.RefItinerary,
                                Ref: selectFlight?.details?.Ref,
                                FareFamily: selectFlight?.name,
                              },
                              router
                            ) as unknown as AnyAction
                          );
                        } else {
                          setShowFlightInfo(true);
                          dispatch(setSelectedFlightData(selectFlight));
                        }
                      }
                    }}
                  >
                    {confirmButton}
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <FlightInfo
          showModal={showModal}
          setShowModal={setShowModal}
          setSelectFlight={setSelectFlight}
          setShowFlightInfo={setShowFlightInfo}
        />
      )}
    </div>
  );
};

export default Opulence;
