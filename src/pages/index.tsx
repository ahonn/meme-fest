import Layout from '@/components/Layout';
import {
  Title,
  Text,
  Flex,
  Box,
  SimpleGrid,
  createStyles,
} from '@mantine/core';
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

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.white,
    textShadow: `
      3px 0 0 ${theme.black},
      -3px 0 0 ${theme.black},
      0 3px 0 ${theme.black},
      0 -3px 0 ${theme.black},
      3px 3px 0 ${theme.black},
      3px -3px 0 ${theme.black},
      -3px 3px 0 ${theme.black},
      -3px -3px 0 ${theme.black}
    `,
    mixBlendMode: 'darken',
    fontSize: '32px',
    overflow: 'visible',
    lineHeight: '120%',
    marginBottom: '16px',
  },
}));

export default function HomePage(props: HomePageProps) {
  const { classes } = useStyles();
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
      <Flex direction="column">
        <Flex direction="column" justify="center" align="center">
          <Title order={1} className={classes.title}>
            {cluster.name}
          </Title>
          {!connected && (
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
