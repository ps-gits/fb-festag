import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { Text, Field, withDatasourceCheck, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';

type PrivacyAndPolicyProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    home: Field<string>;
    pageName: Field<string>;
    content: RichTextField;
  };
};

const PrivacyAndPolicy = (props: PrivacyAndPolicyProps): JSX.Element => {
  const router = useRouter();
  return (
    <div className="bg-white">
      <div className="xl:w-5/6 md:w-5/6 m-auto xl:pt-40 xs:pt-28 pb-20 xl:px-0 xs:px-4">
        <div className="flex">
          <div className="text-hilightgray text-sm font-normal" onClick={() => router.push('/')}>
            {props.fields.home.value + ' ' + '/'}
          </div>
          <div className="text-neviblue text-sm font-semibold">
            &nbsp;
            <Text field={props.fields.pageName} />
          </div>
        </div>
        <div className="text-6xl font-semibold text-black maldivtext pt-7 pb-24">
          <Text field={props.fields.heading} />
        </div>
        <div>{parse(props.fields.content.value as string)}</div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<PrivacyAndPolicyProps>(PrivacyAndPolicy);
