import 'flowbite';
import Script from 'next/script';
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { I18nProvider } from 'next-localization';
import { SitecorePageProps } from 'lib/page-props';

import 'assets/main.scss';
import 'styles/globals.css';
import store from 'src/redux/store';
import 'react-intl-tel-input/dist/main.css';
import Layout from 'components/Layout/Layout';
import 'react-datepicker/dist/react-datepicker.css';

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const { dictionary, ...rest } = pageProps;

  const [mount, setMount] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    setMount(true);
    function disableForwardButton() {
      let flag: boolean,
        loop = false;
      window.addEventListener('popstate', function () {
        if (flag) {
          if (history.state && history.state.hasOwnProperty('page')) {
            loop = true;
            history.go(-1);
          } else {
            loop = false;
            history.go(-1);
          }
        } else {
          history.pushState(
            {
              page: true,
            },
            null as unknown as string,
            null
          );
        }
        flag = loop ? true : !flag;
      });

      window.onclick = function () {
        flag = false;
      };
    }
    disableForwardButton();
  }, []);

  useEffect(() => {
    const scriptCode = `
      consenTag.init({
        containerId: "79117570",
        silentMode: true
      }, true);
    `;

    if(isLoad){
      try {
        const executeScript = new Function(scriptCode);
        executeScript();
      } catch (error) {
        console.error("Error executing script:", error);
      }
    }
    const timer = setTimeout(() => {
      setIsLoad(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoad]);

  useEffect(() => {
    
    const adrollScriptCode = `
      adroll_adv_id = "HHDIC2MYFZC7NJPXQ25UIH";
      adroll_pix_id = "IMDARVLXGJEUZF5RSPKPO6";
      adroll_version = "2.0";

      (function(w, d, e, o, a) {
          w.__adroll_loaded = true;
          w.adroll = w.adroll || [];
          w.adroll.f = [ 'setProperties', 'identify', 'track' ];
          var roundtripUrl = "https://s.adroll.com/j/" + adroll_adv_id
                  + "/roundtrip.js";
          for (a = 0; a < w.adroll.f.length; a++) {
              w.adroll[w.adroll.f[a]] = w.adroll[w.adroll.f[a]] || (function(n) {
                  return function() {
                      w.adroll.push([ n, arguments ])
                  }
              })(w.adroll.f[a])
          }

          e = d.createElement('script');
          o = d.getElementsByTagName('script')[0];
          e.async = 1;
          e.src = roundtripUrl;
          o.parentNode.insertBefore(e, o);
      })(window, document);
      adroll.track("pageView");
    `;

    try {
      const executeAdrollScript = new Function(adrollScriptCode);
      executeAdrollScript();
    } catch (error) {
      console.error("Error executing script:", error);
    }
  }, []);

  useEffect(() => {
    
    const gtmScript = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-WHMT2ZS3');
    `;

    try {
      const executeAdrollScript = new Function(gtmScript);
      executeAdrollScript();
    } catch (error) {
      console.error("Error executing script:", error);
    }
  }, []);

  return (
    <>
      <Script
        id="google-pixel"
        src="https://consentag.eu/public/3.1.1/consenTag.js"
        onLoad={() => 
            // {{`consenTag.init({containerId: "79117570",silentMode: true}, true)`}}}
          setIsLoad(true)}
      />
        
      {mount && (
        <Provider store={store}>
          <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
            <Layout>
              <Component {...rest} >
              </Component>
            </Layout>
          </I18nProvider>
        </Provider>
      )}
    </>
  );
}

export default App;