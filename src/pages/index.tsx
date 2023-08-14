import Layout from '@/components/Layout';
import { Text, Flex, Box, SimpleGrid, Button } from '@mantine/core';
import { useMemo } from 'react';
import Image from 'next/image';
import { config, helpers } from '@ckb-lumos/lumos';
import SporeCard from '@/components/SporeCard';
import useWalletConnect from '@/hooks/useWalletConnect';
import useAddSporeModal from '@/hooks/modal/useAddSporeModal';
import useClusterByIdQuery from '@/hooks/query/useClusterByIdQuery';
import useSporeByClusterQuery from '@/hooks/query/useSporeByClusterQuery';
import { Cluster, getCluster } from '@/utils/cluster';
import { Spore, getSpores } from '@/utils/spore';
import ShadowTitle from '@/components/ShadowTitle';

export type HomePageProps = {
  cluster: Cluster | undefined;
  spores: Spore[];
};

const id = process.env.NEXT_PUBLIC_CLUSTER_ID!;

export const getInitialProps = async () => {
  const cluster = await getCluster(id);
  const spores = await getSpores(id);
  return {
    props: { cluster, spores },
  };
};

export default function HomePage(props: HomePageProps) {
  const { connected } = useWalletConnect();
  const addSporeModal = useAddSporeModal(id as string);

  const { data: cluster } = useClusterByIdQuery(id as string, props.cluster);
  const { data: spores = [] } = useSporeByClusterQuery(
    id as string,
    props.spores,
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
            <Button onClick={addSporeModal.open}>
              Mint
            </Button>
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
        <SimpleGrid cols={4} spacing="xl">
          {spores.map((spore) => {
            return <SporeCard key={spore.id} spore={spore} />;
          })}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}
