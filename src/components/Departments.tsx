import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type DepartmentsProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    browseAllFaqsButton: Field<string>;
    faqHeading: Field<string>;
    phone: Field<string>;
    email: Field<string>;
    faqs: {
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
    departments: {
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
        phone: {
          value: string;
        };
        email: {
          value: string;
        };
      };
    }[];
  };
};

const Departments = (props: DepartmentsProps): JSX.Element => {
  const router = useRouter();

  const [questionsIndex, setQuestionsIndex] = useState<number[]>([]);
  return (
    <div className="bg-black py-20">
      <div className="xl:w-5/6 md:w-5/6 m-auto xl:px-0 xs:px-4 md:px-0">
        <div className="text-4xl font-black text-white pb-8">
          <Text field={props.fields.heading} />
        </div>
        <div className="xl:flex md:flex xl:flex-wrap md:flex-wrap xs:block xl:px-0 xs:px-4 md:px-0 justify-between gap-1">
          {props.fields.departments?.map((item, index) => (
            <div key={index} className="xl:w-1/4 md:w-1/4 pb-10">
              <Image
                src={item.fields.image.value.src}
                className="xl:w-100 xs:w-full object-cover rounded-xl"
                alt="image"
                width={item.fields.image.value.width as unknown as number}
                height={item.fields.image.value.height as unknown as number}
              />
              <div>
                <div className="text-2xl text-white font-black py-3">{item.fields.name.value}</div>
                <div className="xl:pb-0 xs:pb-10">
                  <div className="py-1">
                    <div className="text-slategray text-base ">
                      <Text field={props.fields.phone} />
                    </div>
                    <div className="text-base text-white font-black">{item.fields.phone.value}</div>
                  </div>
                  <div className="py-1">
                    <div className="text-slategray text-base ">
                      <Text field={props.fields.email} />
                    </div>
                    <div className="text-base text-white font-black">{item.fields.email.value}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-4xl font-black text-white py-10">
          <Text field={props.fields.faqHeading} />
        </div>
        <div>
          {props.fields.faqs?.map((questionItem, questionIndex) => (
            <div key={questionIndex} className="py-3">
              <div>
                <div
                  className={`${
                    questionsIndex?.includes(questionIndex)
                      ? 'bg-lightpink rounded-t-lg'
                      : 'bg-white border-silver border rounded-lg'
                  } cursor-pointer shadow-sm p-5 flex justify-between items-center w-full`}
                  onClick={() => {
                    const quesIndex = questionsIndex.includes(questionIndex)
                      ? questionsIndex.filter((item) => item !== questionIndex)
                      : [...questionsIndex, questionIndex];
                    setQuestionsIndex(quesIndex);
                  }}
                >
                  <div className="flex justify-between w-full items-center">
                    <div className="text-lg font-black text-black">
                      {questionItem.fields.question.value}
                    </div>
                    <FontAwesomeIcon
                      icon={questionsIndex?.includes(questionIndex) ? faMinus : faPlus}
                      className="h-4 w-4 text-black"
                    />
                  </div>
                </div>
                {questionsIndex?.includes(questionIndex) && (
                  <div className="bg-lightpink px-5 pb-5 rounded-b-lg text-black">
                    {questionItem.fields.answer.value}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-10">
          <button
            type="submit"
            className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
            onClick={() => router.push('/faqs')}
          >
            <Text field={props.fields.browseAllFaqsButton} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<DepartmentsProps>(Departments);
