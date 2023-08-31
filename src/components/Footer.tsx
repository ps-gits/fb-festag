import Link from 'next/link';
import { AnyAction } from 'redux';
import parse from 'html-react-parser';
import {
  Text,
  Field,
  ImageField,
  RichTextField,
  Image as JssImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import CookiesModal from './Modal/CookiesModal';
import { ComponentProps } from 'lib/component-props';
import { setFooter } from 'src/redux/reducer/Sitecore';
import { setFooterTC } from 'src/redux/reducer/FlightDetails';
import { getSitecoreContent } from 'src/redux/action/Sitecore';

type FooterProps = ComponentProps & {
  fields: {
    logo: ImageField;
    faq: Field<string>;
    twitter: RichTextField;
    home: Field<string>;
    linkedin: RichTextField;
    facebook: RichTextField;
    about: Field<string>;
    media: Field<string>;
    legal: Field<string>;
    instagram: RichTextField;
    pvtLtd: Field<string>;
    resorts: Field<string>;
    cookies: Field<string>;
    contact: Field<string>;
    support: Field<string>;
    careers: Field<string>;
    company: Field<string>;
    content: Field<string>;
    followUs: Field<string>;
    bottomBanner: ImageField;
    navigation: Field<string>;
    experience: Field<string>;
    latestNews: Field<string>;
    destinations: Field<string>;
    privacyPolicy: Field<string>;
    meda: Field<string>;
    sustainability: Field<string>;
    subscribeButton: Field<string>;
    termsConditions: Field<string>;
    emailPlaceholder: Field<string>;
    signUpForNewsLetter: Field<string>;
    contactUs:Field<string>;
    imprint:Field<string>;
    noticeOfPassenger:Field<string>;
    conditionsOfCarriage:Field<string>;
    cookiePolicy:Field<string>;
  };
};

const Footer = (props: FooterProps): JSX.Element => {
  const dispatch = useDispatch();

  // const termsConditionsContent = useSelector(
  //   (state: RootState) => state?.sitecore?.termsConditions?.fields
  // );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const footerData = useSelector((state: RootState) => state.sitecore.footer);

  const [cookiesModal, setCookiesModal] = useState(false);

  useEffect(() => {
    if (footerData && footerData?.length === 0) {
      dispatch(setFooter(props.fields));
    }
  }, [dispatch, footerData, props.fields]);

  useEffect(() => {
    // termsConditionsContent === undefined &&
    dispatch(getSitecoreContent('Terms-Conditions') as unknown as AnyAction);
  }, [dispatch]);

  return (
    <div
      onClick={() => {
        const modalCookies = document.getElementById('cookies-modal');
        window.onclick = function (event) {
          if (event.target == modalCookies) {
            setCookiesModal(false);
            document.body.style.overflow = 'unset';
          }
        };
      }}
    >
      <div className="bg-white">
        {!load?.show ? (
          <footer className="footer relative">
            <div className="container">
              <CookiesModal
                showModal={cookiesModal}
                closeModal={() => {
                  setCookiesModal(false);
                  document.body.style.overflow = 'unset';
                }}
              />
            </div>
            <div className="w-full bg-black lg:py-14 xs:py-10 md:py-6 ">
              <div className="container relative z-20">
                <div className="xl:flex md:flex xs:block gap-8">
                  <div className="xs:mb-5 xl:w-6/12 md:w-full">
                    <div>
                      <JssImage field={props.fields.logo} className="cursor-pointer" />
                    </div>

                    <div className="py-3 mt-5">
                      <div className="text-white text-xl font-black">
                        <Text field={props.fields.signUpForNewsLetter} />
                      </div>
                      <div className="text-slategray text-sm font-normal">
                        <Text field={props.fields.content} />
                      </div>
                    </div>
                    <div className="xs:block md:flex xl:flex xs:items-center gap-2">
                      <div className="text-black xl:w-3/5 xs:w-full z-50">
                        <input
                          type="text"
                          className="menu-mobile-navigate py-3 px-3 rounded-full text-black text-sm xl:w-full xs:w-full"
                          placeholder={props.fields.emailPlaceholder?.value}
                        />
                      </div>
                      <div className="z-50 xl:py-0 xs:py-2">
                        <button
                          type="submit"
                          className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3 w-full md:w-auto"
                        >
                          {props.fields.subscribeButton?.value}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between xl:w-4/12 xs:w-full">
                    <div className="xs:w-2/4 xl:w-full">
                      <div className="text-base font-black text-white">
                        <Text field={props.fields.navigation} />
                      </div>
                      <div className="py-3">
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer ">
                          <Link href={`/`}>
                            <Text field={props.fields.home} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer ">
                          <Link
                            href={`/${props.fields.destinations.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.destinations} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer ">
                          <Link
                            href={`/${props.fields.experience.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.experience} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer ">
                          <Link
                            href={`/${props.fields.resorts.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.resorts} />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="xs:w-2/4 xl:w-full">
                      <div className="text-base font-black text-white">
                        <Text field={props.fields.about} />
                      </div>
                      <div className="py-3">
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer ">
                          <Link href={`/company/managementteam`}>
                            <Text field={props.fields.company} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer ">
                          <Link
                            href={`/${props.fields.latestNews.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.latestNews} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer  ">
                          <Text field={props.fields.media} />
                        </div>

                        <div className="text-sm font-normal text-Silvergray py-1  cursor-pointer ">
                          <Link
                            href={`/${props.fields.sustainability.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.sustainability} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between xl:w-1/4 xs:w-full">
                    <div className="xs:w-2/4">
                      <div className="text-base font-black text-white">
                        <Text field={props.fields.contact} />
                      </div>
                      <div className="py-3">
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer  ">
                          <Link
                            href={`/${props.fields.careers.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.careers} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer  ">
                          <Link
                            href={`/${props.fields.contactUs.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.contactUs} />
                          </Link>
                        </div>
                        {/* <div className="xs:w-2/4">
                          <div className="text-base font-black text-white">
                            <Text field={props.fields.legal} />
                          </div>
                          <div className="py-3">
                            <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer ">
                              <Link
                                href={`/${props.fields.termsConditions.value
                                  ?.toLowerCase()
                                  ?.replace(/\s/g, '')}`}
                                onClick={() => dispatch(setFooterTC(true))}
                              >
                                <Text field={props.fields.termsConditions} />
                              </Link>
                            </div>
                            <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer z-50">
                              <Link
                                href={`/${props.fields.privacyPolicy.value
                                  ?.toLowerCase()
                                  ?.replace(/\s/g, '')}`}
                              >
                                <Text field={props.fields.privacyPolicy} />
                              </Link>
                            </div>
                            <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer z-50">
                              <Link
                                href={`/${props.fields.meda.value
                                  ?.toLowerCase()
                                  ?.replace(/\s/g, '')}`}
                              >
                                <Text field={props.fields.meda} />
                              </Link>
                            </div>
                            <div
                              className="text-sm font-normal text-Silvergray py-1 cursor-pointer "
                              onClick={() => {
                                setCookiesModal(!cookiesModal);
                                document.body.style.overflow = 'hidden';
                              }}
                            >
                              <Text field={props.fields.cookies} />
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <div className="xs:w-2/4">
                      <div className="text-base font-black text-white">
                        <Text field={props.fields.legal} />
                      </div>
                      <div className="py-3">
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer ">
                          <Link
                            href={`/${props.fields.termsConditions.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                            onClick={() => dispatch(setFooterTC(true))}
                          >
                            <Text field={props.fields.termsConditions} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer z-50">
                          <Link
                            href={`/${props.fields.privacyPolicy.value
                              ?.toLowerCase()
                              ?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.privacyPolicy} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer z-50">
                          <Link
                            href={`/${props.fields.meda.value?.toLowerCase()?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.meda} />
                          </Link>
                        </div>
                        <div
                          className="text-sm font-normal text-Silvergray py-1 cursor-pointer "
                          onClick={() => {
                            setCookiesModal(!cookiesModal);
                            document.body.style.overflow = 'hidden';
                          }}
                        >
                          <Text field={props.fields.cookies} />
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer z-50">
                          <Link
                            href="https://edge.sitecorecloud.io/arabesquefl0f70-demoproject-demoenv-79bc/media/flightbooking/Legal-Docs/CoC_Beond_MS_080823_v2.pdf"
                          >
                            <Text field={props.fields.conditionsOfCarriage} />
                          </Link>
                        </div>
                        {/* <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer z-50">
                          <Link
                            href={`/${props.fields.imprint.value?.toLowerCase()?.replace(/\s/g, '')}`}
                          >
                            <Text field={props.fields.imprint} />
                          </Link>
                        </div> */}
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer z-50">
                          <Link
                            href="https://edge.sitecorecloud.io/arabesquefl0f70-demoproject-demoenv-79bc/media/flightbooking/Legal-Docs/Notice-Of-Passenger-Rights.pdf"
                          >
                            <Text field={props.fields.noticeOfPassenger} />
                          </Link>
                        </div>
                        <div className="text-sm font-normal text-Silvergray py-1 cursor-pointer z-50">
                          <Link
                            href="https://edge.sitecorecloud.io/arabesquefl0f70-demoproject-demoenv-79bc/media/flightbooking/Legal-Docs/Cookie-Policy.pdf"
                          >
                            <Text field={props.fields.cookiePolicy} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xl:flex md:flex xs:block justify-between items-center xl:pt-10 xs:pt-8 md:pt-6">
                  <div className="flex items-center gap-2 ">
                    <div className="text-white font-black text-xl">
                      <Text field={props.fields.followUs} />
                    </div>
                    <div className="flex gap-2">
                      <div className="cursor-pointer z-40">
                        {props.fields.twitter.value && parse(props.fields.twitter.value)}
                      </div>
                      <div className="cursor-pointer z-40">
                        {props.fields.facebook.value && parse(props.fields.facebook.value)}
                      </div>
                      <div className="cursor-pointer z-40">
                        {props.fields.instagram.value && parse(props.fields.instagram.value)}
                      </div>
                      <div className="cursor-pointer z-40">
                        {props.fields.linkedin.value && parse(props.fields.linkedin.value)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-normal text-Silvergray xl:py-0 xs:py-4">
                    <Text field={props.fields.pvtLtd} />
                  </div>
                </div>
              </div>
              <JssImage
                field={props.fields.bottomBanner}
                className="absolute bottom-0 xl:w-full z-10"
              />
            </div>
          </footer>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default withDatasourceCheck()<FooterProps>(Footer);