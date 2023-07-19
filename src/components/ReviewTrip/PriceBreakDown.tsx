import { useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';

const PriceBreakDown = (props: {
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  passengerCount: number;
  fareFamilyName: string;
}) => {
  const { currency, baseAmount, taxAmount, totalAmount, passengerCount, fareFamilyName } = props;

  const priceBreakDownContent = useSelector(
    (state: RootState) => state?.sitecore?.reviewTrip?.fields
  );

  return (
    <div>
      <div className="bg-purpal p-4 rounded-bl-2xl rounded-br-2xl">
        <h1 className="font-black text-base black text-black">
          {getFieldName(priceBreakDownContent, 'priceBreakdown')}
        </h1>
        <div className="flex justify-between py-1">
          <p className="font-medium text-xs text-pearlgray">
            {fareFamilyName} {getFieldName(priceBreakDownContent, 'ticket')} x{passengerCount}
          </p>
          <p className="font-medium text-xs text-pearlgray">
            {(currency ? currency : '') + ' ' + (baseAmount ? baseAmount : '')}
          </p>
        </div>
        <div className="flex justify-between py-1">
          <p className="font-medium text-xs text-pearlgray">
            {getFieldName(priceBreakDownContent, 'seatUpgrade')} x{passengerCount}
          </p>
          <p className="font-medium text-xs text-pearlgray">0</p>
        </div>
        <div className="flex justify-between py-1">
          <p className="font-medium text-xs text-pearlgray">
            {getFieldName(priceBreakDownContent, 'taxesCharges')}
          </p>
          <p className="font-medium text-xs text-pearlgray">
            {(currency ? currency : '') + ' ' + (taxAmount ? taxAmount : '')}
          </p>
        </div>
        <div className="flex justify-between py-1">
          <p className="font-black text-sm text-black">
            {getFieldName(priceBreakDownContent, 'totalPrice')}
          </p>
          <p className="font-black text-sm text-black">
            {(currency ? currency : '') + ' ' + (totalAmount ? totalAmount : '')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakDown;
