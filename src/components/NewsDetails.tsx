import Image from 'next/image';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';

import { RootState } from 'src/redux/store';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NewsDetails = (props: {
  home: string;
  share: string;
  pageName: string;
  aboutBeond: string;
  aboutBeondDescription: string;
}) => {
  const router = useRouter();
  const furtherInformationData = useSelector(
    (state: RootState) => state.sitecore.furtherInformation
  );
  const footerData = useSelector((state: RootState) => state.sitecore.footer);
  const newsInDetails = useSelector((state: RootState) => state?.sitecore?.newsInDetail);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="bg-white">
      <div className="xl:w-3/4 md:w-3/4 m-auto  xl:pt-40 xl:pb-16 xs:pt-24 xs:pb-10 xl:px-0 xs:px-4">
        <div>
          <div className="py-3">
            <span
              className="text-hilightgray text-sm font-normal cursor-pointer "
              onClick={() => router.push('/')}
            >
              {props?.home + ' ' + '/' + ' '}
            </span>
            <span className="text-neviblue text-sm font-semibold">{props?.pageName}</span>
          </div>

          <div>
            <h1 className="xs:w-full xs:justify-center  text-black rounded-lg  py-3 font-semibold xl:text-5xl xs:text-3xl">
              {newsInDetails?.heading?.value}
            </h1>
          </div>
          <div className="flex items-center gap-2 py-4">
            <FontAwesomeIcon
              icon={faClock}
              aria-hidden="true"
              className="h-3 w-3 text-whiteSmoke"
            />
            <div className="text-xs font-medium text-whiteSmoke">{newsInDetails?.date?.value}</div>
          </div>
          <div>
            <Slider {...settings}>
              {newsInDetails?.newsImages?.map(
                (
                  item: {
                    fields: {
                      description: { value: string };
                      image: { value: { src: string; width: string; height: string } };
                    };
                  },
                  index: number
                ) => (
                  <div key={index}>
                    <div>
                      <Image
                        src={item?.fields?.image?.value?.src}
                        alt="image"
                        width={item?.fields?.image?.value?.width as unknown as number}
                        height={item?.fields?.image?.value?.height as unknown as number}
                        className="rounded-xl xl:w-full xl:h-96 xs:w-full relative"
                      />
                    </div>
                    <div className="flex justify-center py-5">
                      <div className="text-neviblue text-base">
                        {item?.fields?.description?.value}
                      </div>
                    </div>
                  </div>
                )
              )}
            </Slider>
          </div>
          <div>
            {newsInDetails?.detailedContent?.value && parse(newsInDetails?.detailedContent?.value)}
          </div>
          <div className="py-8">
            <div className="font-black text-black text-2xl">{props?.aboutBeond}</div>
          </div>
          <div className="text-base font-normal text-neviblue">{props?.aboutBeondDescription}</div>
          <div>
            <div className="bg-white">
              <div className="xl:w-full m-auto xl:pt-10 xl:pb-14 xs:py-10">
                <div className="relative">
                  <div className="bg-purpal p-10 rounded-3xl ">
                    <div className="text-2xl font-black text-black">
                      {furtherInformationData?.heading?.value}
                    </div>
                    <div className="text-xl text-pearlgray font-extrabold py-6">
                      {furtherInformationData?.content?.value}
                    </div>
                    <div className="flex items-center gap-3 xl:py-2 xs:py-2">
                      <Image
                        src={furtherInformationData?.emailLogo?.value?.src}
                        alt="image"
                        className="w-5 h-5 object-contain "
                        width={furtherInformationData?.emailLogo?.value?.width as unknown as number}
                        height={
                          furtherInformationData?.emailLogo?.value?.height as unknown as number
                        }
                      />
                      <div className="text-xl text-pearlgray underline cursor-pointer font-normal">
                        {furtherInformationData?.email?.value &&
                          parse(furtherInformationData?.email?.value)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 xl:py-2 xs:py-2">
                      <Image
                        src={furtherInformationData?.websiteLogo?.value?.src}
                        alt="image"
                        className="w-5 h-5 object-contain "
                        width={
                          furtherInformationData?.websiteLogo?.value?.width as unknown as number
                        }
                        height={
                          furtherInformationData?.websiteLogo?.value?.height as unknown as number
                        }
                      />
                      <div className="text-xl text-pearlgray underline cursor-pointer font-normal">
                        {furtherInformationData?.website?.value &&
                          parse(furtherInformationData?.website?.value)}
                      </div>
                    </div>
                    <div className="xl:flex xs:block items-center gap-5 pt-4 ">
                      <div className="flex items-center gap-3 xs:py-2">
                        <Image
                          src={furtherInformationData?.facebookLogo?.value?.src}
                          alt="image"
                          className="w-7 h-7 object-contain "
                          width={
                            furtherInformationData?.facebookLogo?.value?.width as unknown as number
                          }
                          height={
                            furtherInformationData?.facebookLogo?.value?.height as unknown as number
                          }
                        />
                        <div className="text-xl text-pearlgray underline cursor-pointer font-normal">
                          {furtherInformationData?.facebook?.value &&
                            parse(furtherInformationData?.facebook?.value)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 xs:py-2 underline cursor-pointer">
                        <Image
                          src={furtherInformationData?.instagramLogo?.value?.src}
                          alt="image"
                          className="w-7 h-7 object-contain "
                          width={
                            furtherInformationData?.instagramLogo?.value?.width as unknown as number
                          }
                          height={
                            furtherInformationData?.instagramLogo?.value
                              ?.height as unknown as number
                          }
                        />
                        <div className="text-xl text-pearlgray underline cursor-pointer font-normal">
                          {furtherInformationData?.instagram?.value &&
                            parse(furtherInformationData?.instagram?.value)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 xs:py-2 underline cursor-pointer ">
                        <Image
                          src={furtherInformationData?.linkedInLogo?.value?.src}
                          alt="image"
                          className="w-7 h-7 object-contain "
                          width={
                            furtherInformationData?.linkedInLogo?.value?.width as unknown as number
                          }
                          height={
                            furtherInformationData?.linkedInLogo?.value?.height as unknown as number
                          }
                        />
                        <div className="text-xl text-pearlgray underline cursor-pointer font-normal">
                          {furtherInformationData?.linkedIn?.value &&
                            parse(furtherInformationData?.linkedIn?.value)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="xl:not-sr-only	xs:sr-only">
                      <Image
                        src={furtherInformationData?.backgroundImage?.value?.src}
                        alt="image"
                        className=" absolute bottom-0 right-0 h-72 w-1/3"
                        width={
                          furtherInformationData?.backgroundImage?.value?.width as unknown as number
                        }
                        height={
                          furtherInformationData?.backgroundImage?.value
                            ?.height as unknown as number
                        }
                      />
                    </div>
                    <div className="xs:not-sr-only	xl:sr-only">
                      <Image
                        src={furtherInformationData?.backgroundImageMobile?.value?.src}
                        alt="image"
                        className=" absolute bottom-0 right-0 h-80 w-2/5"
                        width={
                          furtherInformationData?.backgroundImageMobile?.value
                            ?.width as unknown as number
                        }
                        height={
                          furtherInformationData?.backgroundImageMobile?.value
                            ?.height as unknown as number
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between xl:pb-12">
            <div className="text-2xl text-black font-black">{props?.share}</div>
            <div className="xl:w-4/6 md:w-3/4 xs:w-3/6">
              <hr className="h-px  bg-beige border-0 w-full" />
            </div>
            <div className="flex gap-3">
              <div className="cursor-pointer z-50">
                {footerData?.twitter?.value && parse(footerData?.twitter?.value)}
              </div>
              <div className="cursor-pointer z-50">
                {footerData?.facebook?.value && parse(footerData?.facebook?.value)}
              </div>
              <div className="cursor-pointer z-50">
                {footerData?.instagram?.value && parse(footerData?.instagram?.value)}
              </div>
              <div className="cursor-pointer z-50">
                {footerData?.linkedin?.value && parse(footerData?.linkedin?.value)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
