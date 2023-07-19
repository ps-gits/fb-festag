import Image from 'next/image';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';
import { setAcceptTermsConditions, setFooterTC } from 'src/redux/reducer/FlightDetails';

const TermsConditions = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const termsConditionsContent = useSelector(
    (state: RootState) => state?.sitecore?.termsConditions?.fields
  );
  const termsConditionsAccepted = useSelector(
    (state: RootState) => state?.flightDetails?.acceptTermsConditions
  );
  const footerTermsConditions = useSelector((state: RootState) => state?.flightDetails?.footerTC);

  return (
    <main>
      <div className="relative">
        <div className="px-3  bg-cadetgray  xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute   w-full  xl:w-3/4  index-style ">
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
          <div className="xl:w-2/4 xl:m-auto xl:py-24 xs:py-20">
            <div>
              <div className="flex justify-between items-center  xl:py-0 xs:py-2">
                <div
                  className="xl:py-3 px:py-0 cursor-pointer"
                  onClick={() => {
                    router.back();
                    if (footerTermsConditions !== undefined && footerTermsConditions) {
                      setTimeout(() => {
                        dispatch(setFooterTC(false));
                      }, 1000);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    aria-hidden="true"
                    className="text-black text-sm font-black h-4 w-4"
                  />
                  <span className="px-2 text-black text-sm font-black">
                    {getFieldName(termsConditionsContent, 'backButton')}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <div>
                  <h1 className="text-2xl font-black  text-black">
                    {getFieldName(termsConditionsContent, 'heading')}
                  </h1>
                </div>
                <div className="py-1">
                  <p className="font-medium text-sm text-pearlgray">
                    {getFieldName(termsConditionsContent, 'subHeading')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg my-4">
              <div style={{ color: '#4B4E56', fontSize: '12px' }}>
                {parse(getFieldName(termsConditionsContent, 'content'))}
              </div>
            </div>
            {footerTermsConditions !== undefined && !footerTermsConditions && (
              <div>
                <div className="flex items-center mb-4">
                  <input
                    id={getFieldName(termsConditionsContent, 'checkBox1')}
                    type="checkbox"
                    checked={termsConditionsAccepted}
                    className="accent-orange-600	 text-white w-4 h-4 opacity-70"
                    onChange={(e) => {
                      dispatch(setAcceptTermsConditions(e?.target?.checked));
                    }}
                  />
                  <label
                    className="ml-2 text-sm font-medium text-black"
                    htmlFor={getFieldName(termsConditionsContent, 'checkBox1')}
                  >
                    {getFieldName(termsConditionsContent, 'checkBox1')}
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id={getFieldName(termsConditionsContent, 'checkBox2')}
                    type="checkbox"
                    checked={termsConditionsAccepted}
                    className="accent-orange-600	 text-white w-4 h-4 opacity-70"
                    onChange={(e) => {
                      dispatch(setAcceptTermsConditions(e?.target?.checked));
                    }}
                  />
                  <label
                    className="ml-2 text-sm font-medium text-black"
                    htmlFor={getFieldName(termsConditionsContent, 'checkBox2')}
                  >
                    {getFieldName(termsConditionsContent, 'checkBox2')}
                  </label>
                </div>
              </div>
            )}
            <div>
              <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3  py-3 m-auto ">
                <button
                  type="button"
                  className={`w-full xs:justify-center  xs:text-center text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center ${
                    footerTermsConditions !== undefined && footerTermsConditions
                      ? ''
                      : !termsConditionsAccepted
                      ? ' opacity-40 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={
                    footerTermsConditions !== undefined && footerTermsConditions
                      ? false
                      : !termsConditionsAccepted
                  }
                  onClick={() => {
                    router.back();
                    if (footerTermsConditions !== undefined && footerTermsConditions) {
                      setTimeout(() => {
                        dispatch(setFooterTC(false));
                      }, 1000);
                    }
                  }}
                >
                  {getFieldName(termsConditionsContent, 'acceptButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsConditions;
