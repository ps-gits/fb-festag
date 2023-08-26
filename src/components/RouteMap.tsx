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
    <>
      {!load?.show ? (
        <section className="map-section relative bg-white pt-12 md:pt-20 lg:pt-0">
          <div className='container'>
            <div className="md:absolute xl:top-24 xs:top-14 xl:px-0 xs:px-4 max-w-lg">
              <h2 className="text-4xl text-black font-black">
                <Text field={props.fields.heading} />
              </h2>
              <p className="text-base font-normal text-neviblue py-2">
                <Text field={props.fields.content} />
              </p>
            </div>
          </div>
          <JssImage field={props.fields.mapImage} />
        </section>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default withDatasourceCheck()<RouteMapProps>(RouteMap);
