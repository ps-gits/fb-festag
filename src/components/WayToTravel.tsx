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
    <>
      {!load?.show ? (
        <section className="w-full bg-white">
          <div className="container">
            <div className="xl:px-0 xs:px-7 xl:pt-36 xl:pb-24 xs:pt-2 xs:pb-2 md:px-0">
              <div className="xl:flex md:flex xs:block items-center justify-between xl:py-2 xs:py-0">
                <div className="xl:text-4xl xs:text-2xl text-black font-black">
                  <Text field={props.fields.heading} />
                </div>
                <div className="xl:py-0 xs:py-3">
                  <button
                    type="submit"
                    className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
                  >
                    {props.fields.learnMoreButton?.value}
                  </button>
                </div>
              </div>

              <div className="xl:flex md:flex xs:block justify-between gap-8 py-5 ">
                {props.fields.wayToTravelItem.map((item, index) => (
                  <div key={index} className="xl:w-2/6 md:w-2/6 mb-10 md:mb-0">
                    <div className="blog-img md:h-48 lg:h-52 xl:h-64 2xl:h-72 overflow-hidden rounded-xl">
                      <Image
                        src={item.fields.image.value.src}
                        alt="image"
                        className="h-full w-full"
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
        </section>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default withDatasourceCheck()<WayToTravelProps>(WayToTravel);