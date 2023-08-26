import { useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { getFieldName } from './SitecoreContent';

const StepsInfo = ({ selected }: { selected: number }) => {
  const stepInfoContent = useSelector((state: RootState) => state?.sitecore?.stepInfo?.fields);

  return (
    <div className="mt-4">
      {/* <div className="xl:w-3/5 xl:m-auto xl:pl-12 xl:mt-12"> */}
      <div className="flex gap-10">
        <div className="flex gap-2 text-center  items-center justify-center ">
          <p
            className={`${
              selected === 1 ? 'bg-lightorange ' : 'bg-Silvergray'
            } rounded-full h-4 w-4 text-white flex items-center justify-center text-xs`}
          >
            {getFieldName(stepInfoContent, 'first')}
          </p>
          <p className={`text-sm ${selected === 1 ? 'text-black' : 'text-slategray'}`}>
            {getFieldName(stepInfoContent, 'chooseDate')}
          </p>
        </div>
        <div className="flex gap-2">
          <p
            className={`${
              selected === 2 ? 'bg-lightorange ' : 'bg-Silvergray'
            } rounded-full h-4 w-4 text-white flex items-center justify-center text-xs`}
          >
            {getFieldName(stepInfoContent, 'second')}
          </p>
          <p className={`text-sm ${selected === 2 ? 'text-black' : 'text-slategray'}`}>
            {getFieldName(stepInfoContent, 'pickFlight')}
          </p>
        </div>
        <div className="flex gap-2">
          <p
            className={`${
              selected === 3 ? 'bg-lightorange ' : 'bg-Silvergray'
            } rounded-full h-4 w-4 text-white flex items-center justify-center text-xs`}
          >
            {getFieldName(stepInfoContent, 'third')}
          </p>
          <p className={`text-sm ${selected === 3 ? 'text-black' : 'text-slategray'}`}>
            {getFieldName(stepInfoContent, 'reviewPay')}
          </p>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default StepsInfo;
