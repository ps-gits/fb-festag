import { useEffect } from 'react';
import parse from 'html-react-parser';
import {
  Text,
  Field,
  ImageField,
  RichTextField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { ComponentProps } from 'lib/component-props';
import { setFurtherInformation } from 'src/redux/reducer/Sitecore';

type FurtherInformationContactProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: Field<string>;
    email: RichTextField;
    website: RichTextField;
    facebook: RichTextField;
    instagram: RichTextField;
    linkedIn: RichTextField;
    emailLogo: ImageField;
    websiteLogo: ImageField;
    facebookLogo: ImageField;
    instagramLogo: ImageField;
    linkedInLogo: ImageField;
    backgroundImage: ImageField;
    backgroundImageMobile: ImageField;
    readNewsInDetails: boolean;
  };
};

const FurtherInformationContact = (props: FurtherInformationContactProps): JSX.Element => {
  const dispatch = useDispatch();

  const furtherInformationData = useSelector(
    (state: RootState) => state.sitecore.furtherInformation
  );
  const readNewsInDetails = useSelector((state: RootState) => state?.sitecore?.readNewsInDetails);

  useEffect(() => {
    dispatch(setFurtherInformation(props.fields));
  }, [dispatch, furtherInformationData, props.fields]);

  return (
    <>
      {readNewsInDetails !== undefined && !readNewsInDetails && (
        <div className="bg-white">
          <div className="xl:w-5/6 m-auto xl:pt-10 pb-14 xl:px-0 xs:px-4">
            <div className="relative">
              <div className="bg-purpal p-10 rounded-3xl ">
                <div className="text-2xl font-black text-black">
                  <Text field={props.fields.heading} />
                </div>
                <div className="text-xl text-pearlgray font-extrabold py-6">
                  <Text field={props.fields.content} />
                </div>
                <div className="flex items-center gap-3 xl:py-2 xs:py-2">
                  <JssImage
                    field={props.fields.emailLogo}
                    className="w-5 h-5 object-contain "
                    alt="image"
                  />
                  <div className="text-xl text-pearlgray underline cursor-pointer font-normal pb-0">
                    {props.fields.email.value && parse(props.fields.email.value)}
                  </div>
                </div>
                <div className="flex items-center gap-3 xl:py-2 xs:py-2">
                  <JssImage
                    field={props.fields.websiteLogo}
                    className="w-5 h-5 object-contain "
                    alt="image"
                  />
                  <div className="text-xl text-pearlgray underline cursor-pointer font-normal pb-0">
                    {props.fields.website.value && parse(props.fields.website.value)}
                  </div>
                </div>
                <div className="xl:flex xs:block items-center gap-5 xl:pt-4 xs:pt-0">
                  <div className="flex items-center gap-3 xl:py-0 xs:py-2">
                    <JssImage
                      field={props.fields.facebookLogo}
                      className="w-7 h-7 object-contain "
                      alt="image"
                    />
                    <div className="text-xl text-pearlgray underline cursor-pointer font-normal">
                      {props.fields.facebook.value && parse(props.fields.facebook.value)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 xl:py-0 xs:py-2 underline cursor-pointer">
                    <JssImage
                      field={props.fields.instagramLogo}
                      className="w-7 h-7 object-contain "
                      alt="image"
                    />
                    <div className="text-xl text-pearlgray underline cursor-pointer font-normal">
                      {props.fields.instagram.value && parse(props.fields.instagram.value)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 xl:py-0 xs:py-2 underline cursor-pointer ">
                    <JssImage
                      field={props.fields.linkedInLogo}
                      className="w-7 h-7 object-contain "
                      alt="image"
                    />
                    <div className="text-xl text-pearlgray underline cursor-pointer font-normal">
                      {props.fields.linkedIn.value && parse(props.fields.linkedIn.value)}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="xl:not-sr-only	xs:sr-only">
                  <JssImage
                    field={props.fields.backgroundImage}
                    className=" absolute top-8 right-0 h-72 w-1/3"
                    alt="image"
                  />
                </div>
                <div className="xs:not-sr-only	xl:sr-only">
                  <JssImage
                    field={props.fields.backgroundImageMobile}
                    className=" absolute bottom-0 right-0 h-80 w-2/5"
                    alt="image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withDatasourceCheck()<FurtherInformationContactProps>(FurtherInformationContact);
