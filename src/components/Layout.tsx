import { AppShell, Container, Flex, Group, Header } from '@mantine/core';
import Logo from './Logo';
import Connect from './Connect';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          <Container>
            <Flex justify="space-between" align="center">
              <Logo />
              <Group>
                <Connect />
              </Group>
            </Flex>
          </Container>
        </Header>
      }
    >
      <Container>{children}</Container>
    </AppShell>
  );
}
