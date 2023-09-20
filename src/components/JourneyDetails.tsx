import Image from 'next/image';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import {
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';

type JourneyDetails = ComponentProps & {
  fields: {
    journeyDetailItem: {
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
        image1: {
          value: {
            src: string;
            alt: string;
            width: string;
            height: string;
          };
        };
        image2: {
          value: {
            src: string;
            alt: string;
            width: string;
            height: string;
          };
        };
      };
    }[];

    banner: ImageField;
  };
};

const JourneyDetails = (props: JourneyDetails): JSX.Element => {
  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <>
      {!load?.show ? (
        <section className="w-full pt-16 bg-black ">
          <div className="container">
            {props.fields.journeyDetailItem?.map((item, index) => (
              <div key={index}>
                {(index + 1) % 2 === 0 || window.screen.width < 1014 ? (
                  <>
                    <div className="pt-20 flex-wrap flex items-center justify-between w-full">
                      <div className="md:w-1/2 lg:w-7/12 xs:w-full xs:mt-7 xs:flex order-2 md:order-1 justify-center md:justify-start">
                        <div className="gallery-images">
                          <Image
                            src={item.fields.image1.value.src}
                            className="h-full w-full"
                            alt="image"
                            width={item.fields.image1.value.width as unknown as number}
                            height={item.fields.image1.value.height as unknown as number}
                          />
                        </div>
                        <div className="gallery-images">
                          <Image
                            src={item.fields.image2.value.src}
                            className="h-full w-full"
                            alt="image"
                            width={item.fields.image2.value.width as unknown as number}
                            height={item.fields.image2.value.height as unknown as number}
                          />
                        </div>
                      </div>
                      <div className="md:w-1/2 lg:w-5/12 xs:w-full pb-10 md:pb-0 order-1 md:order-2">
                        <div className="text-4xl font-black text-white">
                          {item.fields.heading.value}
                        </div>
                        <div className="font-normal text-xl text-slategray py-5">
                          {parse(item.fields.content.value)}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pt-20 flex-wrap flex items-center justify-between w-full">
                      <div className="md:w-1/2 lg:w-5/12 xs:w-full pb-10 md:pb-0">
                        <div className="text-4xl font-black text-white">
                          {item.fields.heading.value}
                        </div>
                        <div className="font-normal text-xl text-slategray py-5">
                          {parse(item.fields.content.value)}
                        </div>
                      </div>
                      <div className="md:w-1/2 lg:w-7/12 xs:w-full md:mt-7 xs:flex justify-center md:justify-end">
                        <div className="gallery-images">
                          <Image
                            src={item.fields.image1.value.src}
                            className="h-full w-full"
                            alt="image"
                            width={item.fields.image1.value.width as unknown as number}
                            height={item.fields.image1.value.height as unknown as number}
                          />
                        </div>
                        <div className="gallery-images">
                          <Image
                            src={item.fields.image2.value.src}
                            className="h-full w-full"
                            alt="image"
                            width={item.fields.image2.value.width as unknown as number}
                            height={item.fields.image2.value.height as unknown as number}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div>
            <JssImage field={props.fields.banner} className="xl:h-auto xl:w-full" alt="image" />
          </div>
        </section>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default withDatasourceCheck()<JourneyDetails>(JourneyDetails);