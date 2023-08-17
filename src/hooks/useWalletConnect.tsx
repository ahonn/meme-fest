import { Transaction, config, helpers } from '@ckb-lumos/lumos';
import { useLocalStorage } from '@mantine/hooks';
import { createContext, useCallback, useContext, useMemo } from 'react';
import superjson from 'superjson';
import useMetaMask from './useMetaMask';

const defaultValue = {
  address: '',
  connectorType: 'metamask',
};

interface Connector {
  connect(): void;
  signTransaction(
    txSkeleton: helpers.TransactionSkeletonType,
  ): Promise<Transaction>;
}

export const WalletContext = createContext({
  ...defaultValue,
  connected: false,
  update: (value: Partial<typeof defaultValue>) => {},
});

export function WalletProvider(props: { children: React.ReactNode }) {
  const [wallet, setWallet] = useLocalStorage<typeof defaultValue>({
    key: 'spore.wallet',
    defaultValue,
    serialize: superjson.stringify,
    deserialize: (str) =>
      str === undefined ? defaultValue : superjson.parse(str),
  });

  const { address, connectorType } = wallet;

  const update = useCallback(
    (values: Partial<typeof defaultValue>) => {
      setWallet({
        ...wallet,
        ...values,
      });
    },
    [setWallet, wallet],
  );

  const connected = useMemo(() => !!address, [address]);
  const store = {
    address,
    connected,
    connectorType,
    update,
  };
  return (
    <WalletContext.Provider value={store}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default function useWalletConnect() {
  const { address, connected } = useContext(WalletContext);
  const metaMask = useMetaMask();

  const lock = useMemo(() => {
    config.initializeConfig(config.predefined.AGGRON4);
    return address ? helpers.parseAddress(address) : undefined;
  }, [address]);

  const connector: Connector = useMemo(() => metaMask, [metaMask]);
  const connect = useMemo(() => connector.connect, [connector]);
  const signTransaction = useMemo(() => connector.signTransaction, [connector]);

  return {
    address,
    lock,
    connected,
    connector,
    connect,
    signTransaction,
  };
}
