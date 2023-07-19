import { useSelector } from 'react-redux';
import {
  Text,
  Field,
  ImageField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';

type RouteMapProps = ComponentProps & {
  fields: {
    mapImage: ImageField;
    heading: Field<string>;
    content: Field<string>;
  };
};

const RouteMap = (props: RouteMapProps): JSX.Element => {
  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <div>
      {!load?.show ? (
        <div className="relative bg-white">
          <JssImage field={props.fields.mapImage} />
          <div className="xl:w-5/6 md:w-5/6  xs:w-full m-auto  ">
            <div className="absolute xl:top-24 xs:top-14 xl:px-0 xs:px-4 ">
              <div className="text-4xl text-black font-black">
                <Text field={props.fields.heading} />
              </div>
              <div className="text-base font-normal text-neviblue py-2">
                <Text field={props.fields.content} />
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

export default withDatasourceCheck()<RouteMapProps>(RouteMap);
