import Image from 'next/image';
import {
  Text,
  Field,
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type ManagementTeamProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: Field<string>;
    ceoImage: ImageField;
    ceoName: Field<string>;
    ceo: Field<string>;
    ceoDescription: Field<string>;
    ceoSubdescription: Field<string>;
    teamMembers: {
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
        designation: {
          value: string;
        };
        description: {
          value: string;
        };
      };
    }[];
  };
};

const ManagementTeam = (props: ManagementTeamProps): JSX.Element => {
  return (
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto xl:px-0 xs:px-4">
        <div className="text-4xl font-black text-black">
          <Text field={props.fields.heading} />
        </div>
        <div className="text-xl text-black xl:py-6 xs:pb-20">
          <Text field={props.fields.content} />
        </div>
        <div className="xl:flex md:flex xs:block gap-5 pt-5 xl:pb-32 xs:pb-16">
          <div className="xl:w-1/2 md:w-6/12">
            <JssImage
              field={props.fields.ceoImage}
              className="h-96 xl:w-full md:w-full  rounded-2xl"
              alt="image"
            />
          </div>
          <div className="xl:w-1/2 md:w-6/12">
            <div className="xl:w-4/5 m-auto xl:pt-0 xs:pt-5">
              <div className="text-2xl text-black font-black">
                <Text field={props.fields.ceoName} />
              </div>
              <div className="text-base text-black ">
                <Text field={props.fields.ceo} />
              </div>
              <div className="text-lg font-black text-black py-4">
                <Text field={props.fields.ceoDescription} />
              </div>
              <div className="text-lg  text-black py-4">
                <Text field={props.fields.ceoSubdescription} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black">
        <div className="xl:w-5/6 md:w-5/6  m-auto py-24 ">
          <div className="xl:flex md:flex flex-wrap justify-between xs:block  xl:px-0 xs:px-4">
            {props.fields.teamMembers?.map((item, index) => (
              <div key={index} className="xl:w-1/4 md:w-1/4 xs:w-full mr-2">
                <Image
                  src={item.fields.image.value.src}
                  className="w-full rounded-xl"
                  alt="image"
                  width={item.fields.image.value.width as unknown as number}
                  height={item.fields.image.value.height as unknown as number}
                />
                <div className="py-4">
                  <div className="text-white text-2xl font-black">{item.fields.name.value}</div>
                  <div className="text-white text-base font-normal">
                    {item.fields.designation.value}
                  </div>
                </div>
                <div className="text-base text-grey xs:pb-10">{item.fields.description.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<ManagementTeamProps>(ManagementTeam);
