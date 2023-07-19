import moment from 'moment';
import { useState } from 'react';
import enGb from 'date-fns/locale/en-GB';
import { useSelector } from 'react-redux';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import { RootState } from 'src/redux/store';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';

registerLocale('en-gb', enGb);

const DateOfBirthModal = (props: DateOfBirthModal) => {
  const { id, name, index, showModal, closeModal, selectedDate, setFieldValue } = props;

  const dateOfBirthModalContent = useSelector(
    (state: RootState) => state?.sitecore?.passengerDetails?.fields
  );

  const [dateSelected, setDateSelected] = useState<string>();

  return (
    <div>
      {showModal && (
        <div
          id={id}
          style={{ display: 'flex' }}
          className="linear h-screen fixed top-0 left-0 right-0 z-50 hidden xl:p-4 sm:p-0 overflow-x-hidden overflow-y-auto md:inset-0 xl:h-[calc(100% 1rem)] max-h-full xl:flex justify-center items-center flex h-screen"
        >
          <div className="relative w-full max-w-md max-h-full rounded-lg bg-white m-auto ">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 calendar-modal ">
              <div className="p-6 text-center calendarstyle ">
                <FontAwesomeIcon
                  icon={faXmark}
                  aria-hidden="true"
                  className="arrow-modal cursor-pointer text-black"
                  onClick={() => {
                    setDateSelected('');
                    closeModal();
                  }}
                />
                <h3 className="mb-0 text-xl text-black font-black">
                  {getFieldName(dateOfBirthModalContent, 'selectDateOfBirth')}
                </h3>
                <div>
                  <ReactDatePicker
                    inline
                    selectsRange
                    peekNextMonth
                    locale="en-gb"
                    showYearDropdown
                    showMonthDropdown
                    maxDate={
                      name === 'Adult'
                        ? new Date(moment(new Date()).subtract(12, 'year').format('YYYY-MM-DD'))
                        : new Date()
                    }
                    dropdownMode="select"
                    scrollableYearDropdown
                    onChange={(date) => {
                      setDateSelected(String(date[0]?.toJSON()));
                    }}
                    selected={selectedDate?.length ? new Date(selectedDate) : null}
                  />
                </div>
                <div className="xl:w-auto px-3">
                  <button
                    onClick={() => {
                      dateSelected &&
                        dateSelected?.length > 0 &&
                        setFieldValue(`details[${index}].Dob`, String(dateSelected));
                      props.closeModal();
                    }}
                    type="button"
                    className="w-full xs:w-full xs:justify-center  text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black text-lg rounded-lg  inline-flex items-center px-5 py-2 text-center "
                  >
                    {getFieldName(dateOfBirthModalContent, 'chooseDate')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateOfBirthModal;
