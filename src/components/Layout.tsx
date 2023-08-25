import {
  AppShell,
  Box,
  Container,
  Flex,
  Text,
  Header,
  createStyles,
} from '@mantine/core';
import Logo from './Logo';
import Connect from './Connect';
import Marquee from './Marquee';
import Link from 'next/link';
import { useMediaQuery } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'static',
    borderBottom: 'none',
    boxShadow: Array(9)
      .fill(0)
      .map((_, index) => `${index + 1}px ${index + 1}px 0 ${theme.black}`)
      .join(','),
  },
  banner: {
    height: '70px',
    backgroundColor: theme.black,
  },
  container: {
    height: '90px',
    backgroundColor: theme.colors.brand[1],

    '@media (max-width: 48em)': {
      height: '120px',
    },
  },
}));

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const { classes } = useStyles();
  const largeScreen = useMediaQuery('(min-width: 48em)');

  return (
    <>
      <AppShell
        p="0"
        bg="background.0"
        styles={{ main: { padding: '0px', overflow: 'hidden' } }}
      >
        <Header height="160px" className={classes.header}>
          <Box className={classes.banner}>
            <Flex align="center" h="100%" w="200%">
              <Link
                style={{ textDecoration: 'none' }}
                target="_blank"
                href="https://discord.gg/ZmbbT529fQ"
              >
                <Marquee baseVelocity={3}>
                  <Text
                    component="span"
                    color="white"
                    size="24px"
                    mr="md"
                    inline
                  >
                    Click here to get more information from{' '}
                    <Text component="span" color="brand.0" inline>
                      HaCKBee
                    </Text>
                    .
                  </Text>
                </Marquee>
              </Link>
            </Flex>
          </Box>
          <Box className={classes.container}>
            <Container size="xl" h="100%">
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                justify="space-between"
                align="center"
                px={largeScreen ? '40px' : '0px'}
                py={largeScreen ? '27px' : '20px'}
              >
                <Logo />
                <Connect />
              </Flex>
            </Container>
          </Box>
        </Header>
        <Container size="xl" py="60px">
          {children}
        </Container>
      </AppShell>
    </>
  );
}
