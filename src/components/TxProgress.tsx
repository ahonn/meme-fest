import { Text, Box, Flex, Progress, createStyles } from '@mantine/core';
import { randomInt } from 'crypto';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

const useStyles = createStyles((theme) => ({
  progress: {
    width: '288px',
    borderRadius: 0,
    borderColor: theme.black,
    borderWidth: '3px',
    borderStyle: 'solid',
    overflow: 'visible',

    '.mantine-Progress-bar': {
      borderRadius: 0,
    },

    '.mantine-Progress-label': {
      position: 'absolute',
      top: '34px',
      right: '-10px',
      color: theme.black,
      fontSize: '14px',
    },
  },
}));

export type TxStatus = 'init' | 'pending' | 'success' | 'error';

export type TxProgressProps = {
  status: TxStatus;
};

export default function TxProgress(props: TxProgressProps) {
  const { classes } = useStyles();
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number>();
  const { status } = props;

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.ceil(Math.random() * 3), 99));
    }, 1000);

    return () => {
      window.clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (status !== 'pending') {
      window.clearInterval(timerRef.current);
    }
    if (status === 'success' || status === 'error') {
      setProgress(100);
    }
  }, [status]);

  const image = useMemo(() => {
    switch (status) {
      case 'pending':
        return {
          url: '/image/progress.png',
          width: 230,
          height: 153,
        };
      case 'success':
        return {
          url: '/image/success.png',
          width: 144,
          height: 135,
        };
      case 'error':
        return {
          url: '/image/error.png',
          width: 174,
          height: 173,
        };
      default:
        return {
          url: '/image/progress.png',
          width: 230,
          height: 153,
        };
    }
  }, [status]);

  return (
    <Flex h="100%" direction="column" align="center" justify="center">
      <Box mb="32px">
        <Image
          src={image.url}
          width={image.width}
          height={image.height}
          alt={`Transaction Status: ${status}`}
        />
      </Box>
      <Box mb="52px">
        <Progress
          className={classes.progress}
          size="30px"
          color={status === 'error' ? 'brand.2' : 'brand.1'}
          label={`${progress}%`}
          value={progress}
          striped
          animate
        />
      </Box>
      {status === 'pending' && (
        <Text size="16px" weight="bold">
          Transaction in progress, please do not close
        </Text>
      )}
      {status === 'success' && (
        <Text size="16px" weight="bold">
          congrate!!!
        </Text>
      )}
      {status === 'error' && (
        <Text size="16px" weight="bold">
          Sorry, please try again
        </Text>
      )}
    </Flex>
  );
}
