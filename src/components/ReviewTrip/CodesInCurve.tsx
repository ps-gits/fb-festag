import Image from 'next/image';
import { useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { getImageSrc } from 'components/SearchFlight/SitecoreContent';

const CodesInCurve = (props: codesInCurve) => {
  const { oneway, originCity, originCode, destinationCity, destinationCode } = props;

  const codesInCurveContent = useSelector(
    (state: RootState) => state?.sitecore?.reviewTrip?.fields
  );

  return (
    <div>
      {' '}
      <div className="w-full overflow-hidden relative">
        <Image
          src={getImageSrc(codesInCurveContent, 'curveBanner')}
          className="absolute inset-0  w-full object-containt rounded-tl-2xl rounded-tr-2xl"
          alt=""
          height={100}
          width={1000}
        />
        <div className="relative">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
          <div className="h-full items-center justify-center relative gap-3">
            <div className=" my-2 items-center justify-center relative gap-3 px-6">
              <div className="flex items-center justify-center">
                <div className="mt-6">
                  <Image
                    className="h-10 w-full object-contain"
                    src={getImageSrc(codesInCurveContent, 'curveImage')}
                    alt=""
                    height={10}
                    width={100}
                  />
                </div>
              </div>
              <div className="flex item-center  justify-between items-center mt-5 mb-5 px-6 ">
                <div>
                  <h1 className="text-4xl font-extrabold  text-white ">
                    {originCode ? originCode : ''}
                  </h1>
                  <p className="font-medium text-base text-cadetgray">
                    {originCity ? originCity : ''}
                  </p>
                </div>
                <div className="text-right">
                  <h1 className='text-4xl font-extrabold  text-white "'>
                    {destinationCode ? destinationCode : ''}
                  </h1>
                  <p className="font-medium text-base text-cadetgray">
                    {destinationCity ? destinationCity : ''}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <div className="mb-6">
                    {!oneway && (
                      <Image
                        className="h-10 w-full object-contain"
                        src={getImageSrc(codesInCurveContent, 'curveImage1')}
                        alt=""
                        height={10}
                        width={100}
                      />
                    )}
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

export default CodesInCurve;
