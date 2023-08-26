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

type GetThereWithBeondProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    ourAircraft: Field<string>;
    ourAircraftContent: Field<string>;
    mealAndDining: Field<string>;
    mealAndDiningContent: Field<string>;
    learnMoreButton: Field<string>;
    image1: ImageField;
    image2: ImageField;
  };
};

const GetThereWithBeond = (props: GetThereWithBeondProps): JSX.Element => {
  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <>
      {!load?.show ? (
        <div className="bg-white">
          <div className="xl:w-5/6 md:w-5/6 m-auto xl:pt-24">
            <div className="xl:flex md:flex xs:block xl:py-24 md:py-20 xs:py-5 gap-10 xl:px-0 xs:px-4">
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
                      className=" xl:h-64 xl:w-64 xs:w-44 xs:h-44 object-contain rounded-2xl absolute xl:-right-6 xl:-bottom-16 xs:-right-1.5 xs:-bottom-16"
                      alt="image"
                    />
                  </div>
                </div>
              </div>
              <div className="xl:w-1/2 md:w-1/2 xs:w-full">
                <div className="xl:w-5/6 xl:m-auto xl:py-0 xs:py-16 md:py-0">
                  <div className="text-black text-4xl font-black pb-4">
                    <Text field={props.fields.heading} />
                  </div>

                  <div className="text-3xl font-black text-black pb-4">
                    <Text field={props.fields.ourAircraft} />
                  </div>
                  <div className="text-midnightBlue text-lg pb-4">
                    <Text field={props.fields.ourAircraftContent} />
                  </div>
                  <div className="text-3xl font-black text-black pb-4">
                    <Text field={props.fields.mealAndDining} />
                  </div>
                  <div className="text-midnightBlue text-lg pb-4">
                    <Text field={props.fields.mealAndDiningContent} />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3 "
                    >
                      <Text field={props.fields.learnMoreButton} />
                    </button>
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

export default withDatasourceCheck()<GetThereWithBeondProps>(GetThereWithBeond);
