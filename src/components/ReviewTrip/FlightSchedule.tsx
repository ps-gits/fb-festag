import Image from 'next/image';
import { useSelector } from 'react-redux';

import { getDate } from './GetDate';
import { RootState } from 'src/redux/store';
import { getImageSrc } from 'components/SearchFlight/SitecoreContent';

const FlightSchedule = (props: flightSchedule) => {
  const {
    index,
    seats,
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
    <div>
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
                <p className="font-black text-sm text-black">Luxury Pick-up</p>
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
