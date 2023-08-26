import { useRouter } from 'next/router';
import {
  Text,
  Field,
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ComponentProps } from 'lib/component-props';

type SustainabilityProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: Field<string>;
    mission: Field<string>;
    missionDescription: Field<string>;
    readMoreButton: Field<string>;
    image1: ImageField;
    image2: ImageField;
  };
};

const Sustainability = (props: SustainabilityProps): JSX.Element => {
  const router = useRouter();
  return (
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto xl:pt-0 xs:pt-5 xl:px-0 xs:px-4">
        <div className="xl:flex md:flex xl:py-20 xs:block xs:py-10 gap-10">
          <div className="xl:w-1/2 md:w-1/2 xs:w-full ">
            <div className="relative">
              <div>
                <JssImage
                  field={props.fields.image1}
                  className=" journey-img  xl:w-full xs:w-11/12 rounded-2xl"
                  alt="image"
                />
              </div>
              <div>
                <JssImage
                  field={props.fields.image2}
                  className="  xl:h-64 xl:w-64 xs:w-44 xs:h-44 object-contain rounded-2xl absolute xl:-right-6 xl:-bottom-16 xs:-right-1.5 xs:-bottom-16"
                  alt="image"
                />
              </div>
            </div>
          </div>
          <div className="xl:w-1/2 md:w-1/2 xl:pt-0 xs:pt-16">
            <div className="xl:w-5/6 xl:m-auto ">
              <div className="text-black text-4xl font-black pb-6">
                <Text field={props.fields.heading} />
              </div>
              <div></div>
              <div className="text-2xl font-black text-black pb-4">
                <Text field={props.fields.mission} />
              </div>
              <div className="flex gap-3">
                <div>
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    aria-hidden="true"
                    className="h-12 w-12 text-lightorange"
                  />
                </div>
                <div className="text-xl font-thin pb-4 text-midnightBlue">
                  <Text field={props.fields.missionDescription} />
                </div>
              </div>
              <div className="text-lg text-midnightBlue">
                <Text field={props.fields.content} />
              </div>
              <div className="py-6">
                <button
                  type="submit"
                  className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3 "
                  onClick={() => router.push(props.fields.heading.value.toLowerCase())}
                >
                  <Text field={props.fields.readMoreButton} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<SustainabilityProps>(Sustainability);
