import { MantineThemeOverride } from '@mantine/core';
import { Roboto, Courier_Prime } from 'next/font/google';
import { getStrokeShadow } from './components/ShadowTitle';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
});
const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const baseTheme: MantineThemeOverride = {
  colorScheme: 'light',
  colors: {
    brand: ['#FFC43B', '#058A83', '#D54A2E'],
    background: ['#F4EBDE'],
    neutral: ['#7E7E7E'],
  },
  fontFamily: `${courierPrime.style.fontFamily}, sans-serif`,
  headings: {
    fontFamily: `${roboto.style.fontFamily}, sans-serif`,
    sizes: {
      h1: {
        fontSize: '32px',
        fontWeight: 'bold',
      },
      h2: {
        fontSize: '20px',
        fontWeight: 'normal',
      },
    },
  },
};

const components: MantineThemeOverride['components'] = {
  Button: {
    defaultProps: (theme) => ({
      sx: {
        height: '48px',
        borderRadius: '0',
        padding: '0 24px',
        boxShadow: Array(4)
          .fill(0)
          .map((_, index) => `${index + 1}px ${index + 1}px 0 ${theme.black}`)
          .join(','),
        backgroundColor: theme.colors.brand[0],

        '&:hover': {
          backgroundColor: theme.colors.brand[0],
        },

        '.mantine-Button-label': {
          height: 'auto',
          color: '#F7EEDB',
          fontSize: '20px',
          lineHeight: '20px',
          fontWeight: 'bold',
          overflow: 'visible',
          fontFamily: `${roboto.style.fontFamily}, sans-serif`,
          textShadow: getStrokeShadow(2, theme.black),
        },
      },
    }),
  },
};

const theme = {
  ...baseTheme,
  components,
};

export default theme;
