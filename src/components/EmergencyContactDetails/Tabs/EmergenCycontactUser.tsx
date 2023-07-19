const EmergencyContactUser = () => {
  return (
    <div>
      <div className=" rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className=" bg-white px-3 py-2 rounded-lg mb-2">
          <div className="p-2 ">
            <form>
              <div className="flex items-center mb-4">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 rounded "
                />
                <label htmlFor="default-checkbox" className="font-normal text-base text-black ml-2">
                  I don’t want to provide this information{' '}
                </label>
              </div>
              <div className="grid gap-4 mb-5 grid-cols-1">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">
                    First name
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="bg-white border border-graylight text-black text-sm rounded-md  block w-full p-2.5 dark:text-white "
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-black">Last name</label>
                  <input
                    type="text"
                    id="last name"
                    className="bg-white border border-graylight text-black text-sm rounded-md  block w-full p-2.5 dark:text-white "
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="countries" className="block mb-2 text-sm font-medium text-black">
                    Relationship
                  </label>
                  <select
                    id="countries"
                    className="bg-white border border-graylight text-black text-sm rounded-md  block w-full p-2.5 dark:text-white "
                  >
                    <option selected>Choose a country</option>
                    <option value="US">Husband</option>
                    <option value="CA">Mother</option>
                    <option value="FR">Father</option>
                    <option value="DE">cHILD</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="last name" className="block mb-2 text-sm font-medium text-black">
                    Country Code
                  </label>
                  <input
                    type="tel"
                    id="country code"
                    className="bg-white border border-graylight text-black text-sm rounded-md  block w-full p-2.5 dark:text-white "
                    placeholder="123-45-678"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="date of birth"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Mobile number
                  </label>
                  <input
                    type="url"
                    id="Mobile number"
                    className="bg-white border border-graylight text-black text-sm rounded-md  block w-full p-2.5 dark:text-white "
                    placeholder="flowbite.com"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-black-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="default-checkbox" className="font-normal text-base text-black ml-2">
                  Apply to all passengers{' '}
                </label>
              </div>
              <div className="flex">
                <div className="lg:flex xs:flex mb-3 md:flex block h-full  relative gap-3 xs:w-full m-auto">
                  <button
                    type="button"
                    className="w-full text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center  justify-center"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="w-full text-white bg-aqua  font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center  justify-center"
                  >
                    Next
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="my-5">
          <div className="lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full m-auto opacity-30">
            <button
              type="button"
              className="w-full xs:justify-center  xs:text-center text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactUser;
