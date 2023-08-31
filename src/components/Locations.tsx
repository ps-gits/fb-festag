import Image from 'next/image';
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type LocationsProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    phone: Field<string>;
    email: Field<string>;
    address: Field<string>;
    locations: {
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
        address: {
          value: string;
        };
      };
    }[];
  };
};

const Locations = (props: LocationsProps): JSX.Element => {
  return (
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto xl:px-0 xs:px-4 xl:pb-20 xs:pb-10 md:px-0">
        <div className="text-4xl font-black text-black pb-6">
          <Text field={props.fields.heading} />
        </div>
        <div className="xl:flex md:flex xl:flex-wrap md:flex-wrap xs:block xl:px-0 xs:px-4 md:px-0 justify-between gap-1">
          {props.fields.locations?.map((item, index) => (
            <div key={index} className="xl:w-1/4 md:w-1/4">
              <div>
                <Image
                  src={item.fields.image.value.src}
                  className="xl:w-100 xs:w-full object-cover rounded-xl"
                  alt="image"
                  width={item.fields.image.value.width as unknown as number}
                  height={item.fields.image.value.height as unknown as number}
                />
              </div>
              <div>
                <div className="text-2xl font-black text-black py-3">{item.fields.name.value}</div>
                <div className="xl:pb-10 md:pb-10 xs:pb-5">
                  
                  {/* <div className="text-base text-neviblue">
                    <Text field={props.fields.phone} />
                  </div>
                  <div className="text-base font-black text-neviblue">
                    {item.fields.phone.value}
                  </div>
                  <div className="text-base text-neviblue">
                    <Text field={props.fields.email} />
                  </div>
                  <div className="text-base font-black text-neviblue">
                    {item.fields.email.value}
                  </div>
                  <div className="text-base text-neviblue">
                    <Text field={props.fields.address} />
                  </div>
                  <div className="text-base font-black text-neviblue">
                    {item.fields.address.value}
                  </div> */}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<LocationsProps>(Locations);
