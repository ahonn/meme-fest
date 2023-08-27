import { createSpore } from '@spore-sdk/core';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { sendTransaction } from '@/utils/transaction';
import { Transaction } from '@ckb-lumos/lumos';
import { useConnect } from './useConnect';

export interface MutationHooks {
  onSigned?: (txSkeleton: Transaction) => void;
  onSuccess?: (hash: string) => void;
  onRefreshed?: () => void;
  onError?: (e: Error) => void;
}

export default function useAddSporeMutation(hooks?: MutationHooks) {
  const queryClient = useQueryClient();
  const { address, signTransaction } = useConnect();

  const addSpore = useCallback(
    async (...args: Parameters<typeof createSpore>) => {
      let { txSkeleton, cluster: sporeCluster } = await createSpore(...args);
      txSkeleton = txSkeleton.update('witnesses', (witnesses) => {
        return witnesses.set(sporeCluster!.inputIndex, '0x');
      });
      const signedTx = await signTransaction(txSkeleton);
      hooks?.onSigned?.(signedTx);
      const hash = await sendTransaction(signedTx);
      hooks?.onSuccess?.(hash);
      return hash;
    },
    [signTransaction, hooks],
  );

  const addSporeMutation = useMutation(addSpore, {
    onSuccess: () => {
      queryClient.invalidateQueries('spores').then(() => {
        hooks?.onRefreshed?.();
      });
      queryClient.invalidateQueries(['account', address]);
    },
    onError: (e) => {
      hooks?.onError?.(e as Error);
    },
  });

  return addSporeMutation;
}
