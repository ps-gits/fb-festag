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
    <div>
      {!load?.show ? (
        <div className="w-full  bg-black">
          <div className="w-5/6 m-auto   items-center justify-between xl:pt-24 xl:pb-0 xs:pt-24 xs:pb-0">
            <div>
              <div>
                <div className="xl:flex md:flex xs:block items-center justify-between  w-full">
                  <div className="xl:w-1/2 xs:w-full ">
                    <div className="text-4xl font-black text-white">
                      <Text field={props.fields.heading} />
                    </div>
                    <div className="font-normal text-xl text-slategray py-5">
                      <Text field={props.fields.content} />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="text-white bg-lightorange   font-medium rounded-full text-base px-4 py-3"
                        onClick={() => router.push('/experience')}
                      >
                        <Text field={props.fields.viewExperienceButton} />
                      </button>
                    </div>
                  </div>
                  <div className="xl:w-1/2 xs:w-full  xs:mt-7">
                    <div className="xl:flex md:flex xs:block gap-4 justify-end">
                      <div>
                        <JssImage
                          field={props.fields.image1}
                          className="xl:w-56 xl:h-80 xs:w-full rounded-xl "
                        />
                      </div>
                      <div className="mt-12">
                        <JssImage
                          field={props.fields.image2}
                          className="xl:w-56 xl:h-80 xs:w-full  rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="xl:flex md:flex xs:block gap-4  justify-end xl:mt-0 xs:mt-8">
                      <div>
                        <JssImage
                          field={props.fields.image3}
                          className="xl:w-56 xl:h-80 xs:w-full  rounded-xl"
                        />
                      </div>
                      <div className="mt-12">
                        <JssImage
                          field={props.fields.image4}
                          className="xl:w-56 xl:h-80 xs:w-full  rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="xl:flex md:flex md:gap-6 xs:block items-center pt-14">
                  <div className="xl:w-1/2 xs:w-full ">
                    <div className="flex justify-center">
                      <JssImage field={props.fields.image5} />
                    </div>
                  </div>
                  <div className="xl:w-1/2 xs:w-full xs:mt-7">
                    <div className="text-4xl font-black text-white">
                      <Text field={props.fields.enjoyEveryTrip} />
                    </div>
                    <div className="font-normal text-xl text-slategray py-5">
                      <Text field={props.fields.enjoyEveryTripContent} />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="text-white bg-lightorange   font-medium rounded-full text-base px-4 py-3"
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
          <div className="w-full">
            <JssImage field={props.fields.bottomBanner} className="img-banner" />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default withDatasourceCheck()<HomepageDetailsProps>(HomepageDetails);
