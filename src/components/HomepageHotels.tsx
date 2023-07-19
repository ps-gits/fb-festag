import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';

type HomepageHotelsProps = ComponentProps & {
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

const HomepageHotels = (props: HomepageHotelsProps): JSX.Element => {
  const router = useRouter();
  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <div>
      {!load?.show ? (
        <div className="w-full  bg-white">
          <div className="items-center justify-between xl:pt-24">
            <div className="xl:w-5/6 md:w-5/6 m-auto xs:w-full xl:px-0 xs:px-4 md:px-0 ">
              <div>
                <div className="xl:flex md:flex xs:block items-center justify-between w-full">
                  <div className="xl:w-1/2 xs:w-full">
                    <div className="xl:flex md:flex xl:flex-wrap md:flex-wrap xs:flex-wrap gap-4  ">
                      {props.fields.hotel?.slice(0, 4)?.map((item, index) => (
                        <div
                          key={index}
                          className={`xs:w-full xl:w-2/5 md:w-2/5 ${
                            (index + 1) % 2 === 0 ? 'xl:mt-8 xl:py-0 xs:py-5 ' : ''
                          }`}
                        >
                          <div className="bg-white rounded-xl border border-liquidgray p-2 shadow-sm">
                            <Image
                              src={item.fields.image.value.src}
                              className="w-full h-44 rounded-xl"
                              alt="image"
                              width={item.fields.image.value.width as unknown as number}
                              height={item.fields.image.value.height as unknown as number}
                            />
                            <div className="py-2">
                              <p className="text-lg font-black text-black">
                                {item.fields.name.value}
                              </p>
                              <div className="text-slategray font-black text-xs py-1">
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
                                <span className="px-2">
                                  {item.fields.reviews.value}
                                  <Text field={props.fields.reviews} />
                                </span>
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
                    </div>
                  </div>
                  <div className="xl:w-1/2 xs:w-full xl:px-16 xl:pt-0 xs:pt-3 xs:px-4">
                    <div className="text-4xl font-black text-black">
                      <Text field={props.fields.heading} />
                    </div>
                    <div className="font-normal text-base text-pearlgray py-5">
                      <Text field={props.fields.content} />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="text-white bg-lightorange   font-medium rounded-full text-base px-4 py-3"
                        onClick={() => router.push('/resorts')}
                      >
                        <Text field={props.fields.browseResortsButton} />
                      </button>
                    </div>
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

export default withDatasourceCheck()<HomepageHotelsProps>(HomepageHotels);
