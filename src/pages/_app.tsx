import 'flowbite';
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

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <>
      {mount && (
        <Provider store={store}>
          <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
            <Layout>
              <Component {...rest} />
            </Layout>
          </I18nProvider>
        </Provider>
      )}
    </>
  );
}

export default App;
