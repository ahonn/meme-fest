import CKBConnector from '@/connectors/base';
import { defaultWalletValue, walletAtom } from '@/state/wallet';
import { Script, Transaction, config, helpers } from '@ckb-lumos/lumos';
import { useAtom } from 'jotai';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

export const ConnectContext = createContext<{
  autoConnect?: boolean;
  connectors: CKBConnector[];
}>({
  autoConnect: false,
  connectors: [],
});

export const ConnectProvider = ConnectContext.Provider;

export const useConnect = () => {
  const { connectors, autoConnect } = useContext(ConnectContext);
  const [{ address, connectorType }, setWallet] = useAtom(walletAtom);
  const connected = !!address;

  const lock = useMemo(() => {
    if (!address) return undefined;
    config.initializeConfig(config.predefined.AGGRON4);
    return helpers.parseAddress(address);
  }, [address]);

  const connector = useMemo(
    () =>
      connectors.find(
        (connector) =>
          connector.type.toLowerCase() === connectorType.toLowerCase(),
      ),
    [connectors, connectorType],
  );

  // auto connect
  useEffect(() => {
    if (address && autoConnect && !connector?.isConnected) {
      connector?.connect();
    }
  }, [autoConnect, connector, address, setWallet]);

  // clear wallet when connector is removed
  useEffect(() => {
    if (
      connectorType !== '' &&
      !connectors.some(
        (connector) =>
          connector.type.toLowerCase() === connectorType.toLowerCase(),
      )
    ) {
      setWallet(defaultWalletValue);
    }
  }, [connectors, connectorType, setWallet]);

  const connect = useCallback(async () => {
    if (connectors.length === 1) {
      const [connector] = connectors;
      await connector.connect();
    }
  }, [connectors]);

  const disconnect = useCallback(async () => {
    if (connectors.length === 1) {
      const [connector] = connectors;
      await connector.disconnect();
    }
  }, [connectors]);

  const isOwned = useCallback((lock: Script) => {
    if (!connector) {
      throw new Error(`Connector ${connectorType} not found`);
    }
    return connector.isOwned(lock);
  }, [connector, connectorType]);

  const getAnyoneCanPayLock = useCallback(() => {
    if (!connector) {
      throw new Error(`Connector ${connectorType} not found`);
    }
    const lock = connector.getAnyoneCanPayLock();
    return lock;
  }, [connector, connectorType]);

  const signTransaction = useCallback(
    async (
      txSkeleton: helpers.TransactionSkeletonType,
    ): Promise<Transaction> => {
      if (!connector) {
        throw new Error(`Connector ${connectorType} not found`);
      }
      const transaction = await connector.signTransaction(txSkeleton);
      return transaction;
    },
    [connector, connectorType],
  );

  return {
    address,
    connected,
    lock,
    connect,
    disconnect,
    isOwned,
    getAnyoneCanPayLock,
    signTransaction,
  };
};
