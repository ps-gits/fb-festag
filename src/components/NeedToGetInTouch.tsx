import parse from 'html-react-parser';
import { Text, Field, withDatasourceCheck, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type NeedToGetInTouchProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: RichTextField;
  };
};

const NeedToGetInTouch = (props: NeedToGetInTouchProps): JSX.Element => (
  <div className="bg-white">
    <div className="xl:w-5/6 m-auto xs:pb-10 xl:px-0 xs:px-4 relative ">
      <div className="text-4xl font-black text-black z-50">
        <Text field={props.fields.heading} />
      </div>
      <div className="text-xl font-normal py-4 z-50">
        {parse(props.fields.content.value as string)}
      </div>
    </div>
  </div>
);

export default withDatasourceCheck()<NeedToGetInTouchProps>(NeedToGetInTouch);
