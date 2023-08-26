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

type HomepageDetailsProps = ComponentProps & {
  fields: {
    image1: ImageField;
    image2: ImageField;
    image3: ImageField;
    image4: ImageField;
    image5: ImageField;
    heading: Field<string>;
    content: Field<string>;
    bottomBanner: ImageField;
    enjoyEveryTrip: Field<string>;
    searchFlightsButton: Field<string>;
    viewExperienceButton: Field<string>;
    enjoyEveryTripContent: Field<string>;
  };
};

const HomepageDetails = (props: HomepageDetailsProps): JSX.Element => {
  const router = useRouter();

  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <>
      {!load?.show ? (
        <section className="w-full lets-fly-section bg-black">
          <div className="container">
            <div className="xl:pt-24 xl:pb-0 xs:pt-24 xs:pb-0">
              <div>
                <div>
                  <div className="xl:flex md:flex xs:block items-center justify-between  w-full">
                    <div className="md:w-1/2 lg:w-5/12 xs:w-full pb-10 md:pb-0">
                      <div className='max-w-xl'>
                        <h2 className="text-4xl font-black text-white">
                          <Text field={props.fields.heading} />
                        </h2>
                        <p className="text-xl text-slategray py-5">
                          <Text field={props.fields.content} />
                        </p>
                        <button
                          type="submit"
                          className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
                          onClick={() => router.push('/experience')}
                        >
                          <Text field={props.fields.viewExperienceButton} />
                        </button>
                      </div>
                    </div>
                    <div className="md:w-1/2 lg:w-7/12xs:w-full xs:mt-7 md:flex justify-end">
                      <div className="flex max-w-md justify-center m-auto md:m-0 md:max-w-2xl md:justify-end flex-wrap">
                        <div className='gallery-images'>
                          <JssImage
                            field={props.fields.image1}
                            className="h-full w-full"
                          />
                        </div>
                        <div className='gallery-images mt-3 md:mt-4 lg:mt-8 2xl:mt-10'>
                          <JssImage
                            field={props.fields.image2}
                            className="h-full w-full"
                          />
                        </div>
                      
                        <div className='gallery-images'>
                          <JssImage
                            field={props.fields.image3}
                            className="h-full w-full"
                          />
                        </div>
                        <div className='gallery-images mt-3 md:mt-4 lg:mt-8 2xl:mt-10'>
                          <JssImage
                            field={props.fields.image4}
                            className="h-full w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="xl:flex md:flex md:gap-6 xs:block items-center pt-14">
                    <div className="md:w-7/12 xs:w-full ">
                      <div className="rounded-2xl overflow-hidden flight-img">
                        <JssImage field={props.fields.image5} className="h-full w-full" />
                      </div>
                    </div>

                    <div className="md:w-5/12 xs:w-full lg:mt-7">
                      <div className='max-w-xl'>
                        <h2 className="text-4xl font-black text-white">
                          <Text field={props.fields.enjoyEveryTrip} />
                        </h2>
                        <p className="text-xl text-slategray py-5">
                          <Text field={props.fields.enjoyEveryTripContent} />
                        </p>
                        <div>
                          <button
                            type="submit"
                            className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
                            onClick={() => {
                              const element = document.getElementById('landing-page-search');
                              if (!load?.show && element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                          >
                            <Text field={props.fields.searchFlightsButton} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <JssImage field={props.fields.bottomBanner} className="img-banner" />
          </div>
        </section>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default withDatasourceCheck()<HomepageDetailsProps>(HomepageDetails);
