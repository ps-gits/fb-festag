import {
  Text,
  Field,
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type CorporateTeamProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    description: Field<string>;
    subHeading: Field<string>;
    subDescription: Field<string>;
    viewCurrentOpeningsButton: Field<string>;
    image1: ImageField;
    image2: ImageField;
  };
};

const CorporateTeam = (props: CorporateTeamProps): JSX.Element => {
  
  const win: Window = window;
  
  return (
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto">
        <div className="xl:flex md:flex xs:block gap-10 pb-10 xl:px-0 xs:px-4 md:px-0">
          <div className="xl:w-1/2 md:w-1/2">
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
          <div className="xl:w-1/2 md:w-1/2">
            <div className="xl:w-5/6 xl:m-auto xl:pt-0 xs:pt-16">
              <div className="text-4xl font-black text-black pb-4">
                <Text field={props.fields.heading} />
              </div>
              <div className="text-midnightBlue text-lg pb-4">
                <Text field={props.fields.description} />
              </div>
              <div className="text-xl font-black text-black pb-4">
                <Text field={props.fields.subHeading} />
              </div>
              <div className="text-midnightBlue text-lg pb-4">
                <Text field={props.fields.subDescription} />
              </div>
              <button
                type="submit"
                className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
                onClick={() =>
                (win.open('https://apply.workable.com/beond/','_blank'))
                }
              >
                <Text field={props.fields.viewCurrentOpeningsButton} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<CorporateTeamProps>(CorporateTeam);
