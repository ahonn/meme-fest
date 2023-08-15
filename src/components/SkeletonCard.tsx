import {
  Card,
  Flex,
  createStyles,
  AspectRatio,
} from '@mantine/core';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
    backgroundColor: '#D9D9D9',
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
  info: {
    height: '113px',
  },
}));

export default function SkeletonCard() {
  const { classes } = useStyles();

  return (
    <Card className={classes.card} shadow="sm" radius="md" p="0">
      <Flex h="100%" direction="column" justify="space-between">
        <Card.Section px="md" sx={{ flex: 1 }}>
          <AspectRatio ratio={1}>
            <Skeleton
              baseColor={'#D9D9D9'}
              className={classes.skeleton}
            />
          </AspectRatio>
        </Card.Section>
        <Skeleton
          baseColor={'#D9D9D9'}
          className={classes.info}
        />
      </Flex>
    </Card>
  );
}
