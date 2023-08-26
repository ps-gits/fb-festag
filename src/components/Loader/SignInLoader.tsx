import Image from 'next/image';
import Lottie from 'react-lottie';
import { useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import * as animationData from './plane-window .json';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const SignInLoader = (props: { open: boolean }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const loaderContent = useSelector((state: RootState) => state?.sitecore?.loader?.fields);

  return (
    <div>
      {props?.open && (
        <main className="mx-0 px-0 bg-black  ">
          <div className="">
            <div className=" flex flex-col justify-center items-center align-center h-screen">
              <Lottie
                options={defaultOptions}
                height={200}
                width={200}
                isStopped={props?.open}
                isPaused={props?.open}
              />
              <div className="mt-10">
                <h1 className="text-xl font-black text-white text-center">
                  {getFieldName(loaderContent, 'signIn')}
                </h1>
              </div>
            </div>
          </div>
          <div className="xs:not-sr-only	xl:sr-only	">
            <div className="relative">
              <div className="w-full h-44 overflow-hidden absolute bottom-0">
                <Image
                  alt=""
                  width={800}
                  height={800}
                  src={getImageSrc(loaderContent, 'banner') as string}
                  className="absolute inset-0 h-full w-full object-contant"
                />
              </div>
            </div>
          </div>
          <div className="xl:not-sr-only	xs:sr-only	">
            <div className="relative">
              <div className="w-full h-44 overflow-hidden absolute bottom-0">
                <Image
                  src={getImageSrc(loaderContent, 'desktopLoader') as string}
                  className="absolute inset-0 h-full w-full object-contant"
                  alt=""
                  width={800}
                  height={800}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default SignInLoader;

