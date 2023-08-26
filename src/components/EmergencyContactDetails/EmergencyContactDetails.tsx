import Image from 'next/image';
import { useState } from 'react';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import alertred from '../../assets/images/alertred.png';
import StepsInfo from 'components/SearchFlight/StepsInfo';
import alertblue from '../../assets/images/alertblue.png';
import banner from '../../assets/images/desktopbanner.png';
import EmergencyContactUser from './Tabs/EmergenCycontactUser';

const EmergencyContactDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <main>
      <div className="relative">
        <div className="xl:not-sr-only	xs:sr-only">
          <div className="xl:w-1/4 xs:w-full">
            <div>
              <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                <Image
                  src={banner}
                  className="xs:absolute  inset-0 h-full w-full object-cover"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-cadetgray  xl:rounded-none rounded-lg xs:shadow-2xl xl:shadow-none inherit xs:absolute  xl:top-4  xs:top-0 xs:w-full xs:px-3  xl:w-3/4 xl:py-10 index-style ">
            <div className="xl:not-sr-only	xs:sr-only">
              <div className="xl:w-3/5 xl:m-auto xl:pl-12 xl:mt-12">
                <StepsInfo selected={2} />
              </div>
            </div>
            <div className="xl:w-2/4 xl:m-auto xl:pt-0 xs:pt-20">
              <div>
                <div className="flex justify-between items-center xl:py-0 xs:py-3">
                  <div className="xl:py-3 xs:py-0 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      aria-hidden="true"
                      className="text-black text-sm font-black h-4 w-4"
                    />
                    <span className="px-2 text-black text-sm font-black">Back</span>
                  </div>
                </div>
                <div>
                  <div>
                    <h1 className="text-2xl font-black  text-black">Emergency Contact Details </h1>
                  </div>
                  <div className="py-1">
                    <p className="font-medium text-sm text-pearlgray">
                      Please provide emergency contact details. This can’t be any of the passengers
                      travelling with you.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg ">
                  <div>
                    <div className="my-4">
                      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center gap-2 ">
                        <li role="presentation" onClick={() => setTabIndex(0)}>
                          <button
                            className={`xl:w-full xs:w-full inline-block p-4  ${
                              tabIndex === 0
                                ? ' inline-block py-2 px-3 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                                : 'borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white'
                            } `}
                            type="button"
                            onClick={() => setTabIndex(0)}
                          >
                            <div className="flex gap-2 items-center">
                              {' '}
                              <Image className="h-4 w-4 object-cover" src={alertblue} alt="" />
                              John (You)
                            </div>
                          </button>
                        </li>
                        <li role="presentation" onClick={() => setTabIndex(1)}>
                          <button
                            className={`xl:w-full xs:w-full inline-block p-4  ${
                              tabIndex === 1
                                ? ' inline-block py-2 px-3 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                                : 'borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white'
                            } `}
                            type="button"
                            onClick={() => setTabIndex(1)}
                          >
                            <div className="flex gap-2 items-center">
                              <Image className="h-4 w-4 object-cover" src={alertred} alt="" />
                              Eve
                            </div>
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div>
                      {tabIndex === 0 && (
                        <div>
                          <EmergencyContactUser />
                        </div>
                      )}
                      {tabIndex === 1 && (
                        <div>
                          <EmergencyContactUser />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmergencyContactDetails;
