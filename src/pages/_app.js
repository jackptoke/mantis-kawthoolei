import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// scroll bar
import 'simplebar/src/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// apex-chart
import 'styles/apex-chart.css';
import 'styles/react-table.css';

// next
// import { SessionProvider } from 'next-auth/react';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// third-party
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project import
import ThemeCustomization from 'themes';

import Loader from 'components/Loader';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import RTLLayout from 'components/RTLLayout';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

import { ConfigProvider } from 'contexts/ConfigContext';
import { store, persister, dispatch } from 'store';
import { fetchDashboard } from 'store/reducers/menu';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboard()).then(() => {
      setLoading(true);
    });
  }, []);

  if (!loading) return <Loader />;

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <ConfigProvider>
          <ThemeCustomization>
            <RTLLayout>
              <Locales>
                <ScrollTop>
                  <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession} refetchInterval={0}>
                    <Notistack>
                      <Snackbar />
                      {getLayout(<Component {...pageProps} />)}
                    </Notistack>
                  </SessionContextProvider>
                </ScrollTop>
              </Locales>
            </RTLLayout>
          </ThemeCustomization>
        </ConfigProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

App.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any
};
