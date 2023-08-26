import Image from 'next/image';
import parse from 'html-react-parser';
import {
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type JourneyDetailsWhyBeond = ComponentProps & {
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

const JourneyDetailsWhyBeond = (props: JourneyDetailsWhyBeond): JSX.Element => {
  return (
    <div className="bg-white">
      <div className="w-full  bg-black">
        <div className="w-5/6 m-auto   items-center justify-between ">
          {props.fields.journeyDetailItem?.map((item, index) => (
            <div key={index}>
              {(index + 1) % 2 === 0 || window.screen.width < 1014 ? (
                <div>
                  <div className="xl:flex md:flex xs:block items-center justify-between w-full pt-28">
                    <div className="xl:w-1/2 xs:w-full ">
                      <div className="flex gap-3 ">
                        <div className="w-full">
                          <Image
                            src={item.fields.image1.value.src}
                            className="xl:w-64 xl:h-96 xs:w-full xs:h-auto rounded-xl"
                            alt="image"
                            width={item.fields.image1.value.width as unknown as number}
                            height={item.fields.image1.value.height as unknown as number}
                          />
                        </div>
                        <div className="w-full">
                          <Image
                            src={item.fields.image2.value.src}
                            className="xl:w-64 xl:h-96 xs:w-full xs:h-auto rounded-xl"
                            alt="image"
                            width={item.fields.image2.value.width as unknown as number}
                            height={item.fields.image2.value.height as unknown as number}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="xl:w-1/2 xs:w-full xl:pl-10 md:px-5 xs:pl-0 xl:pt-0 xs:pt-5">
                      <div className="text-4xl font-black text-white">
                        {item.fields.heading.value}
                      </div>
                      <div className="font-normal text-xl text-slategray py-5">
                        {parse(item.fields.content.value)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="xl:flex md:flex xs:block items-center justify-between w-full pt-28">
                    <div className="xl:w-2/4  xs:w-full pr-10">
                      <div className="text-4xl font-black text-white">
                        {item.fields.heading.value}
                      </div>
                      <div className="font-normal text-xl text-slategray py-5">
                        {parse(item.fields.content.value)}
                      </div>
                    </div>
                    <div className="xl:w-1/2 xs:w-full ">
                      <div className="flex gap-3 xl:justify-end xs:justify-start xl:py-0 xs:py-4">
                        <div className="w-full">
                          <Image
                            src={item.fields.image1.value.src}
                            className="xl:w-64 xl:h-96 xs:w-full xs:h-auto rounded-xl"
                            alt="image"
                            width={item.fields.image1.value.width as unknown as number}
                            height={item.fields.image1.value.height as unknown as number}
                          />
                        </div>
                        <div className="w-full">
                          <Image
                            src={item.fields.image2.value.src}
                            className="xl:w-64 xl:h-96 xs:w-full xs:h-auto rounded-xl"
                            alt="image"
                            width={item.fields.image2.value.width as unknown as number}
                            height={item.fields.image2.value.height as unknown as number}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div>
          <JssImage field={props.fields.banner} className="xl:h-auto xl:w-full" alt="image" />
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<JourneyDetailsWhyBeond>(JourneyDetailsWhyBeond);
