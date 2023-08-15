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
import ParallaxText from './ParallaxText';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  header: {
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
  },
}));

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const { classes } = useStyles();

  return (
    <>
      <AppShell
        p="md"
        bg="background.0"
        header={
          <Header height="160px" className={classes.header}>
            <Box className={classes.banner}>
              <Flex align="center" h="100%" w="200%">
                <ParallaxText baseVelocity={5}>
                  <Text
                    component="span"
                    color="white"
                    size="24px"
                    weight="bold"
                    mr="md"
                    inline
                  >
                    Click here to get more information from{' '}
                    <Link style={{ textDecoration: 'none' }} href="/">
                      <Text component="span" color="brand.0" inline>
                        HaCKBee
                      </Text>
                    </Link>
                  </Text>
                </ParallaxText>
              </Flex>
            </Box>
            <Box className={classes.container}>
              <Container size="xl" h="100%">
                <Flex h="100%" justify="space-between" align="center" px="40px">
                  <Logo />
                  <Connect />
                </Flex>
              </Container>
            </Box>
          </Header>
        }
      >
        <Container size="xl" pt="60px">
          {children}
        </Container>
      </AppShell>
    </>
  );
}
