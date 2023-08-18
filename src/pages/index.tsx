import Layout from '@/components/Layout';
import { Text, Flex, Box, SimpleGrid, Button } from '@mantine/core';
import Image from 'next/image';
import SporeCard from '@/components/SporeCard';
import useWalletConnect from '@/hooks/useWalletConnect';
import useAddSporeModal from '@/hooks/useAddSporeModal';
import ShadowTitle from '@/components/ShadowTitle';
import SkeletonCard from '@/components/SkeletonCard';
import Connect from '@/components/Connect';
import { Spore } from '@/spore';
import { useQuery } from 'react-query';
import { Cluster } from '@/cluster';

const id = process.env.NEXT_PUBLIC_CLUSTER_ID!;

export default function HomePage() {
  const { connected } = useWalletConnect();
  const addSporeModal = useAddSporeModal(id as string);

  const { data: cluster } = useQuery(['cluster', id], async () => {
    const response = await fetch(
      `/api/cluster/${encodeURIComponent(id as string)}`,
    );
    const data = await response.json();
    return data as Cluster;
  });

  const { data: spores = [], isLoading } = useQuery(
    ['spores', id],
    async () => {
      const response = await fetch(
        `/api/spore?clusterId=${encodeURIComponent(id)}`,
      );
      const data = await response.json();
      return data as Spore[];
    },
    { refetchOnWindowFocus: true },
  );

  if (!cluster) {
    return null;
  }

  return (
    <Layout>
      <Flex direction="column">
        <Flex direction="column" justify="center" align="center">
          <ShadowTitle>{cluster.name}</ShadowTitle>
          {connected ? (
            <Button onClick={addSporeModal.open}>Mint</Button>
          ) : (
            <Text color="brand.2">Connect your wallet to start minting!!</Text>
          )}
        </Flex>
        <Box mt="50px" mb="48px">
          <Image
            src="/meme.svg"
            width="1304"
            height="135"
            alt="meme gratiffi"
            layout="responsive"
          />
        </Box>
      </Flex>

      <Box mt={20}>
        {isLoading || spores.length > 0 ? (
          <SimpleGrid
            cols={4}
            spacing="xl"
            breakpoints={[
              { maxWidth: '80rem', cols: 3 },
              { maxWidth: '60rem', cols: 2 },
              { maxWidth: '36rem', cols: 1 },
            ]}
          >
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => {
                    return <SkeletonCard key={`skeleton_${index}`} />;
                  })
              : spores.map((spore) => {
                  return <SporeCard key={spore.id} spore={spore} />;
                })}
          </SimpleGrid>
        ) : (
          <Flex
            direction="column"
            justify="center"
            align="center"
            mt="-30px"
            sx={{
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'black',
            }}
          >
            {connected ? (
              <Box mt="100px">
                <Image
                  src="/image/time-to-mint.png"
                  alt="time to mint"
                  height="200"
                  width="200"
                />
              </Box>
            ) : (
              <Box>
                <Box mt="60px">
                  <Image
                    src="/image/connect-wallet.png"
                    alt="connect wallet"
                    height="200"
                    width="200"
                  />
                </Box>
                <Text mt="28px">{"Time to mint! Wallet's calling."}</Text>
                <Box mt="50px">
                  <Connect />
                </Box>
              </Box>
            )}
          </Flex>
        )}
      </Box>
    </Layout>
  );
}
