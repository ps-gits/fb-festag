import Image from 'next/image';
import { AnyAction } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faXmark, faSearch } from '@fortawesome/free-solid-svg-icons';

import {
  getEligibleOriginToDestinations,
  getEligibleDestinationsToOrigin,
} from 'src/redux/action/SearchFlights';
import NoOptionFound from './NoOptionFound';
import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import { getDestinationDetails } from 'src/redux/action/AirportDetails';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const DropdownModal = ({
  name,
  tabName,
  loading,
  textSize,
  closeModal,
  setLoading,
  originCode,
  errorMessage,
  flightDetails,
  selectOptions,
  destinationCode,
  dropdownOptions,
  openSelectModal,
  setErrorMessage,
  setFlightDetails,
  setSelectOptions,
  setOpenSelectModal,
  searchDataWithDelay,
}: dropdownModal) => {
  const dispatch = useDispatch();

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const modalContent = useSelector((state: RootState) => state?.sitecore?.searchAirport?.fields);

  const dropdownChangeEvent = (code: string) => {
    dispatch(
      loader({
        show: true,
        name: 'search',
      })
    );
    if (destinationCode?.length > 0 && destinationCode !== code) {
      setFlightDetails({
        ...flightDetails,
        originCode: code as string,
      });
    } else if (destinationCode?.length > 0 && destinationCode === code) {
      setFlightDetails({
        ...flightDetails,
        originCode: code as string,
        destinationCode: code !== 'MLE' ? 'MLE' : '',
      });
    } else {
      setFlightDetails({
        ...flightDetails,
        originCode: code as string,
        destinationCode: '',
      });
    }
    errorMessage?.departure?.length &&
      setErrorMessage({
        ...errorMessage,
        departure: '',
      });
    setOpenSelectModal(false);
    if (destinationCode !== code && destinationCode?.length > 0) {
      dispatch(
        getEligibleOriginToDestinations(
          {
            OriginCode: code,
            DestinationCode: destinationCode,
          },
          true,
          {
            ...flightDetails,
            originCode: code as string,
          },
          setFlightDetails
        ) as unknown as AnyAction
      );
      name === 'return' &&
        dispatch(
          getEligibleDestinationsToOrigin({
            DestinationCode: code,
            OriginCode: destinationCode,
          }) as unknown as AnyAction
        );
    }
    dispatch(getDestinationDetails(code) as unknown as AnyAction);
  };

  const dropdownEventArrival = (code: string) => {
    setLoading(false);
    setFlightDetails({
      ...flightDetails,
      destinationCode: code,
    });
    (
      errorMessage as {
        departure: string;
        returnDate: string;
        arrival: string;
      }
    )?.arrival?.length &&
      setErrorMessage({
        ...errorMessage,
        arrival: '',
      });
    if (destinationCode?.length === 0) {
      dispatch(
        loader({
          show: true,
          name: 'search',
        })
      );
      dispatch(
        getEligibleOriginToDestinations(
          {
            OriginCode: originCode,
            DestinationCode: code,
          },
          true,
          {
            ...flightDetails,
            destinationCode: code,
          },
          setFlightDetails
        ) as unknown as AnyAction
      );
      tabName === 'return' &&
        dispatch(
          getEligibleDestinationsToOrigin({
            DestinationCode: originCode,
            OriginCode: code,
          }) as unknown as AnyAction
        );
    }
    closeModal && closeModal();
  };

  return (
    <div>
      {name !== 'destination' && (
        <div className="flex justify-between">
          <button
            className={`block text-start dark:focus:ring-blue-800 text-slategray font-normal ${
              textSize ? 'text-sm' : 'text-lg'
            }  w-full`}
            type="button"
            onClick={() => {
              setOpenSelectModal(true);
              setLoading(true);
              setSelectOptions(
                dropdownOptions as {
                  label: string;
                  value: string;
                }[]
              );
              setLoading(false);
            }}
          >
            {originCode?.length
              ? dropdownOptions?.find((item) => item?.code === originCode)?.Label
              : getFieldName(searchFlightContent, 'departFromPlaceholder')}
          </button>
          {textSize === undefined && (
            <div className="absolute right-5 top-8 text-slategray text-sm">
              <FontAwesomeIcon icon={faAngleDown} aria-hidden="true" />
            </div>
          )}
        </div>
      )}
      {(openSelectModal || name === 'destination') && (
        <>
          <div
            style={{ display: 'flex' }}
            className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
          >
            <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 calendar-modal">
                <FontAwesomeIcon
                  icon={faXmark}
                  aria-hidden="true"
                  className="arrow-modal cursor-pointer text-black"
                  onClick={() => {
                    name === 'destination' ? closeModal && closeModal() : setOpenSelectModal(false);
                  }}
                />
                <div className="px-4 pt-5 text-center ">
                  <p className="font-black text-xl text-black">
                    {getFieldName(modalContent, 'heading')}
                  </p>
                  <div className="my-3">
                    <label
                      htmlFor="search"
                      className="text-sm font-medium text-black flex items-start mb-1"
                    >
                      {getFieldName(modalContent, 'searchCity')}
                    </label>
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-2 flex items-center pl-3 pointer-events-none">
                          <FontAwesomeIcon
                            icon={faSearch}
                            aria-hidden="true"
                            className="text-hilightgray text-sm font-black h-5 w-5"
                          />
                        </div>
                        <input
                          type="text"
                          id="search"
                          className="block w-full px-4 py-2  text-basetext border border-slategray rounded focus:border-blue-500  dark:focus:border-blue-500"
                          placeholder={getFieldName(modalContent, 'searchCityPlaceholder')}
                          onChange={(e) => {
                            setLoading(true);
                            setSelectOptions([]);
                            searchDataWithDelay(e?.target?.value);
                          }}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="mt-3 text-left overflow-y-scroll h-64 ">
                      <p className="font-black text-xl text-black">
                        {selectOptions?.length > 0 && getFieldName(modalContent, 'content')}
                      </p>
                      {loading ? (
                        getFieldName(modalContent, 'loading')
                      ) : selectOptions?.length ? (
                        selectOptions
                          ?.filter((item) =>
                            name === 'destination'
                              ? item?.code !== originCode
                              : item?.code !== destinationCode
                          )
                          ?.map((item, index) => {
                            return (
                              <div
                                className="flex justify-between items-center my-3 cursor-pointer"
                                key={index}
                                onClick={() => {
                                  name === 'destination'
                                    ? dropdownEventArrival(item?.code)
                                    : dropdownChangeEvent(item?.code);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div>
                                    <Image
                                      src={getImageSrc(modalContent, 'cityLogo') as string}
                                      className="h-6 w-6 object-cover"
                                      alt=""
                                      height={8}
                                      width={8}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-base text-black">
                                      {item?.Label}
                                    </p>
                                    <p className="font-normal text-xs text-slategray">
                                      {item?.country}
                                    </p>
                                  </div>
                                </div>
                                <div className="bg-black px-2 py-1 rounded w-16 flex justify-center">
                                  <p className="font-black text-sm text-white">{item?.code}</p>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <NoOptionFound />
                      )}
                    </div>
                    <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 sm:w-full py-3 m-auto">
                      <button
                        type="button"
                        className={`w-full text-lg font-black xs:justify-center xs:text-center text-white bg-aqua  rounded-lg text-md inline-flex items-center px-5 py-2 text-center  ${
                          selectOptions?.length > 0 ? 'opacity-40' : ''
                        }`}
                        onClick={() => {
                          if (selectOptions.length === 0) {
                            name === 'destination'
                              ? closeModal && closeModal()
                              : setOpenSelectModal(false);
                          }
                        }}
                      >
                        {selectOptions?.length
                          ? getFieldName(modalContent, 'searchButton')
                          : getFieldName(modalContent, 'closeButton')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownModal;
