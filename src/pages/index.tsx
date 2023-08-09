import Layout from '@/components/Layout';
import {
  Title,
  Text,
  Flex,
  Button,
  Box,
  SimpleGrid,
  Alert,
} from '@mantine/core';
import { useMemo } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { config, helpers } from '@ckb-lumos/lumos';
import SporeCard from '@/components/SporeCard';
import useWalletConnect from '@/hooks/useWalletConnect';
import Link from 'next/link';
import useAddSporeModal from '@/hooks/modal/useAddSporeModal';
import useClusterByIdQuery from '@/hooks/query/useClusterByIdQuery';
import useSporeByClusterQuery from '@/hooks/query/useSporeByClusterQuery';
import { Cluster, getCluster } from '@/utils/cluster';
import { Spore, getSpores } from '@/utils/spore';

export type HomePageProps = {
  cluster: Cluster | undefined;
  spores: Spore[];
};

const id = process.env.NEXT_PUBLIC_CLUSTER_ID!;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const cluster = await getCluster(id);
  const spores = await getSpores(id);
  return {
    props: { cluster, spores },
  };
};

export default function HomePage(props: HomePageProps) {
  const { address, connected } = useWalletConnect();
  const addSporeModal = useAddSporeModal(id as string);

  const { data: cluster } = useClusterByIdQuery(id as string, props.cluster);
  const { data: spores = [] } = useSporeByClusterQuery(
    id as string,
    props.spores,
  );

  const ownerAddress = useMemo(() => {
    if (cluster) {
      return helpers.encodeToAddress(cluster.cell.cellOutput.lock);
    }
    return '';
  }, [cluster]);

  const publicCluster = useMemo(() => {
    if (cluster) {
      return (
        cluster.cell.cellOutput.lock.codeHash ===
        config.predefined.AGGRON4.SCRIPTS['ANYONE_CAN_PAY'].CODE_HASH
      );
    }
    return false;
  }, [cluster]);

  const canCreate = ownerAddress === address || publicCluster;

  if (!cluster) {
    return null;
  }

  return (
    <Layout>
      <Flex direction="row" justify="space-between" align="end">
        <Flex direction="column">
          <Title order={1}>{cluster.name}</Title>
          <Text>{cluster.description}</Text>
          <Link
            href={`/account/${ownerAddress}`}
            style={{ textDecoration: 'none' }}
          >
            <Text size="sm" color="gray">
              by {`${ownerAddress?.slice(0, 20)}...${ownerAddress?.slice(-20)}`}
            </Text>
          </Link>
        </Flex>
        {canCreate && (
          <Box style={{ cursor: connected ? 'pointer' : 'not-allowed' }}>
            <Button
              disabled={!connected}
              onClick={addSporeModal.open}
              loading={addSporeModal.loading}
            >
              Mint
            </Button>
          </Box>
        )}
      </Flex>

      {!canCreate && (
        <Alert mt="md" icon={<IconAlertCircle size="1rem" />}>
          This cluster does not belong to you, so you cannot mint a spore.
        </Alert>
      )}

      <Box mt={20}>
        <SimpleGrid cols={4}>
          {spores.map((spore) => {
            return <SporeCard key={spore.id} spore={spore} />;
          })}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}
