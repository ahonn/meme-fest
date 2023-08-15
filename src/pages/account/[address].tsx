import Layout from '@/components/Layout';
import { Box, Text, createStyles, Flex, SimpleGrid } from '@mantine/core';
import { useMemo } from 'react';
import SporeCard from '@/components/SporeCard';
import { config, helpers } from '@ckb-lumos/lumos';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import ShadowTitle from '@/components/ShadowTitle';
import SkeletonCard from '@/components/SkeletonCard';
import SporeService, { Spore } from '@/spore';
import { useQuery } from 'react-query';

export type AccountPageProps = {
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
  const spores = await SporeService.shared.list(
    process.env.NEXT_PUBLIC_CLUSTER_ID!,
  );
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
  const lock = helpers.parseAddress(address as string, {
    config: config.predefined.AGGRON4,
  });
  const spores = await SporeService.shared.listByLock(
    lock,
    process.env.NEXT_PUBLIC_CLUSTER_ID!,
  );

  return {
    props: {
      spores,
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
  const { data: spores = [], isLoading } = useQuery(
    ['spores', address],
    async () => {
      const response = await fetch(`/api/spore?address=${address}`);
      const data = await response.json();
      return data as Spore[];
    },
    {
      initialData: props.spores,
    },
  );

  const displayAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  }, [address]);

  return (
    <Layout>
      <Flex direction="column" justify="center" align="center">
        <ShadowTitle>{displayAddress}</ShadowTitle>
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
        </>
      )}
    </Layout>
  );
}
