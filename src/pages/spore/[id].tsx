import { Cluster } from '@/cluster';
import Layout from '@/components/Layout';
import ShadowTitle from '@/components/ShadowTitle';
import SporeService, { Spore } from '@/spore';
import { BI, config, helpers } from '@ckb-lumos/lumos';
import { Flex, Text, createStyles, Image, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCopy } from '@tabler/icons-react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

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

  const spores = await SporeService.shared.list(
    process.env.NEXT_PUBLIC_CLUSTER_ID!,
  );
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
  const spore = await SporeService.shared.get(id as string);
  return {
    props: { spore },
  };
};

const useStyles = createStyles(() => ({
  image: {
    maxWidth: '330px',
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
  const clipoard = useClipboard();
  const { data: spore } = useQuery(
    ['spore', id],
    async () => {
      const response = await fetch(`/api/spore/${id}`);
      const data = await response.json();
      return data as Spore;
    },
    {
      initialData: props.spore,
    },
  );

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
          <Flex mb="16px" align="center">
            <Text className={classes.id} mr="5px">
              Spore Id:
            </Text>
            <Link
              href={`https://pudge.explorer.nervos.org/transaction/${spore.cell.outPoint?.txHash}`}
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <Text color="brand.1" className={classes.id} mr="5px">
                {spore.id.slice(0, 10)}...{spore.id.slice(-10)}
              </Text>
            </Link>
            <Tooltip label={clipoard.copied ? 'Copied!' : 'Copy'}>
              <IconCopy
                size={18}
                style={{ cursor: 'pointer' }}
                onClick={() => clipoard.copy(spore.id)}
              />
            </Tooltip>
          </Flex>
          <Flex mb="16px" align="center">
            <Text className={classes.owner} mr="5px">
              Owned By:
            </Text>
            <Link href={`/${owner}`} style={{ textDecoration: 'none' }}>
              <Text
                mr="5px"
                color="brand.1"
                sx={{ cursor: 'pointer' }}
                className={classes.owner}
              >
                {owner.slice(0, 10)}...{owner.slice(-10)}
              </Text>
            </Link>
            <Tooltip label={clipoard.copied ? 'Copied!' : 'Copy'}>
              <IconCopy
                size={18}
                style={{ cursor: 'pointer' }}
                onClick={() => clipoard.copy(owner)}
              />
            </Tooltip>
          </Flex>
          <Flex>
            <Text className={classes.capacity} mr="5px">
              Capacity:
            </Text>
            <Text className={classes.capacity}>{capacity} CKB</Text>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
}
