import parse from 'html-react-parser';
import {
  Text,
  Field,
  ImageField,
  RichTextField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type ExperiencePageBannerProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    home: Field<string>;
    pageName: Field<string>;
    content: Field<string>;
    banner: ImageField;
    bigBanner: ImageField;
    image1: ImageField;
    image2: ImageField;
    image3: ImageField;
    richText: RichTextField;
  };
};

const ExperiencePageBanner = (props: ExperiencePageBannerProps): JSX.Element => {
  return (
    <div>
      <div className="bg-white">
        <div>
          <div className="xl:w-5/6 md:w-5/6 m-auto relative xl:pt-36 xl:pb-0 md:pt-40 md:pb-0 xs:pt-24 xs:pb-5 xl:px-0 xs:px-4 md:px-0">
            <div className=" xs:w-full md:flex xl:flex xs:block h-full justify-between  ">
              <div className="xl:w-2/4 md:w-6/12 xs:w-full">
                <div className="py-3">
                  <span className="text-hilightgray text-sm font-normal">
                    <Text field={props.fields.home} />/
                  </span>
                  <span className="text-black text-sm font-black">
                    <Text field={props.fields.pageName} />
                  </span>
                </div>
                <h1 className="maldivtext xs:w-full  text-black rounded-lg  inline-flex items-center  py-3 font-semibold xl:text-6xl xs:text-3xl">
                  <Text field={props.fields.heading} />
                </h1>
                <h1 className="xs:w-full text-xl  rounded-lg  inline-flex items-center  py-3 font-normal text-black">
                  <Text field={props.fields.content} />
                </h1>
              </div>
              <div className="xl:w-2/4 md:w-6/12 xs:w-full">
                <div className="flex xl:mt-0 xs:mt-4 xs:mb-7 gap-2 xs:justify-end">
                  <div className="xl:mt-36 xs:mt-8">
                    <JssImage
                      field={props.fields.image1}
                      className=" xl:h-44 xl:w-32 xs:w-44 xs:h-36  rounded-xl"
                      alt="image"
                    />
                  </div>
                  <div>
                    <JssImage
                      field={props.fields.image2}
                      className=" xl:h-80 xl:w-60 xs:w-44 xs:h-44 rounded-xl"
                      alt="image"
                    />
                  </div>
                  <div>
                    <JssImage
                      field={props.fields.image3}
                      className="xl:h-44 xl:w-28 xs:w-44 xs:h-32  rounded-xl"
                      alt="image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute xl:top-96 md:top-64">
            <JssImage field={props.fields.banner} className="xl:h-auto xl:w-full" alt="banner" />
          </div>
        </div>
        <div className="">
          <div className="">
            <div className="flex justify-center xl:py-10 md:py-10">
              <JssImage
                field={props.fields.bigBanner}
                className="banner xl:h-full  xl:m-auto md:w-full md:h-full xs:w-full xs:h-44  object-contain rounded-2xl "
                alt="island"
              />
            </div>
          </div>
        </div>
        {props.fields.richText.value && props.fields.richText.value?.length > 0 && (
          <div className="pb-10 xl:w-3/4 md:w-5/6 m-auto">
            <div className="maldivtext font-semibold xl:text-4xl xs:text-2xl items-center text-black py-10 flex flex-wrap justify-center gap-3 xl:px-0 xs:px-4">
              {parse(props.fields.richText.value as string)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withDatasourceCheck()<ExperiencePageBannerProps>(ExperiencePageBanner);
