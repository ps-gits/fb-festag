import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Text,
  Field,
  withDatasourceCheck,
  ImageField,
  Image,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type SupportProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: Field<string>;
    fillOutASimpleForm: Field<string>;
    giveUsACall: Field<string>;
    liveChat: Field<string>;
    image1: ImageField;
    image2: ImageField;
  };
};

const Support = (props: SupportProps): JSX.Element => {
  return (
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto xl;px-0 xs:px-4 xl:pt-24 xl:pb-5 xs:pt-10 xs:pb-5 md:px-0">
        <div className="xl:flex md:flex xs:block">
          <div className="xl:w-1/2 md:w-1/2 xs:w-full">
            <div className="xl:w-5/6 xl:m-auto">
              <div className="text-4xl font-black text-black">
                <Text field={props.fields.heading} />
              </div>
              <div className="text-xl text-neviblue py-5">
                <Text field={props.fields.content} />
              </div>
              <div className="flex items-baseline gap-2 py-4">
                <div className="text-orange text-base">
                  <Text field={props.fields.fillOutASimpleForm} />
                </div>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  aria-hidden="true"
                  className="h-3 w-3 text-orange"
                />
              </div>

              <div className="flex items-baseline gap-2 py-4">
                <div className="text-orange text-base">
                  <Text field={props.fields.giveUsACall} />
                </div>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  aria-hidden="true"
                  className="h-3 w-3 text-orange"
                />
              </div>

              <div className="flex items-baseline gap-2 py-4">
                <div className="text-orange text-base">
                  <Text field={props.fields.liveChat} />
                </div>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  aria-hidden="true"
                  className="h-3 w-3 text-orange"
                />
              </div>
            </div>
          </div>

          <div className="xl:w-1/2 md:w-1/2 xs:w-full flex gap-3 xl:justify-end xs:justify-startxl:py-0 xs:py-4">
            <div>
              <Image
                field={props.fields.image1}
                className="journey-img xl:w-64 rounded-xl"
                alt="image"
              />
            </div>
            <div>
              <Image
                field={props.fields.image2}
                className=" journey-img xl:w-64 rounded-xl"
                alt="image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<SupportProps>(Support);
