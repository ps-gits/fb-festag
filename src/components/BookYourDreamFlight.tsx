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

type BookYourDreamFlightProps = ComponentProps & {
  fields: {
    image1: ImageField;
    heading: Field<string>;
    content: Field<string>;
    searchFlightsButton: Field<string>;
  };
};

const BookYourDreamFlight = (props: BookYourDreamFlightProps): JSX.Element => {
  const router = useRouter();

  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <div>
      {!load?.show ? (
        <div className="w-full  bg-white">
          <div className="xl:w-5/6 m-auto md:w-5/6  items-center justify-between xl:pt-10 xl:pb-24  xs:py-14 xs:px-4  md:px-0 md:pt-10 md:pb-28 xl:relative">
            <div className="xl:flex md:flex xs:block items-center bg-purpal rounded-3xl  xs:h-auto relative xl:py-0 xl:px-0 xs:px-4 xs:pb-60 md:pb-10 md:mt-28 md:items-center xl:mb-0 md:mb-10 xs:mb-48 xl:pb-10">
              <div className="xl:w-1/2 md:w-1/2  xs:w-full xs:pt-12">
                <div className=" xl:pl-12 xs:pl-0">
                  <div className="xl:text-5xl xs:text-4xl font-black text-black">
                    <Text field={props.fields.heading} />
                  </div>
                  <div className="text-xl text-pearlgray py-4">
                    <Text field={props.fields.content} />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="xs:w-full xl:w-1/3 text-white bg-lightorange   font-medium rounded-full text-base px-4 py-3"
                      onClick={() => {
                        if (router.asPath === '/') {
                          const element = document.getElementById('landing-page-search');
                          if (!load?.show && element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        } else {
                          router.push('/');
                        }
                      }}
                    >
                      <Text field={props.fields.searchFlightsButton} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="xl:w-1/2 md:w-1/2 xl:absolute xl:-top-20 xl:-right-3 xs:absolute xs:top-96 xs:-right-0   md:-top-20 mob-dream md:absolute">
                <JssImage field={props.fields.image1} className="w-full dream-img rounded-xl " />
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

export default withDatasourceCheck()<BookYourDreamFlightProps>(BookYourDreamFlight);
