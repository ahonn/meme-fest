import { MantineThemeOverride } from '@mantine/core';
import { Roboto, Courier_Prime } from 'next/font/google';

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
    nautral: ['#7E7E7E'],
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
        boxShadow: `4px 4px 0 ${theme.black}`,
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
          textShadow: `
            2px 0 0 ${theme.black},
            -2px 0 0 ${theme.black},
            0 2px 0 ${theme.black},
            0 -2px 0 ${theme.black},
            2px 2px 0 ${theme.black},
            2px -2px 0 ${theme.black},
            -2px -2px 0 ${theme.black},
            -2px 2px 0 ${theme.black}
          `,
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
