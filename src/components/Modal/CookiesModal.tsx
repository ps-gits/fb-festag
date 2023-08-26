import axios from 'axios';
import { AnyAction } from 'redux';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faXmark } from '@fortawesome/free-solid-svg-icons';

import { RootState } from 'src/redux/store';
import { getSitecoreData } from 'src/redux/action/Sitecore';
import { setCookiesList } from 'src/redux/reducer/Sitecore';
import { graphQLToken, graphQLUrl } from 'components/Api/ApiUrl';
import { setCookiesSettings } from 'src/redux/reducer/FlightDetails';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';

const CookiesModal = (props: { showModal: boolean; closeModal: () => void }) => {
  const { showModal, closeModal } = props;

  const dispatch = useDispatch();

  const savedCookiesSettings = useSelector(
    (state: RootState) => state?.flightDetails?.cookiesSettings
  );
  const cookiesList = useSelector((state: RootState) => state?.sitecore?.cookiesList);
  const cookiesContent = useSelector((state: RootState) => state?.sitecore?.cookies?.fields);

  const [openModal, setOpenModal] = useState(false);
  const [showMore, setShowMore] = useState<{ index: number; title: string }[]>([]);
  const [checkedCookies, setCheckedCookies] = useState<{ checked: boolean; index: number }[]>(
    savedCookiesSettings && savedCookiesSettings?.length > 0 ? savedCookiesSettings : []
  );

  useEffect(() => {
    if (
      cookiesList === undefined ||
      cookiesList?.length !== getFieldName(cookiesContent, 'cookieList')?.split('|')?.length
    ) {
      getCookiesList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookiesContent, cookiesList]);

  useEffect(() => {
    cookiesContent === undefined && dispatch(getSitecoreData('Cookies') as unknown as AnyAction);
  }, [dispatch, cookiesContent]);

  useEffect(() => {
    setCheckedCookies(savedCookiesSettings);
  }, [savedCookiesSettings]);

  const getCookiesList = async () => {
    const cookiesIds = getFieldName(cookiesContent, 'cookieList')?.split('|');

    const cookieListData: {
      name: string;
      fields: { id: string; name: string; value: string }[];
    }[] = [];
    cookiesIds?.map(async (item) => {
      const response = await axios.post(
        `${graphQLUrl}`,
        {
          query: `{item(path: "${item}",language: "EN") {name\nfields{id\nname\nvalue\n}\n}\n}`,
        },
        {
          headers: {
            'x-gql-token': graphQLToken,
          },
        }
      );
      cookieListData.push(response?.data?.data?.item);
      if (cookieListData?.length === cookiesIds?.length) {
        const finalList = cookieListData?.map((item) => {
          return item?.fields.reduce(
            (obj, item) => Object.assign(obj, { [item.name]: item.value }),
            {}
          );
        });
        dispatch(setCookiesList(finalList));
      }
    });
  };

  const cookiesChecked = (index: number) => {
    const findData = checkedCookies?.find((item) => item?.index === index);
    return findData !== undefined ? findData?.checked : false;
  };

  return (
    <>
      {showModal && (
        <div
          className={` ${
            openModal
              ? 'linear h-screen fixed top-0 left-0 right-0 z-50  xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen '
              : 'fixed bottom-5 xl:-top-9 xl:left-0 xl:right-0 z-50  xl:p-4 sm:p-0 overflow-x-hidden overflow-hiddenmd:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex xl:justify-end xs:justify-center items-end flex h-screen'
          } `}
          id="cookies-modal"
        >
          <div
            className={`${
              openModal
                ? 'bg-white xl:w-1/2 xl:m-auto rounded-md p-4 xs:mx-3'
                : 'bg-white  xl:p-5 rounded-md p-4 small-modal'
            }`}
          >
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-black text-pearlgray ">
                    {getFieldName(cookiesContent, 'heading')}
                  </p>
                </div>
                <div
                  onClick={() => {
                    closeModal();
                    setOpenModal(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    aria-hidden="true"
                    className="text-sm text-black close-icon cursor-pointer"
                  />
                </div>
              </div>
              <p className="font-normal text-xs text-pearlgray leading-normal py-1">
                {getFieldName(cookiesContent, 'subHeading')}
                <span className="text-aqua">
                  {' '}
                  {getFieldName(cookiesContent, 'viewCookiePolicy')}
                </span>
              </p>
            </div>
            {openModal && (
              <div>
                {cookiesList?.map((item: cookiesList, index: number) => (
                  <div key={index}>
                    <div className="py-2">
                      <p className="text-xl font-black text-black ">{item?.title}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-normal text-xs text-pearlgray  leading-normal">
                            {item?.description}
                          </p>
                        </div>
                        <div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cookiesChecked(index)}
                              className="sr-only peer"
                              onChange={(e) => {
                                checkedCookies?.find((dt) => dt?.index === index)
                                  ? setCheckedCookies(
                                      checkedCookies?.map((dt) => {
                                        if (dt?.index === index) {
                                          return {
                                            index: index,
                                            checked: e?.target?.checked,
                                          };
                                        } else {
                                          return dt;
                                        }
                                      })
                                    )
                                  : setCheckedCookies((prev) => [
                                      ...prev,
                                      {
                                        index: index,
                                        checked: e?.target?.checked,
                                      },
                                    ]);
                              }}
                            />
                            <div className="w-11 h-6 bg-graylight rounded-full  dark:bg-red peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-white peer-checked:bg-green"></div>
                          </label>
                        </div>
                      </div>
                      <div className=" w-full">
                        <div className="">
                          {showMore?.find((dt) => dt?.index === index) === undefined && (
                            <div className="flex text-aqua font-normal text-xs">
                              <div
                                className="flex items-center justify-center gap-2  cursor-pointer"
                                onClick={() => {
                                  const findData = showMore?.find((dt) => dt?.index === index);
                                  findData === undefined &&
                                    setShowMore((prev) => [
                                      ...prev,
                                      {
                                        index: index,
                                        title: item?.title,
                                      },
                                    ]);
                                }}
                              >
                                <p className="text-aqua font-black text-xs">
                                  {getFieldName(cookiesContent, 'showMoreButton')}
                                </p>
                                <span>
                                  <FontAwesomeIcon
                                    icon={faAngleDown}
                                    aria-hidden="true"
                                    className="text-sm text-aqua close-icon mt-1"
                                  />
                                </span>
                              </div>
                            </div>
                          )}
                          {showMore?.find((dt) => dt?.index === index) !== undefined && (
                            <>
                              <div className="py-2">
                                <p className="font-normal text-xs text-pearlgray  leading-normal">
                                  {item?.detailedDescription}
                                </p>
                              </div>
                              <div
                                className="flex items-center justify-start gap-2  cursor-pointer"
                                onClick={() => {
                                  setShowMore(
                                    showMore?.filter(
                                      (dt) => dt !== showMore?.find((dt) => dt?.index === index)
                                    )
                                  );
                                }}
                              >
                                <p className="text-aqua font-black text-xs">
                                  {getFieldName(cookiesContent, 'showLessButton')}
                                </p>
                                <span>
                                  <FontAwesomeIcon
                                    icon={faAngleUp}
                                    aria-hidden="true"
                                    className="text-sm text-aqua close-icon mt-1"
                                  />
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="w-full xs:justify-center text-white bg-aqua font-black rounded-lg text-sm  items-center px-3 py-0 text-center "
                onClick={() => {
                  openModal
                    ? dispatch(setCookiesSettings(checkedCookies))
                    : dispatch(
                        setCookiesSettings(
                          cookiesList?.map((_item: cookiesList, index: number) => {
                            return {
                              checked: true,
                              index: index,
                            };
                          })
                        )
                      );
                  closeModal();
                  setOpenModal(false);
                }}
              >
                {openModal
                  ? getFieldName(cookiesContent, 'saveSettingsButton')
                  : getFieldName(cookiesContent, 'acceptAllButton')}
              </button>
              <button
                type="submit"
                className="w-full xs:justify-center  text-aqua font-black rounded-lg text-sm  items-center px-5 py-2 text-center ${
                cursor-pointer border"
                onClick={() => {
                  openModal
                    ? (dispatch(setCookiesSettings([])), setOpenModal(false), closeModal())
                    : setOpenModal(true);
                }}
              >
                {openModal
                  ? getFieldName(cookiesContent, 'clearSettingsButton')
                  : getFieldName(cookiesContent, 'changeSettings')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookiesModal;
