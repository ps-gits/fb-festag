import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Accordion } from 'flowbite-react';
import { getDate } from './GetDate';
import { RootState } from 'src/redux/store';
import { getImageSrc } from 'components/SearchFlight/SitecoreContent';

const FlightSchedule = (props: flightSchedule) => {
  const {
    index,
    seats,
    meals,
    Stops,
    // special,
    Remarks,
    WebClass,
    Duration,
    originCode,
    arrivalDate,
    arrivalTime,
    FlightNumber,
    loungeAccess,
    luxuryPickup,
    AircraftType,
    bagAllowances,
    departureDate,
    departureTime,
    destinationCode,
    originAirportName,
    OriginAirportTerminal,
    destinationAirportName,
    // seatsOriginToDestination,
    // seatsDestinationToOrigin,
    mealDataWithPassengerInfo,
    DestinationAirportTerminal,
    originToDestinationSeatData,
    destinationToOriginSeatData,
  } = props;

  const flightScheduleContent = useSelector(
    (state: RootState) => state?.sitecore?.commonImages?.fields
  );

  // const imageLoader = (src : String) => {
  //   return ""
  // }

  const imageLoaderPlane = () => {
    return getImageSrc(flightScheduleContent, 'planeblue') as string
  }

  return (
    <div key={index}>
      <div className="flex gap-4 relative mt-6">
        <div
          className={`${
            index === 0 ? 'bg-lightorange ' : 'bg-black'
          } h-10 w-12 flex justify-center items-center rounded-full z-10`}
        >
          <Image
            className="h-5 w-5 object-cover"
            src={getImageSrc(flightScheduleContent, 'planeTakeoff') as string}
            alt="departureLogo"
            width={5}
            height={5}
          />
        </div>
        <div className="absolute h-full top-4 left-5 border-dashed border-Silvergray border "></div>
        {Stops && Stops?.length > 0 && Stops[0]?.LocationCode !== null && (
          <div className="absolute w-11 left-0 top-1/2 flex flex-col items-center ">
            <div
              key={index}
              className="bg-white text-center flex flex-col group items-center relative group color-black"
            >
              <span className="cursor-pointer group">
                <Image
                  // src={stops}
                  src={getImageSrc(flightScheduleContent, 'stops') as string}
                  width={14}
                  height={15}
                  className="cursor-pointer m-auto"
                  alt=""
                />
                {Stops?.length > 0 && Stops[0]?.LocationCode !== null ? Stops[0]?.LocationCode : ''}
              </span>
              <div
                className={`absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex w-28 lg:w- pl-3`}
              >
                <span
                  style={{
                    display: 'block',
                    whiteSpace: 'normal',
                  }}
                  className="relative z-10 p-2 text-xs whitespace-no-wrap w-24 md:w-auto bg-white border rounded-lg border-graylight text-pearlgray font-normal leading-normal"
                >
                  {Remarks !== null && Remarks}
                </span>
                <div className="w-4 h-4 -mt-2 rotate-45 border border-t-0 border-l-0 z-50 shadow-lg border-graylight bg-white"></div>
              </div>
            </div>
          </div>
        )}
        <div className="w-full">
          <div className="flex justify-between w-full">
            <div className="">
              <p className="font-extrabold text-2xl text-black">{originCode}</p>
              <p className="font-normal text-xs text-pearlgray">{originAirportName}</p>
              <p className="font-normal text-xs text-pearlgray">
                {/* {' '} */}
                {OriginAirportTerminal ? `Terminal : ${OriginAirportTerminal}` : ''}{' '}
              </p>
            </div>
            <div className="">
              <p className="font-black text-2xl text-black text-end">{departureTime}</p>
              <p className="font-normal text-xs text-pearlgray text-end">Local Time</p>
              <p className="font-normal text-xs text-pearlgray text-end">
                {getDate(departureDate)}
              </p>
            </div>
          </div>
          <div className=" p-3 my-2 xl:w-full rounded-lg border border-cadetgray ">
            <div className="flex gap-3 items-center my-1">
              <Image
                className="h-6 w-6 object-cover"
                src={getImageSrc(flightScheduleContent, 'duration') as string}
                alt="durationLogo"
                width={8}
                height={8}
              />
              <p className="font-black text-sm text-black">Flight Duration:</p>
              <p className="font-normal text-xs text-pearlgray">{Duration}</p>
            </div>
            {FlightNumber && (
              <div className="flex gap-3 py-2 items-center">
                <Image
                  className="h-6 w-6 object-cover"
                  src={getImageSrc(flightScheduleContent, 'planeblue') as string}
                  loader={imageLoaderPlane}
                  alt="loungeAccessLogo"
                  width={8}
                  height={8}
                />
                <p className="font-black text-sm text-black">FlightNumber : </p>
                <p className="font-normal text-xs text-pearlgray">{FlightNumber}</p>
              </div>
            )}
            
              <div className="flex gap-3 py-2 items-center">
                <Image
                    className="h-6 w-6 object-cover"
                    src={getImageSrc(flightScheduleContent, 'planeblue') as string}
                    loader={imageLoaderPlane}
                    alt="loungeAccessLogo"
                    width={8}
                    height={8}
                  />
                <p className="font-black text-sm text-black">AircraftType : </p>
                <p className="font-normal text-xs text-pearlgray">{AircraftType}</p>
              </div>
            {/* {Remarks && (
              <div className="flex gap-3 py-2 items-center">
                <Image
                  className="h-6 w-6 object-cover"
                  src={getImageSrc(flightScheduleContent, 'loungeAccess') as string}
                  alt="loungeAccessLogo"
                  width={8}
                  height={8}
                />
                <p className="font-black text-sm text-black">Technical Stops : </p>
                <p className="font-normal text-xs text-pearlgray">{Remarks}</p>
              </div>
            )} */}
            {/* {luxuryPickup && (
              <div className="flex gap-3 items-center my-1">
                <Image
                  className="h-6 w-6 object-cover"
                  src={getImageSrc(flightScheduleContent, 'luxuryPickup') as string}
                  alt="luxuryPickupLogo"
                  width={8}
                  height={8}
                />
                <p className="font-black text-sm text-black">Luxury Pick-up</p>
              </div>
            )} */}
            {/* {loungeAccess && (
              <div className="flex gap-3 py-2 items-center">
                <Image
                  className="h-6 w-6 object-cover"
                  src={getImageSrc(flightScheduleContent, 'loungeAccess') as string}
                  alt="loungeAccessLogo"
                  width={8}
                  height={8}
                />
                <p className="font-black text-sm text-black">Lounge Access</p>
              </div>
            )} */}
            {/* {seats && (
              <div className="flex gap-3 py-2 items-center">
                <Image
                  className="h-6 w-6 object-cover"
                  src={getImageSrc(flightScheduleContent, 'seats') as string}
                  alt="seatLogo"
                  width={8}
                  height={8}
                />
                <div>
                  <p className="font-black text-sm text-black">Seats</p>
                  <p className="font-medium text-xs text-slategray">
                    {index === 0
                      ? seatsOriginToDestination && seatsOriginToDestination?.length > 0
                        ? seatsOriginToDestination?.map((item, index) =>
                            index === seatsOriginToDestination?.length - 1
                              ? item?.Text
                              : item?.Text + ' , '
                          )
                        : '6D, 6F, 7D, 7F'
                      : seatsDestinationToOrigin && seatsDestinationToOrigin?.length > 0
                      ? seatsDestinationToOrigin?.map((item, index) =>
                          index === seatsDestinationToOrigin?.length - 1
                            ? item?.Text
                            : item?.Text + ' , '
                        )
                      : ''}
                  </p>
                </div>
              </div>
            )} */}
            {/* seat */}
            {seats && (
              <div className='shedule-accordian'>
                <Accordion className="" collapseAll>
                  <Accordion.Panel>
                    <Accordion.Title>
                      <div className="flex align-center mb-2 gap-3">
                        <Image
                          className="h-6 w-6 object-cover"
                          src={getImageSrc(flightScheduleContent, 'seats') as string}
                          alt="seatLogo"
                          width={8}
                          height={8}
                        />
                        <h4 className="font-black text-sm text-black">Seats</h4>
                      </div>
                    </Accordion.Title>
                    <Accordion.Content>
                      <div className="gap-3 py-2">
                        {(index === 0
                          ? originToDestinationSeatData
                          : destinationToOriginSeatData
                        )?.map(
                          (
                            item: {
                              Firstname: string;
                              Surname: string;
                              Dob: string;
                              seatLabel: string;
                              Text: string;
                            },
                            index: number
                          ) => {
                            return (
                              <div className="flex justify-between w-full mb-2" key={index}>
                                <div className="flex items-center gap-2">
                                  <div>
                                    <Image
                                      src={
                                        getImageSrc(
                                          flightScheduleContent,
                                          'passengerblue'
                                        ) as string
                                      }
                                      className="h-4 w-4 rounded-lg"
                                      alt="seatLogo"
                                      width={8}
                                      height={8}
                                    />
                                  </div>
                                  <div className="text-black font-medium text-sm">
                                    {item?.Firstname?.charAt(0)?.toUpperCase() +
                                      item?.Firstname?.slice(1)?.toLowerCase()?.trim() +
                                      ' ' +
                                      item?.Surname?.charAt(0)?.toUpperCase() +
                                      item?.Surname?.slice(1)?.toLowerCase()?.trim() +
                                      ' ' +
                                      (new Date().getFullYear() -
                                        Number(
                                          item?.Dob?.replace('-', '/')?.slice(
                                            item?.Dob?.replace('-', '/')?.length - 4
                                          )
                                        ) <
                                      12
                                        ? '(Child)'
                                        : '')}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div>
                                    <Image
                                      className="xl:w-4 xs:w-4 object-contain "
                                      src={
                                        item?.seatLabel === 'Premium' ||
                                        item?.seatLabel === 'Premium.'
                                          ? getImageSrc(flightScheduleContent, 'greyseat')
                                          : getImageSrc(flightScheduleContent, 'orangeseat')
                                      }
                                      alt="baggageLogo"
                                      height={40}
                                      width={40}
                                    />
                                  </div>

                                  <div className="text-pearlgraya text-sm  font-medium">
                                    {item?.Text}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>
              </div>
            )}
            {/* meal */}
            {meals && (
              <div className='shedule-accordian'>
                <Accordion className="" collapseAll>
                  <Accordion.Panel>
                    <Accordion.Title>
                      <div className="flex align-center mb-2 gap-3">
                        <Image
                          className="h-6 w-6 object-cover"
                          src={getImageSrc(flightScheduleContent, 'luxuryDining') as string}
                          alt="seatLogo"
                          width={8}
                          height={8}
                        />
                        <h4 className="font-black text-sm text-black">Meals</h4>
                      </div>
                    </Accordion.Title>
                    <Accordion.Content>
                      <div className=" gap-3 py-2">
                        {mealDataWithPassengerInfo && mealDataWithPassengerInfo?.length > 0
                          ? mealDataWithPassengerInfo?.map(
                              (
                                item: {
                                  Firstname: string;
                                  Surname: string;
                                  originMeal: string;
                                  returnMeal: string;
                                  originLabel: string;
                                  returnLabel: string;
                                  Dob: string;
                                },
                                dt: number
                              ) => {
                                return (
                                  <div className="flex justify-between w-full" key={dt}>
                                    <div className="flex items-center gap-2">
                                      <div>
                                        <Image
                                          src={
                                            getImageSrc(
                                              flightScheduleContent,
                                              'passengerblue'
                                            ) as string
                                          }
                                          className="h-4 w-4 rounded-lg"
                                          alt="seatLogo"
                                          width={8}
                                          height={8}
                                        />
                                      </div>
                                      <div className="text-black font-medium text-sm">
                                        {item?.Firstname?.charAt(0)?.toUpperCase() +
                                          item?.Firstname?.slice(1)?.toLowerCase()?.trim() +
                                          ' ' +
                                          item?.Surname?.charAt(0)?.toUpperCase() +
                                          item?.Surname?.slice(1)?.toLowerCase()?.trim() +
                                          ' ' +
                                          (new Date().getFullYear() -
                                            Number(item?.Dob?.slice(item?.Dob?.length - 4)) <
                                          12
                                            ? '(Child)'
                                            : '')}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="text-pearlgraya text-sm  font-medium">
                                        {index === 0
                                          ? item?.originMeal === 'Special Meal'
                                            ? item?.originLabel
                                            : item?.originMeal
                                          : item?.returnMeal === 'Special Meal'
                                          ? item?.returnLabel
                                          : item?.returnMeal}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )
                          : 'No meals selected yet'}
                      </div>
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>
              </div>
            )}
            {/* {special && (
              <div className='shedule-accordian'>
                <Accordion className="" collapseAll>
                  <Accordion.Panel>
                    <Accordion.Title>
                      <div className="flex align-center mb-2 gap-3">
                        <Image
                          className="h-6 w-6 object-cover"
                          src={getImageSrc(flightScheduleContent, 'specialservice') as string}
                          alt="seatLogo"
                          width={8}
                          height={8}
                        />
                        <h4 className="font-black text-sm text-black">Special Service</h4>
                      </div>
                    </Accordion.Title>
                    <Accordion.Content>
                      <div className="flex gap-3 py-2 items-center">
                        <div className="flex justify-between w-full" key={index}>
                          <div className="flex items-center gap-2">
                            <div>
                              <Image
                                src={getImageSrc(flightScheduleContent, 'passengerblue') as string}
                                className="h-4 w-4 rounded-lg"
                                alt="seatLogo"
                                width={8}
                                height={8}
                              />
                            </div>
                            <div className="text-black font-medium text-sm">
                              {'andrew'?.charAt(0)?.toUpperCase() +
                                'andrew'?.slice(1)?.toLowerCase()?.trim() +
                                ' ' +
                                'anderson'?.charAt(0)?.toUpperCase() +
                                'anderson'?.slice(1)?.toLowerCase()?.trim() +
                                ' '}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-pearlgraya text-sm  font-medium">Vegan Meal</div>
                          </div>
                        </div>
                      </div>
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>
              </div>
            )} */}
            {/* <div className="flex gap-3 py-2 items-center">
              <Image
                className="h-6 w-6 object-cover"
                src={getImageSrc(flightScheduleContent, 'baggage') as string}
                alt="baggageLogo"
                width={8}
                height={8}
              />
              <div>
                <p className="font-black text-sm text-black">
                  Baggage{' '}
                  {Array.isArray(bagAllowances)
                    ? bagAllowances?.map((dt) =>
                        dt?.TotalWeight
                          ? dt?.TotalWeight + ' ' + dt?.WeightMeasureQualifier?.toLowerCase()
                          : ''
                      )
                    : bagAllowances?.TotalWeight
                    ? bagAllowances?.TotalWeight +
                      ' ' +
                      bagAllowances?.WeightMeasureQualifier?.toLowerCase()
                    : ''}
                </p>
                <p className="font-medium text-xs text-slategray">Maximum bags allowed - 4</p>
              </div>
            </div> */}
            {/* <div className="flex gap-3 py-2 items-center">
              <Image
                className="h-6 w-6 object-cover"
                src={getImageSrc(flightScheduleContent, 'luxuryDining') as string}
                alt="luxuryDiningLogo"
                width={8}
                height={8}
              />
              <p className="font-black text-sm text-black">In-flight luxury dining</p>
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div
          className={`${
            index === 0 ? 'bg-lightorange ' : 'bg-black'
          } h-10 w-12 flex justify-center items-center rounded-full z-40`}
        >
          <Image
            className="h-5 w-5 object-cover"
            src={getImageSrc(flightScheduleContent, 'planeLanding') as string}
            alt="departureLogo"
            width={5}
            height={5}
          />
        </div>
        <div className="w-full">
          <div className="flex justify-between w-full">
            <div className="">
              <p className="font-extrabold text-2xl text-black">{destinationCode}</p>
              <p className="font-normal text-xs text-pearlgray">{destinationAirportName}</p>
              <p className="font-normal text-xs text-pearlgray">
                {' '}
                {DestinationAirportTerminal ? `Terminal : ${DestinationAirportTerminal}` : ''}{' '}
              </p>
            </div>
            <div className="">
              <p className="font-black text-2xl text-black text-end">{arrivalTime}</p>
              <p className="font-normal text-xs text-pearlgray text-end">Local Time</p>
              <p className="font-normal text-xs text-pearlgray text-end">{getDate(arrivalDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Accordion className="theme-accordian" collapseAll>
          <Accordion.Panel>
            <Accordion.Title>
              <div className="flex align-center mb-2">
                <Image
                  className="h-5 w-5 mr-3 object-cover"
                  src={
                    WebClass === 'Delight'
                      ? getImageSrc(flightScheduleContent, 'delight')
                      : WebClass === 'Bliss'
                      ? getImageSrc(flightScheduleContent, 'bliss')
                      : getImageSrc(flightScheduleContent, 'opulance')
                  }
                  alt="webclasslogo"
                  width={5}
                  height={5}
                />
                <h4 className="font-black text-sm text-black">
                  {WebClass ? WebClass : 'Bliss'} Experience
                </h4>
              </div>
              <div>
                <p className="text-pearlgray text-sm">
                  Here’s what you can expect with the {WebClass ? WebClass : 'Bliss'} experience
                </p>
              </div>
            </Accordion.Title>
            <Accordion.Content>
              {luxuryPickup && (
                <div className="flex align-center pt-4 mb-2">
                  <Image
                    className="h-5 w-5 mr-3 object-cover"
                    src={getImageSrc(flightScheduleContent, 'luxuryPickup') as string}
                    alt="departureLogo"
                    width={5}
                    height={5}
                  />
                  <div>
                    <h4 className="text-black text-sm font-black">Luxury Pick-up</h4>
                    <p className="text-slategray text-xs">Service offered at select airports only. Not available in Male.</p>
                  </div>
                </div>
              )}
              {loungeAccess && (
                <div className="flex align-center pt-4 mb-2">
                  <Image
                    className="h-5 w-5 mr-3 object-cover"
                    src={getImageSrc(flightScheduleContent, 'loungeAccess') as string}
                    alt="departureLogo"
                    width={5}
                    height={5}
                  />
                  <div>
                    <h4 className="text-black text-sm font-black">Lounge Access</h4>
                    <p className="text-slategray text-xs"></p>
                  </div>
                </div>
              )}
              <div className="flex align-center mb-2">
                <Image
                  className="h-5 w-5 mr-3 object-cover"
                  src={getImageSrc(flightScheduleContent, 'baggage') as string}
                  alt="departureLogo"
                  width={5}
                  height={5}
                />
                <div>
                  <h4 className="text-black text-sm font-black">
                    Baggage{' '}
                    {Array.isArray(bagAllowances)
                      ? bagAllowances?.map((dt) =>
                          dt?.TotalWeight
                            ? dt?.TotalWeight + ' ' + dt?.WeightMeasureQualifier?.toLowerCase()
                            : ''
                        )
                      : bagAllowances?.TotalWeight
                      ? bagAllowances?.TotalWeight +
                        ' ' +
                        bagAllowances?.WeightMeasureQualifier?.toLowerCase()
                      : ''}
                  </h4>
                  <p className="text-slategray text-xs">Maximum bags allowed - 4</p>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  );
};

export default FlightSchedule;