import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';

type CityListProps = ComponentProps & {
  fields: {
    exploreDestinationButton: Field<string>;
    noDataFound: Field<string>;
    flyTo: Field<string>;
    searchDestinationPlaceholder: Field<string>;
    cities: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        name: {
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
        countryName: {
          value: string;
        };
        description: {
          value: string;
        };
      };
    }[];
  };
};

interface cityData {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    name: {
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
    countryName: {
      value: string;
    };
    description: {
      value: string;
    };
  };
}

const CityList = (props: CityListProps): JSX.Element => {
  const router = useRouter();

  const load = useSelector((state: RootState) => state?.loader?.loader);

  const [searchCity, setSearchCity] = useState('');
  const [dataFound, setDataFound] = useState<{ index: number; data: boolean }[]>([]);

  const countryNames = props.fields.cities?.map((item) => item.fields.countryName.value);
  const uniqueCountryNames = countryNames?.filter(
    (item, index) => index === countryNames?.indexOf(item)
  );
  const cityData = uniqueCountryNames?.map((item) =>
    props.fields.cities?.filter((dt) => dt.fields.countryName.value === item)?.map((dtt) => dtt)
  );

  const flattenArray = (data: cityData[][]) => {
    const sampleArray: cityData[] = [];

    const flatten = (data: cityData[][] | cityData[]) => {
      data?.map((item: cityData[] | cityData) => {
        if (Array.isArray(item)) {
          flatten(item);
        } else {
          sampleArray.push(item);
        }
      });
    };
    flatten(data);
    return sampleArray;
  };

  const cityArrayList = (countryName: string, countryIndex: number) => {
    const data = flattenArray(cityData)
      ?.filter((dt) => dt?.fields?.countryName.value === countryName)
      ?.filter(
        (dt) =>
          dt?.fields.countryName?.value
            ?.toLowerCase()
            ?.replaceAll(/\s/g, '')
            ?.includes(searchCity?.toLowerCase()?.replaceAll(/\s/g, '')) ||
          dt?.fields.name?.value
            ?.toLowerCase()
            ?.replaceAll(/\s/g, '')
            ?.includes(searchCity?.toLowerCase()?.replaceAll(/\s/g, '')) ||
          dt?.fields.description?.value
            ?.toLowerCase()
            ?.replaceAll(/\s/g, '')
            ?.includes(searchCity?.toLowerCase()?.replaceAll(/\s/g, '')) ||
          (props.fields.flyTo.value + dt?.fields.name?.value)
            ?.toLowerCase()
            ?.replaceAll(/\s/g, '')
            ?.includes(searchCity?.toLowerCase()?.replaceAll(/\s/g, ''))
      );
    if (searchCity?.length > 0) {
      const findData = dataFound?.find((item) => item.index === countryIndex);
      data?.length === 0
        ? findData === undefined &&
        setDataFound((prev) =>
          [...prev, { index: countryIndex, data: false }]?.filter(
            (item, index, arr) => index === arr?.findIndex((dt) => dt?.index === item?.index)
          )
        )
        : findData !== undefined &&
        setDataFound(dataFound?.filter((item) => item.index !== countryIndex));
    }
    return data;
  };

  return (
    <>
      {!load?.show ? (
        <section className="py-20 bg-white">
          <div className="container xl:pt-20">
            <div className="relative">
              {uniqueCountryNames?.map((item, countryIndex) => {
                return (
                  <div key={countryIndex}>
                    {cityArrayList(item, countryIndex)?.length > 0 ? (
                      <>
                        <div
                          className={`xl:flex md:flex xs:block justify-between items-center xl:px-0 xs:px-4 `}
                        >
                          <div>
                            <p className="text-4xl text-black font-black">{item}</p>
                          </div>
                          <div className="xl:w-2/6">
                            <div className="relative xl:px-0 xs:px-4">
                              <div className="absolute inset-y-0 right-7 -top-3 flex items-center xl:pl-6  xs:pl-10 pointer-events-none">
                                <FontAwesomeIcon
                                  icon={faSearch}
                                  aria-hidden="true"
                                  className="arrow-modal cursor-pointer text-bluedark"
                                />
                              </div>
                              <input
                                type="text"
                                id="search"
                                className="block w-full px-3 py-2  text-black text-basetext border border-graymix rounded bg-graymix "
                                placeholder={props.fields.searchDestinationPlaceholder.value}
                                autoComplete="off"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="xl:flex md:flex xl:flex-wrap md:flex-wrap xs:block pt-10  xl:px-0 xs:px-4 md:px-0 ">
                          {cityArrayList(item, countryIndex)?.map((item, index) => {
                            return (
                              <div key={index} className="xl:w-2/6 md:w-1/3">
                                <div className="xl:pt-0 xs:pt-2 xl:pb-5 xs:pb-8">
                                  <div className="mr-2">
                                    <div className="bg-white rounded-lg border border-liquidgray shadow-lg">
                                      <Image
                                        src={item.fields.image.value.src}
                                        className="w-full object-cover rounded-tr-xl rounded-tl-xl"
                                        alt="image"
                                        width={item.fields.image.value.width as unknown as number}
                                        height={item.fields.image.value.height as unknown as number}
                                      />
                                      <div className="p-4">
                                        <div className="text-2xl font-black text-black">
                                          <Text field={props.fields.flyTo} />{' '}
                                          {item.fields.name.value}
                                        </div>
                                        <div className="text-neviblue font-medium text-lg py-2">
                                          <span>{item.fields.description.value}</span>
                                        </div>
                                        <div className="pt-4">
                                          <button
                                            type="submit"
                                            className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
                                            onClick={() =>
                                              router.push(
                                                `/destinations/${item.fields.name.value
                                                  ?.toLowerCase()
                                                  ?.replace(/\s/g, '')}`
                                              )
                                            }
                                          >
                                            <Text field={props.fields.exploreDestinationButton} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      dataFound?.length === uniqueCountryNames?.length &&
                      countryIndex === 0 && (
                        <div
                          className={`xl:flex md:flex xs:block  justify-start items-center xl:pt-24 xs:pt-4 xl:px-0 xs:px-4 md:pt-24`}
                        >
                          <p className=" text-4xl text-black font-black">
                            <Text field={props.fields.noDataFound} />
                          </p>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default withDatasourceCheck()<CityListProps>(CityList);