import { Spore } from '@/utils/spore';
import { BI } from '@ckb-lumos/lumos';
import { Text, AspectRatio, Card, Image, Flex, Group } from '@mantine/core';
import Link from 'next/link';

export interface SporeCardProps {
  spore: Spore;
}

export default function SporeCard({ spore }: SporeCardProps) {
  return (
    <Link
      href={`/spore/${spore.id}`}
      style={{ textDecoration: 'none' }}
      prefetch
      passHref
    >
      <Card key={spore.id} shadow="sm" radius="md" pt="0" withBorder>
        <Flex h="100%" direction="column" justify="space-between">
          <Card.Section mb="md">
            <AspectRatio ratio={1}>
              <Image alt={spore.id} src={`/api/media/${spore.id}`} />
            </AspectRatio>
          </Card.Section>
          <Group>
            <Flex direction="column">
              <Text size="sm" color="gray">
                {`${spore.id.slice(0, 10)}...${spore.id.slice(-10)}`}
              </Text>
              <Text size="sm">
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
