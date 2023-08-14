import Layout from '@/components/Layout';
import ShadowTitle from '@/components/ShadowTitle';
import useSporeByIdQuery from '@/hooks/query/useSporeByIdQuery';
import { Cluster, getCluster } from '@/utils/cluster';
import { Spore, getSpore, getSpores } from '@/utils/spore';
import { BI, config, helpers } from '@ckb-lumos/lumos';
import { Flex, Text, createStyles, Image } from '@mantine/core';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

export type SporePageProps = {
  cluster?: Cluster;
  spore: Spore | undefined;
};

export type SporePageParams = {
  id: string;
};

export const getStaticPaths: GetStaticPaths<SporePageParams> = async () => {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }

  const spores = await getSpores(process.env.NEXT_PUBLIC_CLUSTER_ID!);
  const paths = spores.map(({ id }) => ({
    params: { id },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  SporePageProps,
  SporePageParams
> = async (context) => {
  const { id } = context.params!;
  const spore = await getSpore(id as string);
  const cluster = await getCluster(spore?.clusterId as string);
  if (cluster) {
    return {
      props: { cluster, spore },
    };
  }
  return {
    props: { spore },
  };
};

const useStyles = createStyles(() => ({
  image: {
    maxWidth: '660px',
  },
  id: {
    fontSize: '20px',
    lineHeight: '1.5',
    fontWeight: 'normal',
  },
  owner: {
    fontSize: '16px',
    lineHeight: '1.5',
    fontWeight: 'normal',
  },
  capacity: {
    fontSize: '20px',
    lineHeight: '1.6',
    fontWeight: 'bold',
  },
}));

export default function SporePage(props: SporePageProps) {
  const { classes } = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const { data: spore } = useSporeByIdQuery(id as string, props.spore);

  if (!spore) {
    return null;
  }

  const owner = helpers.encodeToAddress(spore.cell.cellOutput.lock, {
    config: config.predefined.AGGRON4,
  });
  const capacity = BI.from(spore.cell.cellOutput.capacity).toNumber() / 10 ** 8;

  return (
    <Layout>
      <Flex direction="column" justify="center" align="center">
        <ShadowTitle>Spore Details</ShadowTitle>
        <Image
          src={`/api/media/${spore.id}`}
          alt={spore.id}
          className={classes.image}
        />
        <Flex mt="30px" direction="column" justify="center" align="center">
          <Flex mb="16px">
            <Text className={classes.id}>Spore Id:</Text>
            <Text className={classes.id}>
              {spore.id.slice(0, 10)}...{spore.id.slice(-10)}
            </Text>
          </Flex>
          <Flex mb="16px">
            <Text className={classes.owner}>Owned By:</Text>
            <Text
              className={classes.owner}
              onClick={() => router.push(`/account/${owner}`)}
            >
              {owner.slice(0, 10)}...{owner.slice(-10)}
            </Text>
          </Flex>
          <Flex>
            <Text className={classes.capacity}>Capacity:</Text>
            <Text className={classes.capacity}>{capacity} CKB</Text>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
}
