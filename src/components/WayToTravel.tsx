import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';

type WayToTravelProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    learnMoreButton: Field<string>;
    wayToTravelItem: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        heading: {
          value: string;
        };
        content: {
          value: string;
        };
        image: {
          value: {
            src: string;
            alt: string;
            width: string;
            height: string;
          };
        };
      };
    }[];
  };
};

const WayToTravel = (props: WayToTravelProps): JSX.Element => {
  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <div>
      {!load?.show ? (
        <div className="w-full  bg-white">
          <div className="xl:w-5/6 m-auto md:w-5/6 md:m-auto xs:w-full  items-center justify-between xl:px-0 xs:px-7 xl:pt-36 xl:pb-24 xs:pt-2 xs:pb-2 md:px-0">
            <div className="xl:flex md:flex xs:block items-center justify-between xl:py-2 xs:py-0">
              <div className="xl:text-4xl xs:text-2xl text-black font-black">
                <Text field={props.fields.heading} />
              </div>
              <div className="xl:py-0 xs:py-3">
                <button
                  type="submit"
                  className="text-white bg-lightorange   font-medium rounded-full text-base px-4 py-3"
                >
                  {props.fields.learnMoreButton?.value}
                </button>
              </div>
            </div>

            <div className="xl:flex md:flex xs:block justify-between gap-8 py-5 ">
              {props.fields.wayToTravelItem.map((item, index) => (
                <div key={index} className="xl:w-2/6 md:w-2/6">
                  <div>
                    <Image
                      src={item.fields.image.value.src}
                      className="w-full h-64 rounded-lg"
                      alt="image"
                      width={item.fields.image.value.width as unknown as number}
                      height={64}
                    />
                  </div>
                  <div className="pt-5">
                    <div className="font-black text-2xl text-black">
                      {item.fields.heading.value}
                    </div>
                    <div className="text-base font-normal text-neviblue py-2">
                      {item.fields.content.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default withDatasourceCheck()<WayToTravelProps>(WayToTravel);
