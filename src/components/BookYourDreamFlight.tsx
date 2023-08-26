// import { useRouter } from 'next/router';
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

type BookYourDreamFlightProps = ComponentProps & {
  fields: {
    image1: ImageField;
    heading: Field<string>;
    content: Field<string>;
    searchFlightsButton: Field<string>;
  };
};

const BookYourDreamFlight = (props: BookYourDreamFlightProps): JSX.Element => {
  // const router = useRouter();
  const win: Window = window;

  const load = useSelector((state: RootState) => state?.loader?.loader);

  return (
    <>
      {!load?.show ? (
        <section className="dream-trip w-full bg-white md:pb-28 pb-64">
          <div className='container'>
            <div className="xl:pt-32 xl:pb-32 md:pt-28 md:pb-28 relative flex align-center">
              <div className="xl:flex md:flex xs:block items-center bg-purpal w-full rounded-3xl xs:h-auto relative md:items-center">
                <div className="xl:w-5/12 md:w-1/2  xs:w-full xl:py-20 md:py-8 lg:py-16">
                  <div className="px-6 pt-6 xl:pl-14 pb-64 md:pb-0 lg:pl-10 md:pl-8">
                    <h2 className="text-3xl xl:text-5xl md:text-4xl md:text-2xl md:mb-6 lg:mb-8 mb-5 font-bold text-black xl:leading-tight">
                      <Text field={props.fields.heading} />
                    </h2>
                    <p className="text-xl text-pearlgray md:mb-6 lg:mb-8 mb-5 leading-8">
                      <Text field={props.fields.content} />
                    </p>
                    <div>
                      <button
                        type="submit"
                        className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
                        // onClick={() => {
                        //   if (router.asPath === '/') {
                        //     // const element = document.getElementById('landing-page-search');
                        //     // if (!load?.show && element) {
                        //     //   element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        //     // }
                        //     router.push(
                        //       "https://parent.location='mailto:groups@flybeond.com?subject=Group%20Booking%20Inquiry&body=Hi%20Team%2C%0A%0AI%20am%20interested%20in%20a%20group%20booking%20with%20Beyond.%20Please%20find%20the%20following%20details%20below.%0A%0ATravel%20Agency%20Name%20(if%20applicable)%3A%20%0AIATA%20number%20(if%20applicable)%3A%0AGroup%20Name%3A%0ANumber%20of%20Passengers%3A%20%20xx%20Adult%20%2f%20xx%20Child%20(aged%205%20years%20–%20below%2012%20years%20old)%0ATravel%20Dates%3A%0AOrigin%2f%20destination%3A%0AFlight%20numbers%3A%0AContact%20details%20of%20the%20Group%20coordinator%3A%0A-%20Email%20address%3A%0A-%20Contact%20number%20(country%20code%20%2B%20area%20code%20%2B%20number)%3A'"
                        //     );
                        //   } else {
                        //     router.push(
                        //       "https://parent.location='mailto:groups@flybeond.com?subject=Group%20Booking%20Inquiry&body=Hi%20Team%2C%0A%0AI%20am%20interested%20in%20a%20group%20booking%20with%20Beyond.%20Please%20find%20the%20following%20details%20below.%0A%0ATravel%20Agency%20Name%20(if%20applicable)%3A%20%0AIATA%20number%20(if%20applicable)%3A%0AGroup%20Name%3A%0ANumber%20of%20Passengers%3A%20%20xx%20Adult%20%2f%20xx%20Child%20(aged%205%20years%20–%20below%2012%20years%20old)%0ATravel%20Dates%3A%0AOrigin%2f%20destination%3A%0AFlight%20numbers%3A%0AContact%20details%20of%20the%20Group%20coordinator%3A%0A-%20Email%20address%3A%0A-%20Contact%20number%20(country%20code%20%2B%20area%20code%20%2B%20number)%3A'"
                        //     );
                        //   }
                        // }}
                        onClick={() =>
                        (win.location =
                          'mailto:groups@flybeond.com?subject=Group%20Booking%20Inquiry&body=Hi%20Team%2C%0A%0AI%20am%20interested%20in%20a%20group%20booking%20with%20Beyond.%20Please%20find%20the%20following%20details%20below.%0A%0ATravel%20Agency%20Name%20(if%20applicable)%3A%20%0AIATA%20number%20(if%20applicable)%3A%0AGroup%20Name%3A%0ANumber%20of%20Passengers%3A%20%20xx%20Adult%20%2f%20xx%20Child%20(aged%205%20years%20–%20below%2012%20years%20old)%0ATravel%20Dates%3A%0AOrigin%2f%20destination%3A%0AFlight%20numbers%3A%0AContact%20details%20of%20the%20Group%20coordinator%3A%0A-%20Email%20address%3A%0A-%20Contact%20number%20(country%20code%20%2B%20area%20code%20%2B%20number)%3A')
                        }
                      >
                        <Text field={props.fields.searchFlightsButton} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-0 right-0 mx-auto my-0 md:top-0 md:bottom-0 xs:absolute md:right-10 md:left-auto mob-dream md:m-auto">
                <div className='rounded-3xl overflow-hidden h-full w-full'>
                  <JssImage
                    field={props.fields.image1}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default withDatasourceCheck()<BookYourDreamFlightProps>(BookYourDreamFlight);
