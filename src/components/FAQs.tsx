import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type FAQsProps = ComponentProps & {
  fields: {
    home: Field<string>;
    noDataFound: Field<string>;
    pageName: Field<string>;
    heading: Field<string>;
    content: Field<string>;
    searchPlaceholder: Field<string>;
    contactUs: Field<string>;
    stillNotHelpful: Field<string>;
    questionsTopic: {
      id: string;
      url: string;
      name: string;
      displayName: string;
      fields: {
        title: {
          value: string;
        };
        questions: {
          id: string;
          url: string;
          name: string;
          displayName: string;
          fields: {
            question: {
              value: string;
            };
            answer: {
              value: string;
            };
          };
        }[];
      };
    }[];
  };
};

const FAQs = (props: FAQsProps): JSX.Element => {
  const [topicIndex, setTopicIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [questionDisplay, setQuestionDisplay] = useState<{
    topicIndex: number;
    questionsIndex: number[];
  }>({
    topicIndex: 0,
    questionsIndex: [],
  });
  const [faqData, setFaqData] = useState(props.fields?.questionsTopic);

  const searchQuestionData = (text: string) => {
    setSearchText(text);
    if (text?.length > 2) {
      const finalData = props?.fields?.questionsTopic
        ?.filter(
          (item) =>
            item?.fields?.title?.value
              ?.toLowerCase()
              ?.replaceAll(/\s/g, '')
              ?.includes(text?.toLowerCase()?.replaceAll(/\s/g, '')) ||
            item?.fields?.questions?.filter((dt) =>
              dt?.fields?.question?.value
                ?.toLowerCase()
                ?.replaceAll(/\s/g, '')
                ?.includes(text?.toLowerCase()?.replaceAll(/\s/g, ''))
            )?.length > 0
        )
        ?.map((item) => {
          const findQuestions = item?.fields?.questions?.filter((dt) =>
            dt?.fields?.question?.value
              ?.toLowerCase()
              ?.replaceAll(/\s/g, '')
              ?.includes(text?.toLowerCase()?.replaceAll(/\s/g, ''))
          );
          if (
            findQuestions?.length > 0 &&
            item?.fields?.questions?.length !== findQuestions?.length
          ) {
            return {
              ...item,
              fields: {
                ...item.fields,
                questions: findQuestions,
              },
            };
          } else {
            return item;
          }
        });
      setTopicIndex(0);
      setQuestionDisplay({
        topicIndex: 0,
        questionsIndex: [],
      });
      setFaqData(finalData);
    } else {
      setTopicIndex(0);
      setQuestionDisplay({
        topicIndex: 0,
        questionsIndex: [],
      });
      setFaqData(props?.fields?.questionsTopic);
    }
  };


  return (
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto  xl:pb-10 xl:pt-36 xs:pt-24 xs:pb-24 xl:px-0 xs:px-4 md:px-0">
        <div className="py-3">
          <div className="flex">
            <div className="text-hilightgray text-sm font-normal">
              <Text field={props.fields.home} />/
            </div>
            <div className="text-neviblue text-sm font-black">
              <Text field={props.fields.pageName} />
            </div>
          </div>
        </div>
        <div className="py-3">
          <div className="xl:w-1/2">
            <div className="xl:w-full xl:m-auto">
              <div className="maldivtext text-5xl text-black ">
                <Text field={props.fields.heading} />
              </div>
            </div>
          </div>
          <div className="xl:flex md:flex xs:block xl:justify-between md:justify-between items-center py-2">
            <div className="text-xl text-black">
              <Text field={props.fields.content} />
            </div>
            <div className="text-black xl:w-1/4 relative xl:pt-0 xs:pt-4 md:w-2/5">
              <input
                type="text"
                className="menu-mobile-navigate py-3 px-3  rounded text-black text-sm xl:w-full bg-graymix xs:w-full"
                placeholder={props.fields.searchPlaceholder.value}
                autoComplete="off"
                value={searchText}
                onChange={(e) => searchQuestionData(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                aria-hidden="true"
                className="h-4 w-4 text-bluedark absolute xl:top-3 xl:right-3 xs:top-8 xs:right-3"
              />
            </div>
          </div>
        </div>
        <div className="xl:flex xs:flex xs:flex-wrap gap-5 my-5">
          {faqData?.length > 0 ? (
            faqData?.map((item, index) => {
              return (
                <div key={index}>
                  <div
                    className={`${
                      topicIndex === index ? 'bg-aqua text-white font-black' : 'bg-lightblue'
                    } px-6 py-3 rounded-full cursor-pointer  text-black`}
                    onClick={() => {
                      setTopicIndex(index);
                      setQuestionDisplay({
                        topicIndex: index,
                        questionsIndex: [],
                      });
                    }}
                  >
                    {item.fields.title.value}
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className={`xl:flex md:flex xs:block  justify-start items-center xl:pt-10 xs:pt-4 xl:px-0 xs:px-4 md:pt-10`}
            >
              <p className=" text-4xl text-black font-black">
                <Text field={props.fields.noDataFound} />
              </p>
            </div>
          )}
        </div>
        <div>
          {topicIndex !== undefined &&
            faqData !== undefined &&
            faqData[topicIndex] !== undefined &&
            faqData[topicIndex]?.fields?.questions?.map((questionItem, questionIndex) => (
              <div key={questionIndex} className="py-2">
                <div>
                  <div>
                    <div
                      className={`${
                        questionDisplay.topicIndex === topicIndex &&
                        questionDisplay.questionsIndex?.includes(questionIndex)
                          ? 'bg-lightpink'
                          : 'bg-white border-silver border'
                      } cursor-pointer shadow-sm p-5 flex justify-between items-center w-full   rounded-lg`}
                      onClick={() => {
                        const quesIndex = questionDisplay.questionsIndex.includes(questionIndex)
                          ? questionDisplay.questionsIndex.filter((item) => item !== questionIndex)
                          : [...questionDisplay.questionsIndex, questionIndex];
                        setQuestionDisplay({
                          topicIndex: questionDisplay.topicIndex,
                          questionsIndex: quesIndex,
                        });
                      }}
                    >
                      <div className="flex justify-between w-full items-center">
                        <div className="text-lg font-black text-black">
                          {questionItem.fields.question.value}
                        </div>
                        <FontAwesomeIcon
                          icon={
                            questionDisplay.topicIndex === topicIndex &&
                            questionDisplay.questionsIndex?.includes(questionIndex)
                              ? faMinus
                              : faPlus
                          }
                          className="h-4 w-4 text-black"
                        />
                      </div>
                    </div>
                    {questionDisplay.topicIndex === topicIndex &&
                      questionDisplay.questionsIndex?.includes(questionIndex) && (
                        <div className="bg-lightpink px-5 pb-5 text-black">
                          {questionItem.fields.answer.value}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex gap-1 py-4">
          <div className="text-base text-neviblue font-bold">
            <Text field={props.fields.stillNotHelpful} />
          </div>
          <div className="text-base text-orange font-medium">
            <Text field={props.fields.contactUs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<FAQsProps>(FAQs);
