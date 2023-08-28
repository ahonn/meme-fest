import Layout from '@/components/Layout';
import {
  Box,
  Text,
  createStyles,
  Flex,
  SimpleGrid,
  Button,
  Tooltip,
} from '@mantine/core';
import { useMemo } from 'react';
import Image from 'next/image';
import SporeCard from '@/components/SporeCard';
import useAddSporeModal from '@/hooks/useAddSporeModal';
import ShadowTitle from '@/components/ShadowTitle';
import SkeletonCard from '@/components/SkeletonCard';
import { Spore } from '@/spore';
import { useQuery } from 'react-query';
import { useClipboard } from '@mantine/hooks';
import { useConnect } from '@/hooks/useConnect';

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

export default function AccountPage() {
  const { classes } = useStyles();
  const clipboard = useClipboard();
  const { address } = useConnect();
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
      refetchOnWindowFocus: true,
    },
  );

  const displayAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 15)}...${address.slice(-15)}`;
  }, [address]);

  return (
    <Layout>
      <Flex direction="column" justify="center" align="center">
        <ShadowTitle>My Spores</ShadowTitle>
        <Tooltip
          label={clipboard.copied ? 'Copied!' : 'Copy'}
          position="bottom"
          withArrow
        >
          <Text
            style={{ cursor: 'pointer' }}
            onClick={() => clipboard.copy(address)}
          >
            {displayAddress}
          </Text>
        </Tooltip>
        <Button mt="16px" onClick={addSporeModal.open}>
          Mint
        </Button>
      </Flex>
      {isLoading ? (
        <Box mt="114px">
          <SimpleGrid
            cols={4}
            spacing="xl"
            mt="24px"
            breakpoints={[
              { maxWidth: '80rem', cols: 3 },
              { maxWidth: '60rem', cols: 2 },
              { maxWidth: '36rem', cols: 1 },
            ]}
          >
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
              <SimpleGrid
                cols={4}
                spacing="xl"
                mt="24px"
                breakpoints={[
                  { maxWidth: '80rem', cols: 3 },
                  { maxWidth: '60rem', cols: 2 },
                  { maxWidth: '36rem', cols: 1 },
                ]}
              >
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
