import Image from 'next/image';
import { useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const PaymentGatewayLoader = (props: { open: boolean }) => {
  const loaderContent = useSelector((state: RootState) => state?.sitecore?.loader?.fields);

  return (
    <div>
      {props?.open && (
        <main className="mx-0 px-3 bg-black  ">
          <div className="">
            <div className=" flex flex-col justify-center items-center h-screen">
              <Image
                alt=""
                width={800}
                height={80}
                className="h-auto w-10 object-cover"
                src={getImageSrc(loaderContent, 'paymentLoader') as string}
              />
              <div className="mt-10">
                <h1 className="text-2xl font-black text-white text-center">
                  {getFieldName(loaderContent, 'paymentGateway')}
                </h1>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default PaymentGatewayLoader;