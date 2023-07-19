import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import CancelBookingLoader from '../Loader/CancelBookingLoader';
import { getImageSrc, getFieldName } from 'components/SearchFlight/SitecoreContent';

const CancelSuccess = () => {
  const router = useRouter();

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const cancelSuccessContent = useSelector(
    (state: RootState) => state?.sitecore?.cancelSuccess?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const cancelBookingInfo = useSelector((state: RootState) => state?.flightDetails?.cancelFlight);

  const [copyText, setCopyText] = useState(false);

  return (
    <main className="mx-0 px-3">
      {!load?.show ? (
        <div className="relative">
          <div className="bg-cadetgray  xl:rounded-none rounded-lg  inherit xs:absolute   w-full  xl:w-3/4 index-style ">
            <div className="xl:not-sr-only	xs:sr-only">
              <div className="xl:w-1/4 xs:w-full">
                <div>
                  <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                    <Image
                      src={getImageSrc(searchFlightContent, 'desktopBanner') as string}
                      className="xs:absolute  inset-0 h-full w-full object-cover"
                      alt=""
                      height={200}
                      width={160}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:w-2/4 xl:m-auto xl:py-24 xs:pt-20 ">
              <div>
                <div>
                  <div
                    className="flex justify-between items-center xl:py-0 xs:py-2"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <div className="xl:py-3 xs:py-0 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        aria-hidden="true"
                        className="text-black text-sm font-black h-4 w-4"
                      />
                      <span className="px-2 text-black text-sm font-black">
                        {getFieldName(searchFlightContent, 'backButton')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-black ">
                      {getFieldName(cancelSuccessContent, 'heading')}
                    </h1>
                  </div>
                  <p className="text-base font-medium text-pearlgray my-1">
                    {getFieldName(cancelSuccessContent, 'content')}
                  </p>
                  <div className="py-2 xl:w-7/12 md:w-6/12 xs:w-64 ">
                    <div className="text-aqua text-sm font-normal p-3 border-aqua border-1 bg-tabsky rounded-lg flex gap-2 items-center justify-between ">
                      <div className="text-aqua text-base font-black">
                        {getFieldName(cancelSuccessContent, 'bookingRef')}:
                        {cancelBookingInfo?.PnrInformation?.PnrCode}
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(cancelBookingInfo?.PnrInformation?.PnrCode);
                          setCopyText(true);
                          setTimeout(() => {
                            setCopyText(false);
                          }, 1000);
                        }}
                      >
                        <Image
                          className="h-6 w-6 object-cover"
                          src={getImageSrc(cancelSuccessContent, 'copyLogo')}
                          alt=""
                          height={6}
                          width={6}
                        />
                      </div>
                    </div>
                    {copyText && <div> {getFieldName(cancelSuccessContent, 'copied')}</div>}
                  </div>
                  <div className="bg-white  xl:w-full mt-3 rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg">
                    <Image
                      className="h-full w-full object-containt  rounded-tl-lg rounded-tr-lg"
                      src={getImageSrc(cancelSuccessContent, 'seatsLogo')}
                      alt=""
                      height={200}
                      width={160}
                    />
                    <div className="p-4">
                      <h1 className="text-lg font-black text-black">
                        {getFieldName(cancelSuccessContent, 'flyInLuxuryWithBeond')}
                      </h1>
                      <p className="text-sm text-medium text-slategray">
                        {getFieldName(cancelSuccessContent, 'flyInLuxuryWithBeondContent')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  py-3 m-auto xs:mt-20 xl:mt-0 ">
                  <button
                    type="button"
                    className="w-full xs:justify-center  xs:text-center text-white bg-aqua font-black rounded-lg text-lg inline-flex items-center px-5 py-3 text-center "
                    onClick={() => {
                      router.push('/');
                    }}
                  >
                    {getFieldName(cancelSuccessContent, 'backToHomepageButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CancelBookingLoader open={load?.show} />
      )}
    </main>
  );
};

export default CancelSuccess;
