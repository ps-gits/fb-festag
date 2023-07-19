import Image from 'next/image';
import { useState } from 'react';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import banner from '../../assets/images/desktopbanner.png';
import userorange from '../../assets/images/userorange.png';
import ModifyBookingModal from '../Modal/ModifyBookingModal';
import BoardingPassesDetails from './Tabs/BoardingPassesDetails';
import passengerblue from '../../assets/images/passengerblue.png';

const BoardingPasses = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <main>
      <div className="relative">
        <div className="py-3 px-3  xl:bg-cadetgray ">
          <div className="">
            <div className="xl:not-sr-only	xs:sr-only">
              <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
                <Image
                  src={banner}
                  className="xs:absolute  inset-0 h-full w-full object-cover"
                  alt=""
                />
              </div>
              <div className="xl:not-sr-only	xs:sr-only">
                <div className="fixed top-24 right-3.5  xl:m-auto price-modal">
                  <ModifyBookingModal openModal={() => true} />
                </div>
              </div>
            </div>
          </div>
          <div className="xl:w-9/12 ">
            <div>
              <div className="rounded-lg">
                <div className="xl:w-2/4 xl:m-auto">
                  <div className="xl:pt-20 xs:pt-16">
                    <div className="flex justify-between items-center xl:py-0 xs:py-2">
                      <div className="xl:py-3 xs:py-3 cursor-pointer">
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          aria-hidden="true"
                          className="text-black text-sm font-black h-4 w-4"
                        />
                        <span className="px-2 text-black text-sm font-black ">Back</span>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h1 className="text-2xl font-black  text-black">Your Boarding Passes </h1>
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center gap-2 ">
                      <li role="presentation" onClick={() => setTabIndex(0)}>
                        <button
                          className={`xl:w-full xs:w-full inline-block p-4  ${
                            tabIndex === 0
                              ? ' inline-block py-2 px-2 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3 rounded-2xl font-medium bg-white'
                          } `}
                          type="button"
                          onClick={() => setTabIndex(0)}
                        >
                          <div className="flex gap-2 items-center">
                            {' '}
                            <Image className="h-4 w-4 object-cover" src={passengerblue} alt="" />
                            John (You)
                          </div>
                        </button>
                      </li>
                      <li role="presentation" onClick={() => setTabIndex(1)}>
                        <button
                          className={`xl:w-full xs:w-full inline-block p-4  ${
                            tabIndex === 1
                              ? ' inline-block py-2 px-2 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white'
                          } `}
                          type="button"
                          onClick={() => setTabIndex(1)}
                        >
                          <div className="flex gap-2 items-center">
                            <Image className="h-4 w-4 object-cover" src={userorange} alt="" />
                            Eve
                          </div>
                        </button>
                      </li>
                      <li role="presentation" onClick={() => setTabIndex(2)}>
                        <button
                          className={`xl:w-full xs:w-full inline-block p-4  ${
                            tabIndex === 2
                              ? ' inline-block py-2 px-2 bg-lightsky rounded-2xl border-aqua border text-aqua font-black'
                              : 'borbgder-transparent p-4 inline-block py-2 px-3  rounded-2xl font-medium bg-white'
                          } `}
                          type="button"
                          onClick={() => setTabIndex(2)}
                        >
                          <div className="flex gap-2 items-center">
                            <Image className="h-4 w-4 object-cover" src={userorange} alt="" />
                            Richard
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    {tabIndex === 0 && (
                      <div>
                        <BoardingPassesDetails />
                      </div>
                    )}
                    {tabIndex === 1 && (
                      <div>
                        <BoardingPassesDetails />
                      </div>
                    )}
                    {tabIndex === 2 && (
                      <div>
                        <BoardingPassesDetails />
                      </div>
                    )}
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

export default BoardingPasses;
