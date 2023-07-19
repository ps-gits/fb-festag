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
    <div>
      {!load?.show ? (
        <div className="w-full xl:pt-56 xl:pb-52 md:pt-40 md:pb-40 xs:h-auto  relative xl:bg-cadetgray xs:bg-white  xs:pt-40 xs:pb-28">
          <div className="xl:w-5/6 m-auto xs:w-full  xl:flex md:flex  xs:block h-full items-center relative gap-3 ">
            <div className="relative flex xl:w-1/4 xs:w-full xs:m-auto">
              <div className="md:absolute md:-top-16 md:-left-8 xl:absolute xl:-top-20 xl:-left-0">
                <div>
                  <JssImage
                    field={props.fields.image2}
                    className="absolute xl:left-16 xl:-top-14 xl:w-48 md:top-0 xl:h-48 xs:left-44 xs:-top-14 xs:w-28 xs:h-28 object-contain "
                  />
                </div>
                <div className="relative xl:top-0 xl:-left-8 md:top-10 xs:left-28 xs:-top-1">
                  <JssImage
                    field={props.fields.image1}
                    className=" xl:w-48 xl:h-48 xs:w-28 xs:h-28   object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="xl:w-3/5 xs:w-full">
              <h1 className="maldivtext xs:w-full xs:justify-center xs:text-center text-black rounded-lg  inline-flex items-center px-5 xl:py-3 xs:py-0 text-center font-semibold xl:text-6xl xs:text-xl">
                <Text field={props.fields.heading} />
              </h1>
              <h1 className="xs:w-full xs:justify-center xs:text-center rounded-lg  inline-flex items-center px-5 xl:py-3 xs:py-0 text-center xl:text-xl xs:text-sm font-normal text-black">
                <Text field={props.fields.content} />
              </h1>
            </div>
            <div className="relative flex xl:w-1/4   xs:w-full md:m-auto">
              <div className="md:absolute md:-top-16 md:-left-32 xl:absolute xl:-top-20 xl:-left-0">
                <div>
                  <JssImage
                    field={props.fields.image5}
                    className="absolute xl:left-28 md:left-64  xl:-top-20   xl:h-36 xl:w-40 md:-top-4 xs:left-44  xs:top-3  xs:w-20 xs:h-20 object-contain"
                  />
                </div>
                <div>
                  <JssImage
                    field={props.fields.image4}
                    className="absolute xl:-left-0 xl:-top-10 md:left-48 xl:w-48 xl:h-48  xs:left-28 xs:top-8 xs:w-28 xs:h-28   object-contain"
                  />
                </div>
                <div className="relative xl:top-14 xl:left-28 md:left-64 md:top-12 xs:top-20 xs:left-44">
                  <JssImage
                    field={props.fields.image3}
                    className=" xl:w-48 xl:h-48 xs:w-28 xs:h-28   object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default withDatasourceCheck()<HomepageBannerProps>(HomepageBanner);
