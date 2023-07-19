import Image from 'next/image';
import { useSelector } from 'react-redux';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const CompareFareFamilies = (props: compareFareFamily) => {
  const { id, showModal, setShowModal } = props;

  const flightAvailabilityContent = useSelector(
    (state: RootState) => state?.sitecore?.flightAvailablity?.fields
  );
  const compareFareFamiliesContent = useSelector(
    (state: RootState) => state?.sitecore?.compareFareFamilies?.fields
  );

  return (
    <main className="mx-0 px-3">
      {showModal == true && (
        <div>
          <div>
            <div
              id={id}
              style={{ display: 'flex' }}
              className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
            >
              <div className="relative w-full max-w-md max-h-full bg-white m-auto mt-20 xl:rounded-3xl">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 calendar-modal">
                  <FontAwesomeIcon
                    icon={faXmark}
                    aria-hidden="true"
                    className="arrow-modal cursor-pointer"
                    onClick={() => {
                      setShowModal({
                        depart: false,
                        return: false,
                        passenger: false,
                        compareFareFamily: false,
                      });
                    }}
                  />
                  <div className="px-3 pt-5 text-center">
                    <p className="font-black text-xl text-black">
                      {getFieldName(compareFareFamiliesContent, 'heading')}
                    </p>
                    <div className="my-2">
                      <p className="text-slategray font-normal text-sm">
                        {getFieldName(compareFareFamiliesContent, 'content')}
                      </p>
                    </div>
                    <div className="pt-2">
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg modal-height">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700  dark:text-gray-400">
                            <tr>
                              <th></th>
                              <th
                                scope="col"
                                className="px-2 py-2 font-semibold text-sx text-black items-center text-center"
                              >
                                <div className="flex flex-col  justify-center items-center">
                                  <Image
                                    className="h-5 w-5 object-cover"
                                    src={getImageSrc(flightAvailabilityContent, 'delightLogo')}
                                    alt="delightLogo"
                                    width={5}
                                    height={5}
                                  />
                                  <div className="float-left pt-2">
                                    <p className="font-semibold text-xs hover:text-darkskyblue flex flex-start">
                                      {getFieldName(flightAvailabilityContent, 'delight')}
                                    </p>
                                  </div>
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-2 py-2 font-semibold text-sx text-black items-center text-center bg-gray-50 dark:bg-gray-800"
                              >
                                <div className="flex flex-col  justify-center items-center">
                                  <Image
                                    className="h-5 w-5 object-cover"
                                    src={getImageSrc(flightAvailabilityContent, 'blissLogo')}
                                    alt="blissLogo"
                                    width={5}
                                    height={5}
                                  />
                                  <div className="float-left pt-2">
                                    <p className="font-semibold text-xs hover:text-darkskyblue flex flex-start">
                                      {getFieldName(flightAvailabilityContent, 'bliss')}
                                    </p>
                                  </div>
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-2 py-2 font-semibold text-sx text-black items-center text-center"
                              >
                                <div className="flex flex-col  justify-center items-center">
                                  <Image
                                    className="h-5 w-5 object-cover"
                                    src={getImageSrc(flightAvailabilityContent, 'opulenceLogo')}
                                    alt="opulenceLogo"
                                    width={5}
                                    height={5}
                                  />
                                  <div className="float-left pt-2">
                                    <p className="font-semibold text-xs hover:text-darkskyblue flex flex-start">
                                      {getFieldName(flightAvailabilityContent, 'opulence')}
                                    </p>
                                  </div>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-gray">
                              <th scope="row" className="px-2 py-4 font-medium  text-slategeay">
                                {getFieldName(compareFareFamiliesContent, 'holdBags')}
                              </th>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'bagCount')}
                              </td>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'bagCount')}
                              </td>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'bagCount')}
                              </td>
                            </tr>
                            <tr className="bg-white">
                              <th scope="row" className="px-2 py-4 font-medium  text-slategeay">
                                {getFieldName(compareFareFamiliesContent, 'weightAllowance')}
                              </th>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'weight')}
                              </td>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'weight')}
                              </td>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'weight')}
                              </td>
                            </tr>
                            <tr className="bg-gray">
                              <th scope="row" className="px-2 py-4 font-medium  text-slategeay">
                                {getFieldName(compareFareFamiliesContent, 'cabinBaggage')}
                              </th>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'bagCount')}
                              </td>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'bagCount')}
                              </td>
                              <td className="px-2 py-4 font-semibold text-sx text-black items-center text-center">
                                {getFieldName(compareFareFamiliesContent, 'bagCount')}
                              </td>
                            </tr>
                            <tr className="bg-white  dark:bg-gray-900 ">
                              <th scope="row" className="px-2 py-4 font-medium  text-slategeay ">
                                {getFieldName(compareFareFamiliesContent, 'sportsEquipment')}
                              </th>
                              <td className="px-2 py-4 items-center text-center">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'cancelLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'cancelLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'tickLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr className="bg-gray">
                              <th scope="row" className="px-2 py-4 font-medium  text-slategeay">
                                {getFieldName(compareFareFamiliesContent, 'advancedSeatSelection')}
                              </th>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'cancelLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'tickLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'tickLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr className=" bg-white  ">
                              <th scope="row" className="px-2 py-4 font-medium  text-slategeay">
                                {getFieldName(compareFareFamiliesContent, 'loungeAccess')}
                              </th>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'cancelLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'tickLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'tickLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr className="bg-gray">
                              <th scope="row" className="px-2 py-4 font-medium  text-slategeay">
                                {getFieldName(compareFareFamiliesContent, 'homeCheckin')}
                              </th>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'cancelLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'tickLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex justify-center ">
                                  <Image
                                    className="h-3 w-3 object-cover"
                                    src={getImageSrc(compareFareFamiliesContent, 'tickLogo')}
                                    alt="opulenceLogo"
                                    width={8}
                                    height={8}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr className=" bg-white">
                              <th scope="row" className="px-2 py-4 font-medium  text-slategeay">
                                {getFieldName(compareFareFamiliesContent, 'changesToBooking')}
                              </th>
                              <td className="px-2 py-4 tems-center text-center">
                                <p className="font-black text-xs">
                                  {getFieldName(
                                    compareFareFamiliesContent,
                                    'changesToBookingDelight'
                                  )}
                                </p>

                                <p className="whitespace-nowrap text-black">
                                  {getFieldName(compareFareFamiliesContent, 'perChange')}
                                </p>
                              </td>
                              <td className="px-2 py-4 tems-center text-center">
                                <p className="font-black text-xs">
                                  {getFieldName(
                                    compareFareFamiliesContent,
                                    'changesToBookingBliss'
                                  )}
                                </p>
                                <p className="whitespace-nowrap text-black">
                                  {getFieldName(compareFareFamiliesContent, 'perChange')}
                                </p>
                              </td>
                              <td className="px-2 py-4 tems-center text-center">
                                <p className="font-black text-xs text-green">
                                  {getFieldName(
                                    compareFareFamiliesContent,
                                    'changesToBookingOpulence'
                                  )}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className=" lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  py-3 m-auto">
                        <button
                          type="button"
                          className="w-full xs:justify-center xs:text-center text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                          onClick={() => {
                            setShowModal({
                              depart: false,
                              return: false,
                              passenger: false,
                              compareFareFamily: false,
                            });
                          }}
                        >
                          {getFieldName(compareFareFamiliesContent, 'closeButton')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CompareFareFamilies;
