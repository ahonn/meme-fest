import type { AppProps } from 'next/app';
import { Provider as JotaiProvider } from 'jotai';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ModalsProvider } from '@mantine/modals';
import { useState } from 'react';
import store from '@/state/store';
import { ConnectProvider } from '@/hooks/useConnect';
import MetaMaskConnector from '@/connectors/metamask';
import baseTheme from '@/theme';
import { DefaultSeo } from 'next-seo';
import { GoogleAnalytics } from 'nextjs-google-analytics';

function StateProvider({
  children,
  pageProps,
}: React.PropsWithChildren<{
  pageProps: AppProps['pageProps'];
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <JotaiProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>{children}</Hydrate>
      </QueryClientProvider>
    </JotaiProvider>
  );
}

function UIProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <MantineProvider withNormalizeCSS theme={baseTheme}>
      <ModalsProvider
        modalProps={{
          centered: true,
          sx: {
            '.mantine-Modal-inner': {
              padding: 0,
            },
            '.mantine-Modal-content': {
              overflowY: 'visible',
              maxHeight: 'none',
            },
          },
        }}
      >
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}

const config = {
  autoConnect: true,
  connectors: [new MetaMaskConnector()],
};

function App({ Component, pageProps }: AppProps) {
  return (
    <ConnectProvider value={config}>
      <StateProvider pageProps={pageProps}>
        <UIProvider>
          <GoogleAnalytics trackPageViews />
          <DefaultSeo
            title="Meme Fest"
            description="From Tiny Cells To Epic Memes - The NFT Spore Voyage"
            themeColor={baseTheme.colors!.brand![1]}
            openGraph={{
              type: 'website',
              locale: 'en_IE',
              url: 'https://meme-fest.vercel.app',
              siteName: 'Meme Fest',
              title: 'Meme Fest',
              description:
                'From Tiny Cells To Epic Memes - The NFT Spore Voyage',
              images: [
                {
                  url: 'https://meme-fest.vercel.app/image/og-image.png',
                  width: 800,
                  height: 420,
                  alt: 'Meme Fest',
                  type: 'image/png',
                },
              ],
            }}
            twitter={{
              cardType: 'summary_large_image',
              handle: '@ha_ckbee',
            }}
          />
          <Component {...pageProps} />
        </UIProvider>
      </StateProvider>
    </ConnectProvider>
  );
}

export default App;
