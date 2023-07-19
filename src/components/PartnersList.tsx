import Image from 'next/image';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type PartnersListProps = ComponentProps & {
  fields: {
    readMoreButton: Field<string>;
    searchDestinationPlaceholder: Field<string>;
    noDataFound: Field<string>;
    partners: {
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
        categoryName: {
          value: string;
        };
        description: {
          value: string;
        };
      };
    }[];
  };
};

interface partnersData {
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
    categoryName: {
      value: string;
    };
    description: {
      value: string;
    };
  };
}

const PartnersList = (props: PartnersListProps): JSX.Element => {
  const [searchCity, setSearchCity] = useState('');
  const [dataFound, setDataFound] = useState<{ index: number; data: boolean }[]>([]);

  const partnerNames = props.fields.partners?.map((item) => item.fields.categoryName.value);
  const uniquePartnerNames = partnerNames?.filter(
    (item, index) => index === partnerNames?.indexOf(item)
  );
  const partnerData = uniquePartnerNames?.map((item) =>
    props.fields.partners?.filter((dt) => dt.fields.categoryName.value === item)?.map((dtt) => dtt)
  );

  const flattenArray = (data: partnersData[][]) => {
    const sampleArray: partnersData[] = [];

    const flatten = (data: partnersData[][] | partnersData[]) => {
      data?.map((item: partnersData[] | partnersData) => {
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

  const partnersArrayList = (categoryName: string, countryIndex: number) => {
    const data = flattenArray(partnerData)
      ?.filter((dt) => dt?.fields?.categoryName.value === categoryName)
      ?.filter(
        (dt) =>
          dt?.fields.categoryName?.value
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
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto xl:px-0 xs:px-4 md:px-0">
        <div className="relative">
          <div className="xl:w-2/6 md:w-1/2 xs:w-full xl:py-0 xs:py-2 xl:absolute xl:right-0 xl:top-24">
            <div className="relative">
              <div className="absolute inset-y-0 right-7 -top-3 flex items-center pl-6 pointer-events-none">
                <FontAwesomeIcon
                  icon={faSearch}
                  aria-hidden="true"
                  className="arrow-modal cursor-pointer text-bluedark"
                />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full px-3 py-2 text-black text-basetext border border-graymix rounded bg-graymix "
                placeholder={props.fields.searchDestinationPlaceholder.value}
                autoComplete="off"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>
          </div>
          {uniquePartnerNames?.map((item, countryIndex) => {
            return (
              <div key={countryIndex}>
                {partnersArrayList(item, countryIndex)?.length > 0 ? (
                  <>
                    <div
                      className={`xl:flex md:flex xs:block justify-start items-center xl:pt-24 xs:py-4 xl:py-0 xl:px-0 xs:px-0 md:pt-24`}
                    >
                      <div>
                        <p className=" text-4xl text-black font-black">{item}</p>
                      </div>
                    </div>
                    <div className="xl:flex md:flex xl:flex-wrap xl:pt-10 md:flex-wrap xs:block xl:px-0 xs:px-0 md:px-0 xl:pb-5 md:pb-12">
                      {partnersArrayList(item, countryIndex)?.map((item, index) => {
                        return (
                          <div key={index} className="xl:w-2/6 md:w-1/3">
                            <div className="pb-5">
                              <div className="mr-2">
                                <div className="bg-white rounded-lg border border-liquidgray shadow-lg">
                                  <Image
                                    src={item.fields.image.value.src}
                                    className="xl:w-full object-cover rounded-tr-xl rounded-tl-xl"
                                    alt="image"
                                    width={item.fields.image.value.width as unknown as number}
                                    height={item.fields.image.value.height as unknown as number}
                                  />
                                  <div className="p-4">
                                    <div className="text-2xl font-black text-black ">
                                      {item.fields.name.value}
                                    </div>
                                    <div className="text-neviblue font-medium text-lg py-2">
                                      <span>{item.fields.description.value}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 py-4">
                                      <div className="text-orange text-base">
                                        <Text field={props.fields.readMoreButton} />
                                      </div>
                                      <FontAwesomeIcon
                                        icon={faArrowRight}
                                        aria-hidden="true"
                                        className="h-3 w-3 text-orange"
                                      />
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
                  dataFound?.length === uniquePartnerNames?.length &&
                  countryIndex === 0 && (
                    <div
                      className={`xl:flex md:flex xs:block justify-start items-center xl:pt-24 xs:pt-4 xl:px-0 xs:px-4 md:pt-24`}
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
    </div>
  );
};

export default withDatasourceCheck()<PartnersListProps>(PartnersList);
