import Image from 'next/image';
import { useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const NoOptionFound = () => {
  const modalContent = useSelector((state: RootState) => state?.sitecore?.searchAirport?.fields);

  return (
    <div>
      <div className="py-10">
        <div className="flex justify-center ">
          <Image
            className="w-20 w-20 object-cover"
            src={getImageSrc(modalContent, 'addingDestinationLogo') as string}
            alt=""
            height={250}
            width={250}
          />
        </div>
        <div className="py-5">
          <h6 className="font-black text-xl text-black text-center">
            {getFieldName(modalContent, 'noCityFound')}
          </h6>
          <p className="font-medium text-base text-pearlgray text-center">
            {getFieldName(modalContent, 'addingDestination')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoOptionFound;

