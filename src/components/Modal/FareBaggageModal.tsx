import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FareBaggageModal = (props: { showFare: boolean; closeModal: () => void }) => {
  const { showFare, closeModal } = props;

  return (
    <div>
      {showFare && (
        <div>
          <div
            style={{ display: 'flex' }}
            className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
          >
            <div className="relative w-full xs:max-w-2xl max-h-full bg-white m-auto mt-28">
              <div className="relative bg-white rounded-lg shadow    calendar-modal">
                <div className="p-4 text-center">
                  <FontAwesomeIcon
                    icon={faXmark}
                    aria-hidden="true"
                    className="arrow-modal cursor-pointer text-black"
                    onClick={closeModal}
                  />
                  <div className="my-8">
                    <ul>
                      <li>General terms and conditions of sale: Return</li>
                      <ul>
                        <li>Fare basis code: OPULENCE T AE</li>
                      </ul>
                      <ul>
                        <li>Status: HK</li>
                      </ul>
                      <ul>
                        <li>Available seat(s): 3</li>
                      </ul>
                      <ul>
                        <li>One way: allowed</li>
                      </ul>
                      <ul>
                        <li>Open ticket: not allowed</li>
                      </ul>
                      <ul>
                        <li>The duration of the stay must be included between 0 and 180 days</li>
                      </ul>
                      <ul>
                        <li>Ticket: Modifiable with fee</li>
                        <ul>
                          <li>From 30 day(s) until flight: 378.29 AED</li>
                        </ul>
                        <ul>
                          <li>After the flight: 1891.43 AED</li>
                        </ul>
                        <ul>
                          <li>Additional penalty in case of no-show: 1891.43 AED</li>
                        </ul>
                      </ul>
                      <ul>
                        <li>Ticket: Refundable with fee</li>
                        <ul>
                          <li>Until 30 day(s) before the flight: 378.29 AED</li>
                        </ul>
                        <ul>
                          <li>From 30 day(s)* until flight: 945.71 AED</li>
                        </ul>
                        <ul>
                          <li>After the flight: 3782.85 AED</li>
                        </ul>
                        <ul>
                          <li>Additional penalty in case of no-show: 3782.85 AED</li>
                        </ul>
                      </ul>
                      <ul>
                        <li>Bag allowance</li>
                        <ul>
                          <li>AD: 60 Kg</li>
                        </ul>
                      </ul>
                      <ul>
                        <li>
                          days are divided in increments of 24 hours and governed by the flight
                          departure time
                        </li>
                      </ul>
                      <ul>
                        <li>
                          Please note that if you do not show up for your outbound flight, your
                          return flight will be canceled
                        </li>
                      </ul>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FareBaggageModal;

