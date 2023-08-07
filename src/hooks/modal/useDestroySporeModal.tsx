import {
  predefinedSporeConfigs,
  destroySpore as _destroySpore,
} from '@spore-sdk/core';
import { useCallback, useEffect } from 'react';
import { useDisclosure, useId } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { Button, Flex, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { isNotEmpty, useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import useWalletConnect from '../useWalletConnect';
import { Spore } from '@/utils/spore';
import useDestroySporeMutation from '../mutation/useDestroySporeMutation';

export default function useDestroySporeModal(spore: Spore | undefined) {
  const modalId = useId();
  const [opened, { open, close }] = useDisclosure(false);
  const { address } = useWalletConnect();
  const router = useRouter();

  const destroySporeMutation = useDestroySporeMutation();
  const loading = destroySporeMutation.isLoading;

  const form = useForm({
    initialValues: {
      to: '',
    },
    validate: {
      to: isNotEmpty('address cannot be empty'),
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!address || !spore) {
      return;
    }
    try {
      await destroySporeMutation.mutateAsync({
        outPoint: spore.cell.outPoint!,
        fromInfos: [address],
        config: predefinedSporeConfigs.Aggron4,
      });
      notifications.show({
        color: 'green',
        title: 'Farewell!',
        message: `Your spore has been destroyed.`,
      });
      if (spore.clusterId) {
        router.push(`/cluster/${spore.clusterId}`);
      } else {
        router.push('/');
      }
      close();
    } catch (e) {
      notifications.show({
        color: 'red',
        title: 'Error!',
        message: (e as Error).message,
      });
    }
  }, [address, spore, destroySporeMutation, close, router]);

  useEffect(() => {
    if (opened) {
      modals.open({
        modalId,
        title: 'Destroy spore',
        onClose: close,
        closeOnEscape: !destroySporeMutation.isLoading,
        withCloseButton: !destroySporeMutation.isLoading,
        closeOnClickOutside: !destroySporeMutation.isLoading,
        children: (
          <>
            <Text mb="md">Do you want to destroy this spore?</Text>

            <Flex direction="row" justify="flex-end">
              <Group>
                <Button
                  size="xs"
                  variant="default"
                  onClick={close}
                  disabled={destroySporeMutation.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="xs"
                  color="red"
                  onClick={handleSubmit}
                  loading={destroySporeMutation.isLoading}
                >
                  Confirm
                </Button>
              </Group>
            </Flex>
          </>
        ),
      });
    } else {
      modals.close(modalId);
    }
  }, [
    modalId,
    destroySporeMutation.isLoading,
    handleSubmit,
    opened,
    form,
    close,
  ]);

  return {
    open,
    close,
    loading,
  };
}