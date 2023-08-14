import {
  AppShell,
  Container,
  Flex,
  Group,
  Header,
  createStyles,
} from '@mantine/core';
import Logo from './Logo';
import Connect from './Connect';

const useStyles = createStyles((theme) => ({
  header: {
    height: '90px',
    backgroundColor: theme.colors.brand[1],
    borderBottom: 'none',
    boxShadow: Array(9)
      .fill(0)
      .map((_, index) => `${index + 1}px ${index + 1}px 0 ${theme.black}`)
      .join(','),
  },
}));

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const { classes } = useStyles();

  return (
    <AppShell
      padding="md"
      bg="background.0"
      header={
        <Header height="90px" className={classes.header}>
          <Container size="xl" h="100%">
            <Flex h="100%" justify="space-between" align="center" px="40px">
              <Logo />
              <Group>
                <Connect />
              </Group>
            </Flex>
          </Container>
        </Header>
      }
    >
      <Container size="xl" pt="60px">
        {children}
      </Container>
    </AppShell>
  );
}
