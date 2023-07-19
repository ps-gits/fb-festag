import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import { useSelector } from 'react-redux';
import 'slick-carousel/slick/slick-theme.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';

type HotelListProps = ComponentProps & {
  fields: {
    hotel: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        name: {
          value: string;
        };
        price: {
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
        stars: {
          value: string;
        };
        reviews: {
          value: string;
        };
      };
    }[];
    reviews: Field<string>;
    night: Field<string>;
    heading: Field<string>;
    content: Field<string>;
    browseResortsButton: Field<string>;
  };
};

const HotelList = (props: HotelListProps): JSX.Element => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
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

  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <div>
      {!load?.show ? (
        <div className="bg-white">
          <div className="xl:w-5/6 m-auto md:w-5/6 xl:pt-10 md:pt-24 pb-6 xl:px-0 xs:px-4 xs:pt-5">
            <p className=" text-4xl text-black font-black">
              <Text field={props.fields.heading} />
            </p>
            <div className=" xl:flex md:flex xs:block xl:justify-between md:justify-between items-center py-2 xl:items-start md:items-start">
              <div className="xl:w-5/6 xs:w-full">
                <p className="text-pearlgray text-base">
                  <Text field={props.fields.content} />
                </p>
              </div>
              <div className=" xl:w-1/6 xs:w-full xl:flex md:flex xl:justify-end md:justify-end xs:pt-4">
                <button
                  type="submit"
                  className="text-white bg-lightorange   font-medium rounded-full text-base px-4 py-3"
                >
                  <Text field={props.fields.browseResortsButton} />
                </button>
              </div>
            </div>
            <div className="mt-5">
              <div>
                <Slider {...settings}>
                  {props.fields.hotel?.map((item, index) => (
                    <div key={index}>
                      <div className="bg-white rounded-lg border border-liquidgray p-4  slide-bpx shadow-lg">
                        <div>
                          <Image
                            src={item.fields.image.value.src}
                            className="w-full object-cover rounded-xl"
                            alt="image"
                            width={item.fields.image.value.width as unknown as number}
                            height={item.fields.image.value.height as unknown as number}
                          />
                        </div>

                        <div className="py-2">
                          <p className="text-xl font-black text-black">{item.fields.name.value}</p>
                          <div className="flex justify-between">
                            <div className="text-slategray font-black text-xs py-1 ">
                              {new Array(Number(item.fields.stars.value))
                                .fill(1)
                                ?.map((_item, index) => (
                                  <FontAwesomeIcon
                                    key={index}
                                    icon={faStar}
                                    aria-hidden="true"
                                    className="text-sm text-darkyellow"
                                  />
                                ))}
                              {new Array(5 - Number(item.fields.stars.value))
                                .fill(1)
                                ?.map((_item, index) => (
                                  <FontAwesomeIcon
                                    key={index}
                                    icon={faStar}
                                    aria-hidden="true"
                                    className="text-sm"
                                  />
                                ))}
                            </div>

                            <p className="text-sm text-block text-slategray">
                              {item.fields.reviews.value}
                              <Text field={props.fields.reviews} />
                            </p>
                          </div>
                          <div>
                            <hr className="h-px my-4 bg-grey border-0" />
                          </div>
                          <p className="text-base text-black font-black">
                            {item.fields.price.value}
                            <span className="text-slategray text-sm font-medium pl-2">
                              / <Text field={props.fields.night} />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
                <div>
                  <div className="relative">
                    <hr className="h-px mt-4 bg-grey border-0 absolute top-12  w-2/5" />
                  </div>
                  <div className="relative">
                    <hr className="h-px mt-4 bg-grey border-0 absolute top-12 right-0  w-2/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default withDatasourceCheck()<HotelListProps>(HotelList);
