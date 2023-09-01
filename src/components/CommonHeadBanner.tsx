import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  Text,
  Field,
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';

type CommonHeadBannerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: RichTextField;
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
            <section className="bg-white">
              <div className='container'>
                <div className="m-auto relative xl:pt-40 xl:pb-40 md:pt-40 md:pb-30 xs:pb-20 xs:pt-24 xl:px-0 xs:px-4 md:px-0">
                  <div className=" xs:w-full  xl:flex md:flex  xs:block h-full justify-between  ">
                    <div className="xl:w-2/4 md:w-6/12  xs:w-full">
                      <div className="py-3">
                        <span
                          className="text-hilightgray text-sm font-normal cursor-pointer"
                          onClick={() => router.push('/')}
                        >
                          {props.fields.home.value + ' ' + '/' + ' '}
                        </span>
                        <span
                          className={`${
                            props.fields.subPageName.value.length > 0
                              ? 'text-hilightgray cursor-pointer'
                              : 'text-neviblue font-semibold'
                          } text-sm `}
                          onClick={() => {
                            props.fields.subPageName.value.length > 0 &&
                              props.fields.pageName.value.toLowerCase() === 'destinations' &&
                              router.push('/destination');
                          }}
                        >
                          <Text field={props.fields.pageName} />
                          {props.fields.subPageName.value.length > 0 && ' / '}
                        </span>
                        {props.fields.subPageName.value.length > 0 && (
                          <span className="text-neviblue text-sm font-semibold">
                            <Text field={props.fields.subPageName} />
                          </span>
                        )}
                      </div>
                      <h1 className="maldivtext xs:w-full xs:justify-center  text-black rounded-lg    py-3 font-semibold xl:text-6xl xs:text-3xl">
                        <Text field={props.fields.heading} />
                      </h1>
                      {props.fields.content.value && (
                        <h2 className="xs:w-full  xl:text-xl  rounded-lg  inline-flex items-center  py-3 text-black text-xl font-light">
                          {parse(props.fields.content.value )}
                        </h2>
                      )}
                    </div>
                    <div className="xl:w-2/4 md:w-6/12  xs:w-full ">
                      <div className="flex xl:mt-0 xs:mt-4 gap-2 xl:justify-end xs:justify-center">
                        <div className="xl:mt-24 xs:mt-12 xl:h-56 xl:w-48 xs:w-44 xs:h-36 overflow-hidden rounded-xl">
                          <JssImage
                            field={props.fields.image1}
                            className=" w-full h-full"
                            alt="image"
                          />
                        </div>
                        <div className="xl:h-80 xl:w-60 xs:w-48 xs:h-48 rounded-xl overflow-hidden">
                          <JssImage
                            field={props.fields.image2}
                            className="w-full h-full "
                            alt="image"
                          />
                        </div>
                        <div className="xl:h-40 xl:w-32 xs:w-36 xs:h-32  rounded-xl overflow-hidden">
                          <JssImage
                            field={props.fields.image3}
                            className="w-full h-full "
                            alt="image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-style w-full left-0 right-0 overflow-hidden">
                  <JssImage
                    field={props.fields.banner}
                    className=" xl:w-full z-50 object-cover"
                    alt="banner"
                  />
                </div>
              </div>
            </section>
          ) : (
            <div></div>
          )}
        </>
      )}
    </>
  );
};

export default withDatasourceCheck()<CommonHeadBannerProps>(CommonHeadBanner);