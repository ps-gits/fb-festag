import Image from 'next/image';
import { useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const ModifyPassengerSeatFareFamily = (props: {
  adult: number;
  childrens: number;
  fareFamilyName: string;
  seatsModify: () => void;
  mealsModify: () => void;
  passengerModify: () => void;
  seatsLabel?: { Text: string }[];
  mealsLabel?: { originMeal: string; returnMeal: string }[];
}) => {
  const {
    adult,
    childrens,
    seatsLabel,
    mealsLabel,
    mealsModify,
    seatsModify,
    fareFamilyName,
    passengerModify,
  } = props;

  const modifyPassengerSeatFareFamilyContent = useSelector(
    (state: RootState) => state?.sitecore?.reviewTrip?.fields
  );
  const passengerContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerModal?.fields
  );
  const flightAvailabilityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );

  const findFareFamilyInfo = flightAvailabilityContent?.find(
    (item: { name: string }) => item?.name === fareFamilyName?.toLowerCase() + 'Logo'
  )?.jsonValue?.value;

  return (
    <div>
      <div>
        <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
          <div className="flex gap-3">
            <div className="flex justify-center items-center">
              <Image
                className="h-5 w-5 object-containt"
                src={getImageSrc(modifyPassengerSeatFareFamilyContent, 'passengerLogo')}
                alt=""
                height={5}
                width={5}
              />
            </div>
            <div>
              <p className="text-black font-medium text-lg">
                {getFieldName(modifyPassengerSeatFareFamilyContent, 'passengerLabel')}
              </p>
              <p className="text-sm font-medium text-pearlgray">
                {`${adult} ${getFieldName(passengerContent, 'adult')} ${
                  childrens > 0
                    ? ', ' + childrens + ` ${getFieldName(passengerContent, 'children')}`
                    : ''
                }`}
              </p>
            </div>
          </div>
          <div
            className="mt-2 cursor-pointer"
            onClick={() => {
              passengerModify();
            }}
          >
            <p className="font-black text-sm text-aqua">
              {getFieldName(modifyPassengerSeatFareFamilyContent, 'modifyButton')}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
          <div className="flex gap-3">
            <div className="flex justify-center items-center">
              <Image
                className="h-5 w-5 object-containt"
                src={getImageSrc(modifyPassengerSeatFareFamilyContent, 'seatSelectionLogo')}
                alt=""
                height={5}
                width={5}
              />
            </div>
            <div>
              <p className="text-black font-medium text-lg">
                {getFieldName(modifyPassengerSeatFareFamilyContent, 'seatSelectionLabel')}
              </p>
              <p className="text-sm font-medium text-pearlgray">
                {seatsLabel && seatsLabel?.length > 0
                  ? seatsLabel?.map((item, index) =>
                      index === seatsLabel?.length - 1 ? item?.Text : item?.Text + ' , '
                    )
                  : getFieldName(modifyPassengerSeatFareFamilyContent, 'changeSeat')}
              </p>
            </div>
          </div>
          <div className="mt-2 cursor-pointer" onClick={() => seatsModify()}>
            <p className="font-black text-sm text-aqua">
              {getFieldName(modifyPassengerSeatFareFamilyContent, 'modifyButton')}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
          <div className="flex gap-3">
            <div className="flex justify-center items-center">
              <Image
                className="h-5 w-5 object-containt"
                src={findFareFamilyInfo?.src}
                alt="farefamily"
                height={5}
                width={5}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-pearlgray">
                {getFieldName(modifyPassengerSeatFareFamilyContent, 'fareFamily')}
              </p>
              <p className="text-black font-medium text-lg ">
                {fareFamilyName?.charAt(0)?.toUpperCase() + fareFamilyName?.slice(1)?.trim()}
              </p>
            </div>
          </div>
          <div className="mt-2 cursor-pointer">
            <p className="font-black text-sm text-aqua">
              {getFieldName(modifyPassengerSeatFareFamilyContent, 'upgradeButton')}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between  w-full px-2  font-medium text-left text-gray-500 my-3">
          <div className="flex gap-3">
            <div className="flex justify-center items-center">
              <Image
                className="h-5 w-5 object-containt"
                src={getImageSrc(modifyPassengerSeatFareFamilyContent, 'mealLogo')}
                alt=""
                height={5}
                width={5}
              />
            </div>
            <div>
              <p className="text-black font-medium text-lg">
                {getFieldName(modifyPassengerSeatFareFamilyContent, 'meals')}
              </p>
              <p className="text-sm font-medium text-pearlgray">
                {mealsLabel && mealsLabel?.length > 0
                  ? getFieldName(modifyPassengerSeatFareFamilyContent, 'changeMeal')
                  : getFieldName(modifyPassengerSeatFareFamilyContent, 'chooseMeal')}
              </p>
            </div>
          </div>
          <div className="mt-2 cursor-pointer" onClick={() => mealsModify()}>
            <p className="font-black text-sm text-aqua">
              {mealsLabel && mealsLabel?.length > 0
                ? getFieldName(modifyPassengerSeatFareFamilyContent, 'modifyButton')
                : getFieldName(modifyPassengerSeatFareFamilyContent, 'selectButton')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPassengerSeatFareFamily;
