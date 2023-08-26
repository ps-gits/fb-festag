import { useEffect } from 'react';
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

type HomepageBannerProps = ComponentProps & {
  fields: {
    image1: ImageField;
    image2: ImageField;
    image3: ImageField;
    image4: ImageField;
    image5: ImageField;
    heading: Field<string>;
    content: Field<string>;
  };
};

const HomepageBanner = (props: HomepageBannerProps): JSX.Element => {
  const load = useSelector((state: RootState) => state?.loader?.loader);

  useEffect(() => {
    const element = document.getElementById('landing-page-search');
    if (!load?.show && element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [load?.show]);

  return (
    <>
      {!load?.show ? (
        <div className="w-full xl:pt-56 xl:pb-56 md:pt-48 md:pb-40 xs:h-auto relative xl:bg-cadetgray xs:bg-cadetgray pt-24 pb-8">
          <div className="container">
            <div className="xl:flex md:flex xs:block h-full items-center relative gap-3 ">
              <div className="relative flex xl:w-1/4 xs:w-full xs:m-auto">
                <div className="relative my-14 md:my-0 w-56 mx-auto md:mx-0 md:w-full ms:h-full">
                  <div className="relative -top-8 w-32 h-40 lg:w-48 lg:h-64 lg:left-1/3 left-1/4 rounded-3xl overflow-hidden">
                    <JssImage
                      field={props.fields.image2}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute -bottom-10 w-32 h-40 lg:w-48 lg:h-64 lg:left-0 left-0 mr-auto rounded-3xl overflow-hidden border-8 border-cadetgray">
                    <JssImage
                      field={props.fields.image1}
                    />
                  </div>
                </div>
              </div>
              <div className="xl:w-1/2 xs:w-full">
                <h1 className="maldivtext xs:w-full mb-6 xs:justify-center xs:text-center text-black rounded-lg inline-flex items-center text-center font-semibold xl:text-5xl xs:text-xl">
                  <Text field={props.fields.heading} />
                </h1>
                <p className="xs:w-full xs:justify-center xs:text-center rounded-lg inline-flex items-center text-center xl:text-xl xs:text-sm text-black">
                  <Text field={props.fields.content} />
                </p>
              </div>
              <div className="relative flex xl:w-1/4   xs:w-full md:m-auto">
                <div className="relative my-14 md:my-0 w-56 mx-auto md:mx-0 md:w-full ms:h-full">
                  <div className='absolute right-10 lg:right-8 -top-10 lg:-top-20 lg:h-44 lg:w-32 w-24 h-32 rounded-xl overflow-hidden'>
                    <JssImage
                      field={props.fields.image5}
                      className="w-full h-full"
                    />
                  </div>
                  <div className='absolute bottom-5 lg:bottom-10 right-20 lg:right-32 w-32 h-40 lg:w-48 lg:h-64 rounded-3xl overflow-hidden border-8 border-cadetgray'>
                    <JssImage
                      field={props.fields.image4}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="relative right-0 -bottom-10 lg:-bottom-14 ml-auto w-32 h-40 lg:w-48 lg:h-64 rounded-3xl overflow-hidden border-8 border-cadetgray">
                    <JssImage
                      field={props.fields.image3}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default withDatasourceCheck()<HomepageBannerProps>(HomepageBanner);
