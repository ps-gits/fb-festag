import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  Text,
  Field,
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';

type CommonHeadBannerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: Field<string>;
    home: Field<string>;
    pageName: Field<string>;
    subPageName: Field<string>;
    banner: ImageField;
    image1: ImageField;
    image2: ImageField;
    image3: ImageField;
  };
};

const CommonHeadBanner = (props: CommonHeadBannerProps): JSX.Element => {
  const router = useRouter();

  const load = useSelector((state: RootState) => state?.loader?.loader);
  const footerData = useSelector((state: RootState) => state.sitecore.footer);
  const readNewsInDetails = useSelector((state: RootState) => state?.sitecore?.readNewsInDetails);

  return (
    <>
      {!(
        router.asPath === '/' + footerData?.latestNews?.value?.toLowerCase()?.replace(/\s/g, '') &&
        readNewsInDetails !== undefined &&
        readNewsInDetails
      ) && (
        <>
          {!load?.show ? (
            <div className="bg-white">
              <div>
                <div className="xl:w-5/6 m-auto md:w-5/6 relative xl:pt-40 xl:pb-40 md:pt-40 md:pb-30 xs:pb-20 xs:pt-24 xl:px-0 xs:px-4 md:px-0">
                  <div className=" xs:w-full  xl:flex md:flex  xs:block h-full justify-between  ">
                    <div className="xl:w-2/4 md:w-6/12  xs:w-full">
                      <div className="py-3">
                        <span className="text-hilightgray text-sm font-normal">
                          <Text field={props.fields.home} />/
                        </span>
                        <span
                          className={`${
                            props.fields.subPageName.value.length > 0
                              ? 'text-hilightgray'
                              : 'text-neviblue font-black'
                          } text-sm `}
                        >
                          <Text field={props.fields.pageName} />
                          {props.fields.subPageName.value.length > 0 && '/'}
                        </span>
                        {props.fields.subPageName.value.length > 0 && (
                          <span className="text-neviblue text-sm font-black">
                            <Text field={props.fields.subPageName} />
                          </span>
                        )}
                      </div>
                      <h1 className="maldivtext xs:w-full xs:justify-center  text-black rounded-lg    py-3 font-semibold xl:text-6xl xs:text-3xl">
                        <Text field={props.fields.heading} />
                      </h1>
                      <h1 className="xs:w-full  xl:text-xl  rounded-lg  inline-flex items-center  py-3 font-normal text-black">
                        <Text field={props.fields.content} />
                      </h1>
                    </div>
                    <div className="xl:w-2/4 md:w-6/12  xs:w-full ">
                      <div className="flex xl:mt-0 xs:mt-4 gap-2 xs:justify-end">
                        <div className="xl:mt-36 xs:mt-10">
                          <JssImage
                            field={props.fields.image1}
                            className=" xl:h-44 xl:w-32 xs:w-44 xs:h-36  rounded-xl"
                            alt="image"
                          />
                        </div>
                        <div>
                          <JssImage
                            field={props.fields.image2}
                            className=" xl:h-80 xl:w-60 xs:w-44 xs:h-44 rounded-xl"
                            alt="image"
                          />
                        </div>
                        <div>
                          <JssImage
                            field={props.fields.image3}
                            className=" xl:h-44 xl:w-28 xs:w-44 xs:h-32  rounded-xl"
                            alt="image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-style w-full">
                  <JssImage
                    field={props.fields.banner}
                    className=" xl:w-full z-50 object-cover"
                    alt="banner"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}
    </>
  );
};

export default withDatasourceCheck()<CommonHeadBannerProps>(CommonHeadBanner);
