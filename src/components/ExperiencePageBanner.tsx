import parse from 'html-react-parser';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  return (
    <div>
      <div className="bg-white">
        <div>
          <div className="xl:w-5/6 md:w-5/6 m-auto relative xl:pt-40 xl:pb-0 md:pt-40 md:pb-0 xs:pt-24 xs:pb-5 xl:px-0 xs:px-4 md:px-0">
            <div className=" xs:w-full md:flex xl:flex xs:block h-full justify-between  ">
              <div className="xl:w-2/4 md:w-6/12 xs:w-full">
                <div className="py-3">
                  <span
                    className="text-hilightgray text-sm font-normal cursor-pointer"
                    onClick={() => router.push('/')}
                  >
                    {props.fields.home.value + ' ' + '/' + ' '}
                  </span>
                  <span className="text-neviblue text-sm font-semibold">
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
                <div className="flex xl:mt-0 xs:mt-4 xs:mb-7 gap-2 xl:justify-end xs:justify-center">
                  <div className="xl:mt-24 xs:mt-12 xl:h-56 xl:w-48 xs:w-44 xs:h-36 overflow-hidden rounded-xl object-cover">
                    <JssImage field={props.fields.image1} className="w-full h-full  " alt="image" />
                  </div>
                  <div className="xl:h-80 xl:w-60 xs:w-48 xs:h-48 rounded-xl overflow-hidden object-cover ">
                    <JssImage field={props.fields.image2} className="w-full h-full" alt="image" />
                  </div>
                  <div className="xl:h-40 xl:w-32 xs:w-36 xs:h-32 rounded-xl overflow-hidden object-cover">
                    <JssImage field={props.fields.image3} className=" w-full h-full" alt="image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute banner-style">
            <JssImage field={props.fields.banner} className="xl:h-auto xl:w-full" alt="banner" />
          </div>
        </div>
        <div className="">
          <div className="">
            <div className="flex justify-center xl:pt-12 xs:pt-0 xl:pb-20 xs:pb-10">
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
