import { Spore } from '@/utils/spore';
import { BI } from '@ckb-lumos/lumos';
import {
  Text,
  Card,
  Image,
  Flex,
  Group,
  createStyles,
  AspectRatio,
} from '@mantine/core';
import Link from 'next/link';
import { getStrokeShadow } from './ShadowTitle';

export interface SporeCardProps {
  spore: Spore;
}

const useStyles = createStyles((theme) => ({
  card: {
    height: '100%',
    borderRadius: '0px',
    borderWidth: '1px',
    borderColor: theme.black,
    borderStyle: 'solid',
    boxShadow: Array(8)
      .fill(0)
      .map((_, index) => `${index + 1}px ${index + 1}px 0 ${theme.black}`)
      .join(','),
  },
  image: {
    width: '100%',
    height: '100%',

    '.mantine-Image-figure': {
      height: '100%',
    },

    '.mantine-Image-imageWrapper': {
      height: '100%',
    },
  },
}));

export default function SporeCard({ spore }: SporeCardProps) {
  const { classes } = useStyles();

  return (
    <Link
      href={`/spore/${spore.id}`}
      style={{ textDecoration: 'none' }}
      prefetch
      passHref
    >
      <Card className={classes.card} shadow="sm" radius="md" p="0">
        <Flex h="100%" direction="column" justify="space-between">
          <Card.Section px="md" sx={{ flex: 1 }}>
            <AspectRatio ratio={1}>
              <Image
                height="100%"
                className={classes.image}
                alt={spore.id}
                src={`/api/media/${spore.id}`}
              />
            </AspectRatio>
          </Card.Section>
          <Group p="32px" bg="brand.1">
            <Flex direction="column">
              <Text>{`${spore.id.slice(0, 10)}...${spore.id.slice(-10)}`}</Text>
              <Text>
                {BI.from(spore.cell.cellOutput.capacity).toNumber() / 10 ** 8}{' '}
                CKB
              </Text>
            </Flex>
          </Group>
        </Flex>
      </Card>
    </Link>
  );
}
