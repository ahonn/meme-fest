import Layout from '@/components/Layout';
import {
  Box,
  Text,
  createStyles,
  Flex,
  SimpleGrid,
  Button,
} from '@mantine/core';
import { useMemo } from 'react';
import SporeCard from '@/components/SporeCard';
import { config, helpers } from '@ckb-lumos/lumos';
import useSporesQuery from '@/hooks/query/useSporesQuery';
import { Cluster } from '@/utils/cluster';
import { Spore } from '@/utils/spore';
import useWalletConnect from '@/hooks/useWalletConnect';
import useAddSporeModal from '@/hooks/modal/useAddSporeModal';
import ShadowTitle from '@/components/ShadowTitle';

export type AccountPageProps = {
  clusters: Cluster[];
  spores: Spore[];
};

export type AccountPageParams = {
  address: string;
};

const useStyles = createStyles((theme) => ({
  count: {
    fontSize: '32px',
    fontWeight: 'bold',
    lineHeight: 1.4,
    fontFamily: theme.headings.fontFamily,
    color: '#7E7E7E',
  },
}));

export default function AccountPage(props: AccountPageProps) {
  const { classes } = useStyles();
  const { address } = useWalletConnect();
  const sporesQuery = useSporesQuery(props.spores);
  const addSporeModal = useAddSporeModal(process.env.NEXT_PUBLIC_CLUSTER_ID!);

  const spores = useMemo(() => {
    if (!address) return [];
    return (
      sporesQuery.data?.filter(
        ({ cell }) =>
          helpers.encodeToAddress(cell.cellOutput.lock, {
            config: config.predefined.AGGRON4,
          }) === address,
      ) || []
    );
  }, [sporesQuery.data, address]);

  const displayAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 20)}...${address.slice(-20)}`;
  }, [address]);

  return (
    <Layout>
      <Flex direction="column" justify="center" align="center">
        <ShadowTitle>My Spores</ShadowTitle>
        <Text>{displayAddress}</Text>
        <Button mt="16px" onClick={addSporeModal.open}>
          Mint
        </Button>
      </Flex>
      {spores.length > 0 && (
        <Box mt="50px">
          <Text className={classes.count}>
            {spores.length} item{spores.length > 1 && 's'}
          </Text>
          <SimpleGrid cols={4} spacing="xl" mt="24px">
            {spores.map((spore) => (
              <SporeCard key={spore.id} spore={spore} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Layout>
  );
}
