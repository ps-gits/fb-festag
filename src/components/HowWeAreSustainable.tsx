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

type HowWeAreSustainableProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: Field<string>;
    message: Field<string>;
    ceoName: Field<string>;
    image1: ImageField;
    image2: ImageField;
  };
};

const HowWeAreSustainable = (props: HowWeAreSustainableProps): JSX.Element => {
  return (
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto xl:pb-12">
        <div className="xl:flex md:flex xs:block xl:py-0 md:py-20 xs:py-5 gap-10 xl:px-0 xs:px-4 md:px-0">
          <div className="xl:w-1/2 md:w-1/2 xs:w-full">
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
          <div className="xl:w-1/2 md:w-1/2 xs:w-full">
            <div className="xl:w-5/6 xl:m-auto xl:py-0 xs:py-16 md:py-0">
              <div className="text-black text-4xl font-black pb-6">
                <Text field={props.fields.heading} />
              </div>
              <div className="text-lg text-midnightBlue ">
                <Text field={props.fields.content} />
              </div>

              <div className="flex gap-3 py-10">
                <div>
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    aria-hidden="true"
                    className="h-12 w-12 text-lightorange"
                  />
                </div>
                <div className="text-xl font-thin pb-4 text-midnightBlue">
                  <Text field={props.fields.message} />
                  <div className="text-lg text-midnightBlue py-2">
                    <Text field={props.fields.ceoName} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<HowWeAreSustainableProps>(HowWeAreSustainable);
