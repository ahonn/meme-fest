import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Notifications } from '@mantine/notifications';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ModalsProvider } from '@mantine/modals';
import { useState } from 'react';
import baseTheme from '@/theme';
import { WalletProvider } from '@/hooks/useWalletConnect';

const { publicClient } = configureChains([mainnet], [publicProvider()]);

const config = createConfig({
  autoConnect: false,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
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
          <Hydrate state={pageProps.dehydratedState}>
            <WalletProvider>
              <WagmiConfig config={config}>
                <Notifications />
                <GoogleAnalytics trackPageViews />
                <Component {...pageProps} />
              </WagmiConfig>
            </WalletProvider>
          </Hydrate>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
