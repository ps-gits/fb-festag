import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment } from 'react';

const FareBaggageModal = (props: { showFare: boolean; closeModal: () => void }) => {
  const { showFare, closeModal } = props;
  const createBookingInfo = useSelector((state: RootState) => state?.flightDetails?.createBooking);

  return (
    <>
      {showFare && (
        <div>
          <div
            style={{ display: 'flex' }}
            className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
          >
            <div className="relative w-full xs:max-w-2xl max-h-full m-auto mt-28">
              <div className="relative bg-white rounded-lg shadow calendar-modal">
                <div className="p-4 text-center">
                  <FontAwesomeIcon
                    icon={faXmark}
                    aria-hidden="true"
                    className="arrow-modal cursor-pointer text-black"
                    onClick={closeModal}
                  />
                  <div className="mt-8 farelist">
                    {createBookingInfo?.FareRules?.map(
                      (
                        item: {
                          Text: string;
                          Value: string;
                          Children: [{ Text: string; Value: string }];
                        },
                        index: number
                      ) => (
                        <ul key={index}>
                          <li>
                            {item?.Text}: {item?.Value}
                          </li>
                          {item?.Children?.map(
                            (
                              item2: {
                                Text: string;
                                Value: string;
                                Children: [{ Text: string; Value: string }];
                              },
                              index2: number
                            ) => (
                              <Fragment key={index2}>
                                <ul>
                                  <li>
                                    {item2?.Text}:{item?.Value}
                                  </li>
                                  {item2?.Children?.map(
                                    (
                                      item3: {
                                        Text: string;
                                        Value: string;
                                        Children: [{ Text: string; Value: string }];
                                      },
                                      index3: number
                                    ) => (
                                      <Fragment key={index3}>
                                        <ul>
                                          <li>
                                            {item3?.Text} : {item3?.Value}
                                          </li>
                                        </ul>
                                      </Fragment>
                                    )
                                  )}
                                </ul>
                              </Fragment>
                            )
                          )}
                        </ul>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FareBaggageModal;