import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import NewsDetails from './NewsDetails';
import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';
import { setNewsInDetail, setReadNewsInDetails } from 'src/redux/reducer/Sitecore';

type NewsListProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    readMoreButton: Field<string>;
    moreNews: Field<string>;
    news: {
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
        newsImages: {
          id: string;
          url: string;
          name: string;
          displayName: string;
          fields: {
            description: {
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
        date: {
          value: string;
        };
        detailedContent: {
          value: string;
        };
      };
    }[];
    home: Field<string>;
    pageName: Field<string>;
    share: Field<string>;
    relatedNews: Field<string>;
    aboutBeond: Field<string>;
    aboutBeondDescription: Field<string>;
  };
};

const NewsList = (props: NewsListProps): JSX.Element => {
  const dispatch = useDispatch();

  const newsInDetails = useSelector((state: RootState) => state?.sitecore?.newsInDetail);
  const readNewsInDetails = useSelector((state: RootState) => state?.sitecore?.readNewsInDetails);

  return (
    <>
      {readNewsInDetails && (
        <NewsDetails
          home={props.fields.home.value}
          share={props.fields.share.value}
          pageName={props.fields.pageName.value}
          aboutBeond={props.fields.aboutBeond.value}
          aboutBeondDescription={props.fields.aboutBeondDescription.value}
        />
      )}

      <div
        className={`${
          readNewsInDetails !== undefined && !readNewsInDetails
            ? 'bg-white'
            : 'xl:py-16 bg-silver xs:py-16'
        }`}
      >
        <div className="xl:w-5/6 md:w-5/6 m-auto xl:px-0 xs:px-4 md:px-0">
          <div className="text-black font-black text-4xl pb-10">
            {readNewsInDetails ? (
              <Text field={props.fields.relatedNews} />
            ) : (
              <Text field={props.fields.heading} />
            )}
          </div>
          <div className="xl:flex flex-wrap md:flex xs:block ">
            {props.fields.news

              ?.slice(0, readNewsInDetails ? 3 : props.fields.news?.length)
              ?.filter((item) =>
                readNewsInDetails
                  ? item.fields.heading.value?.toLowerCase()?.replace(/\s/g, '') !==
                    newsInDetails?.heading?.value?.toLowerCase()?.replace(/\s/g, '')
                  : item !== undefined
              )
              ?.map((item, index) => {
                return (
                  <div key={index} className="xl:w-2/6 md:w-1/3  xs:w-full">
                    <div className="mr-3">
                      <div>
                        <Image
                          src={
                            item.fields.newsImages?.find(
                              (imageItem) =>
                                imageItem &&
                                imageItem.fields &&
                                imageItem.fields.image &&
                                imageItem.fields.image.value.src !== undefined
                            )?.fields.image.value.src as string
                          }
                          className="xl:w-full xl:h-52 xs:w-full xs:h-96 rounded-xl"
                          alt="image"
                          width={
                            item.fields.newsImages?.find(
                              (imageItem) =>
                                imageItem &&
                                imageItem.fields &&
                                imageItem.fields.image &&
                                imageItem.fields.image.value.src !== undefined
                            )?.fields.image.value.width as unknown as number
                          }
                          height={
                            item.fields.newsImages?.find(
                              (imageItem) =>
                                imageItem &&
                                imageItem.fields &&
                                imageItem.fields.image &&
                                imageItem.fields.image.value.src !== undefined
                            )?.fields.image.value.height as unknown as number
                          }
                        />
                      </div>
                      <div className="pb-10">
                        <div className="flex items-center gap-2 py-4">
                          <FontAwesomeIcon
                            icon={faClock}
                            aria-hidden="true"
                            className="h-3 w-3 text-whiteSmoke"
                          />
                          <div className="text-xs font-medium text-whiteSmoke">
                            {item.fields.date.value}
                          </div>
                        </div>
                        <div className="text-2xl font-black text-black">
                          {item.fields.heading.value}
                        </div>
                        <div className="text-neviblue text-base py-3">
                          {item.fields.content.value}
                        </div>
                        <div
                          className="flex items-baseline gap-2 py-4 cursor-pointer"
                          onClick={() => {
                            dispatch(setReadNewsInDetails(true));
                            dispatch(setNewsInDetail(item.fields));
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          }}
                        >
                          <div className="text-lightorange text-base">
                            <Text field={props.fields.readMoreButton} />
                          </div>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            aria-hidden="true"
                            className="h-3 w-3 text-lightorange"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {readNewsInDetails !== undefined && !readNewsInDetails && (
            <div className="py-10 flex justify-center gap-6">
              <div className="xl:w-2/5 xs:w-1/4">
                <hr className="h-px mt-4 bg-beige border-0 w-full" />
              </div>
              <div className="text-neviblue border border-beige px-4 py-2 rounded-full xl:w-1/5 xs:w-2/5 flex items-center justify-center">
                <Text field={props.fields.moreNews} />
              </div>
              <div className="xl:w-2/5 xs:w-1/4">
                <hr className="h-px mt-4 bg-beige border-0  w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withDatasourceCheck()<NewsListProps>(NewsList);
