import Layout from '@/components/Layout';
import { Box, Text, createStyles, Flex, SimpleGrid } from '@mantine/core';
import { useMemo } from 'react';
import SporeCard from '@/components/SporeCard';
import { Cell, Script, helpers } from '@ckb-lumos/lumos';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import useSporesQuery from '@/hooks/query/useSporesQuery';
import { Cluster, getClusters } from '@/utils/cluster';
import { Spore, getSpores } from '@/utils/spore';
import ShadowTitle from '@/components/ShadowTitle';

export type AccountPageProps = {
  clusters: Cluster[];
  spores: Spore[];
};

export type AccountPageParams = {
  address: string;
};

export const getStaticPaths: GetStaticPaths<AccountPageParams> = async () => {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }

  const addresses = new Set<string>();
  const spores = await getSpores(process.env.NEXT_PUBLIC_CLUSTER_ID!);
  const cells = spores.map(({ cell }) => cell);
  cells.forEach((cell) => {
    addresses.add(helpers.encodeToAddress(cell.cellOutput.lock));
  });

  const paths = Array.from(addresses).map((address) => ({
    params: { address },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  AccountPageProps,
  AccountPageParams
> = async (context) => {
  const { address } = context.params!;
  const clusters = await getClusters();
  const spores = await getSpores();

  const isOwned = (lock: Script) => {
    return helpers.encodeToAddress(lock) === address;
  };

  return {
    props: {
      clusters: clusters.filter(({ cell }) => isOwned(cell.cellOutput.lock)),
      spores: spores.filter(({ cell }) => isOwned(cell.cellOutput.lock)),
    },
  };
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
  const router = useRouter();
  const { address } = router.query;
  const sporesQuery = useSporesQuery(props.spores);

  const spores = useMemo(() => {
    if (!address) return [];
    return (
      sporesQuery.data?.filter(
        ({ cell }) => helpers.encodeToAddress(cell.cellOutput.lock) === address,
      ) || []
    );
  }, [sporesQuery.data, address]);

  const displayAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  }, [address]);

  return (
    <Layout>
      <Flex direction="column" justify="center" align="center">
        <ShadowTitle>{displayAddress}</ShadowTitle>
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
