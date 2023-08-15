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
import Image from 'next/image';
import SporeCard from '@/components/SporeCard';
import useWalletConnect from '@/hooks/useWalletConnect';
import useAddSporeModal from '@/hooks/modal/useAddSporeModal';
import ShadowTitle from '@/components/ShadowTitle';
import SkeletonCard from '@/components/SkeletonCard';
import { Spore } from '@/spore';
import { useQuery } from 'react-query';
import { Cluster } from '@/cluster';

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

const clusterId = process.env.NEXT_PUBLIC_CLUSTER_ID!;

export default function AccountPage(props: AccountPageProps) {
  const { classes } = useStyles();
  const { address } = useWalletConnect();
  const addSporeModal = useAddSporeModal(clusterId);

  const { data: spores = [], isLoading } = useQuery(
    ['spores', address],
    async () => {
      const response = await fetch(
        `/api/spore?address=${address}&clusterId=${clusterId}`,
      );
      const data = await response.json();
      return data as Spore[];
    },
    {
      initialData: props.spores,
      refetchOnWindowFocus: true,
    },
  );

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
      {isLoading ? (
        <Box mt="114px">
          <SimpleGrid cols={4} spacing="xl" mt="24px">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))}
          </SimpleGrid>
        </Box>
      ) : (
        <>
          {spores.length > 0 ? (
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
          ) : (
            <Flex direction="column" justify="center" align="center">
              <Box mt="120px">
                <Image
                  src="/image/time-to-mint.png"
                  alt="time to mint"
                  height="200"
                  width="200"
                />
              </Box>
            </Flex>
          )}
        </>
      )}
    </Layout>
  );
}
