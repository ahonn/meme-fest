import { Text, Button, Flex, Box, createStyles } from '@mantine/core';
import useWalletConnect from '@/hooks/useWalletConnect';
import { useMemo } from 'react';
import useMetaMask from '@/hooks/useMetaMask';
import { useRouter } from 'next/router';
import { BI } from '@ckb-lumos/lumos';
import useAccountQuery from '@/hooks/query/useAccountQuery';

const useStyles = createStyles(() => ({
  text: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 'bold',
  },
  rightRaduis: {
    borderTopRightRadius: '3px',
    borderBottomRightRadius: '3px',
  },
  leftRaduis: {
    borderTopLeftRadius: '3px',
    borderBottomLeftRadius: '3px',
  },
}));

export default function Connect() {
  const { classes } = useStyles();
  const { address, connected } = useWalletConnect();
  const router = useRouter();

  // const ckbullSigner = useCKBullSigner();
  const metaMask = useMetaMask();

  const accountQuery = useAccountQuery();
  const balance = useMemo(() => {
    const capacities = BI.from(accountQuery.data?.capacities ?? 0).toNumber();
    return Math.floor(capacities / 10 ** 8);
  }, [accountQuery.data?.capacities]);

  const displayAddress = useMemo(() => {
    return connected ? `${address?.slice(0, 5)}...${address?.slice(-5)}` : '';
  }, [address, connected]);

  return (
    <>
      {connected ? (
        <Flex>
          <Box
            bg="background.0"
            px="26px"
            py="8px"
            className={classes.leftRaduis}
          >
            <Text className={classes.text}>{balance} CKB</Text>
          </Box>
          <Box
            bg="brand.0"
            px="26px"
            py="8px"
            className={classes.rightRaduis}
            sx={{ cursor: 'pointer' }}
            onClick={() => router.push(`/account/my`)}
          >
            <Text className={classes.text}>{displayAddress}</Text>
          </Box>
        </Flex>
      ) : (
        <Button onClick={metaMask.connect}>Connect Wallet</Button>
      )}
    </>
  );
}
