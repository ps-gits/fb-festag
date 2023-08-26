import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { setPaymentStatusData } from 'src/redux/reducer/FlightDetails';
import { getFieldName } from 'components/SearchFlight/SitecoreContent';

const PaymentCancel = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const paymentContent = useSelector((state: RootState) => state?.sitecore?.payment?.fields);
  const paymentStatus = useSelector((state: RootState) => state?.flightDetails?.paymentStatus);

  useEffect(() => {
    if (router.query.status !== undefined) {
      dispatch(setPaymentStatusData(String(router.query.status)));
      router.replace(router.pathname);
    }
  }, [dispatch, router]);

  const PaymentFailed = ({ code }: { code: number }) => {
    return (
      <Fragment>
        <div className="flex justify-center items-center h-screen">
          <div>
            <div className="text-xl text-lightorange flex justify-center mb-5 ml-5 mr-2">
              {code === 1014 ? (
                <div>{getFieldName(paymentContent, '1014')}</div>
              ) : code === 2002 ? (
                <div>{getFieldName(paymentContent, '2002')}</div>
              ) : code === 2010 ? (
                <div>{getFieldName(paymentContent, '2010')}</div>
              ) : code === 2011 ? (
                <div>{getFieldName(paymentContent, '2011')}</div>
              ) : code === 2016 ? (
                <div>{getFieldName(paymentContent, '2016')}</div>
              ) : code === 2017 ? (
                <div>{getFieldName(paymentContent, '2017')}</div>
              ) : code === 3010 ? (
                <div>{getFieldName(paymentContent, '3010')}</div>
              ) : code === 3011 ? (
                <div>{getFieldName(paymentContent, '3011')}</div>
              ) : code === 3012 ? (
                <div>{getFieldName(paymentContent, '3012')}</div>
              ) : code === 3013 ? (
                <div>{getFieldName(paymentContent, '3013')}</div>
              ) : code === 3014 ? (
                <div>{getFieldName(paymentContent, '3014')}</div>
              ) : code === 3015 ? (
                <div>{getFieldName(paymentContent, '3015')}</div>
              ) : code === 3016 ? (
                <div>{getFieldName(paymentContent, '3016')}</div>
              ) : code === 3100 ? (
                <div>{getFieldName(paymentContent, '3100')}</div>
              ) : code === 3111 ? (
                <div>{getFieldName(paymentContent, '3111')}</div>
              ) : code === 3112 ? (
                <div>{getFieldName(paymentContent, '3112')}</div>
              ) : code === 3113 ? (
                <div>{getFieldName(paymentContent, '3113')}</div>
              ) : code === 3114 ? (
                <div>{getFieldName(paymentContent, '3114')}</div>
              ) : code === 3115 ? (
                <div>{getFieldName(paymentContent, '3115')}</div>
              ) : code === 3116 ? (
                <div>{getFieldName(paymentContent, '3116')}</div>
              ) : code === 5000 ? (
                <div>{getFieldName(paymentContent, '5000')}</div>
              ) : (
                <div>{getFieldName(paymentContent, 'somethingWentWrong')}</div>
              )}
            </div>
            {code !== 1041 && (
              <div className="flex justify-center">
                <button
                  className="xl:w-full xs:justify-center text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black text-lg rounded-lg  inline-flex items-center px-5 py-2 text-center "
                  onClick={() => router.push('/reviewtrip')}
                >
                  {getFieldName(paymentContent, 'payAgainButton')}
                </button>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <div>
      <PaymentFailed code={Number(paymentStatus)} />
    </div>
  );
};

export default PaymentCancel;
