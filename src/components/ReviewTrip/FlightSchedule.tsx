import Image from 'next/image';
import { useSelector } from 'react-redux';

import { getDate } from './GetDate';
import { RootState } from 'src/redux/store';
import { getImageSrc } from 'components/SearchFlight/SitecoreContent';

const FlightSchedule = (props: flightSchedule) => {
  const {
    index,
    seats,
    Stops,
    Remarks,
    originCode,
    arrivalDate,
    arrivalTime,
    FlightNumber,
    loungeAccess,
    luxuryPickup,
    bagAllowances,
    departureDate,
    departureTime,
    destinationCode,
    originAirportName,
    destinationAirportName,
    seatsOriginToDestination,
    seatsDestinationToOrigin,
  } = props;

  const flightScheduleContent = useSelector(
    (state: RootState) => state?.sitecore?.commonImages?.fields
  );

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
          <div className="absolute w-11 left-0 top-1/2 flex flex-col items-center">
            <div
              key={index}
              className="bg-white text-center flex flex-col group items-center relative group"
            >
              <span className="cursor-pointer group color-black">
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
                    // wordBreak: 'break-all',
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
                {FlightNumber ? `Flight Number : ${FlightNumber}` : ''}{' '}
              </p>
            </div>
            <div className="">
              <p className="font-black text-2xl text-black text-end">{departureTime}</p>
              <p className="font-normal text-xs text-pearlgray text-end">
                {getDate(departureDate)}
              </p>
            </div>
          </div>
          <div className=" p-3 my-2 xl:w-full rounded-lg border border-cadetgray ">
            {luxuryPickup && (
              <div className="flex gap-3 items-center my-1">
                <Image
                  className="h-6 w-6 object-cover"
                  src={getImageSrc(flightScheduleContent, 'luxuryPickup') as string}
                  alt="luxuryPickupLogo"
                  width={8}
                  height={8}
                />
                <div>
                  <p className="font-black text-sm text-black">Luxury Pick-up</p>
                  <p className="font-medium text-xs text-slategray">Service offered at select airports only. Not available in Male.</p>
                </div>
              </div>
            )}
            {loungeAccess && (
              <div className="flex gap-3 py-2">
                <Image
                  className="h-6 w-6 object-cover"
                  src={getImageSrc(flightScheduleContent, 'loungeAccess') as string}
                  alt="loungeAccessLogo"
                  width={8}
                  height={8}
                />
                <p className="font-black text-sm text-black">Lounge Access</p>
              </div>
            )}
            {seats && (
              <div className="flex gap-3 py-2">
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
                        : ''
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
            )}
            <div className="flex gap-3 py-2">
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
            </div>
            {/* <div className="flex gap-3 py-2">
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
                {FlightNumber ? `Flight Number : ${FlightNumber}` : ''}{' '}
              </p>
            </div>
            <div className="">
              <p className="font-black text-2xl text-black text-end">{arrivalTime}</p>
              <p className="font-normal text-xs text-pearlgray text-end">{getDate(arrivalDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSchedule;