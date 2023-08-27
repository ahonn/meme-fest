import { predefinedSporeConfigs } from '@spore-sdk/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDisclosure, useId } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  Button,
  Group,
  Text,
  createStyles,
  Box,
  Flex,
  Image as MantineImage,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Image from 'next/image';
import useAddSporeMutation from './useAddSporeMutation';
import ShadowTitle from '@/components/ShadowTitle';
import TxProgress, { TxStatus } from '@/components/TxProgress';
import { event } from 'nextjs-google-analytics';
import { useConnect } from './useConnect';

const useStyles = createStyles((theme) => ({
  dropzone: {
    width: '928px',
    height: '423px',
  },
  preview: {
    width: '928px',
    height: '423px',
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: theme.colors.neutral[0],
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
}));

export default function useAddSporeModal(clusterId?: string) {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const { address, lock } = useConnect();
  const [content, setContent] = useState<Blob | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatus>('init');
  const [dataUrl, setDataUrl] = useState<string | ArrayBuffer | null>(null);
  const openDropzoneRef = useRef<() => void>(null);
  const modalId = useId();

  const addSporeMutation = useAddSporeMutation({
    onSigned: () => setTxStatus('pending'),
    onSuccess: () => setTxStatus('success'),
    onRefreshed: () => close(),
  });
  const loading = addSporeMutation.isLoading && !addSporeMutation.isError;

  const handleDrop: DropzoneProps['onDrop'] = useCallback((files) => {
    const [file] = files;
    setContent(file);
    setTxStatus('init');
    const reader = new window.FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setDataUrl(reader.result);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!content || !address || !lock) {
      return;
    }
    event('mint_spore', {
      message: address,
    });

    try {
      const contentBuffer = await content.arrayBuffer();
      await addSporeMutation.mutateAsync({
        data: {
          contentType: content.type,
          content: new Uint8Array(contentBuffer),
          clusterId,
        },
        fromInfos: [address],
        toLock: lock,
        config: predefinedSporeConfigs.Aggron4,
      });
      event('mint_success');
    } catch (e) {
      setTxStatus('error');
      notifications.show({
        color: 'red',
        title: 'Error!',
        message: (e as Error).message,
      });
      event('mint_error', {
        label: (e as Error).message,
      });
    }
  }, [content, address, lock, addSporeMutation, clusterId]);

  const sizeLimit = parseInt(
    process.env.NEXT_PUBLIC_MINT_SIZE_LIMIT ?? '300',
    10,
  );

  useEffect(() => {
    if (opened) {
      modals.open({
        modalId,
        size: 'xl',
        onClose: () => {
          setContent(null);
          setDataUrl(null);
          close();
        },
        closeOnEscape: !addSporeMutation.isLoading,
        withCloseButton: false,
        closeOnClickOutside: !addSporeMutation.isLoading,
        children: (
          <Box py="40px" px="50px">
            {txStatus === 'init' && (
              <Flex justify="center">
                <ShadowTitle>Add new Meme</ShadowTitle>
              </Flex>
            )}
            {dataUrl ? (
              <Box className={classes.preview}>
                {content && txStatus !== 'init' ? (
                  <TxProgress status={txStatus} />
                ) : (
                  <Box
                    sx={{ cursor: 'pointer' }}
                    onClick={() => openDropzoneRef.current?.()}
                  >
                    <MantineImage
                      height={423}
                      src={dataUrl.toString()}
                      alt="preview"
                      fit="contain"
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <Dropzone
                openRef={openDropzoneRef}
                className={classes.dropzone}
                onDrop={handleDrop}
                accept={IMAGE_MIME_TYPE}
                onReject={() => {
                  notifications.show({
                    color: 'red',
                    title: 'Error!',
                    message: `Only image files are supported, and the size cannot exceed ${sizeLimit}KB.`,
                  });
                }}
                maxSize={sizeLimit * 1000}
              >
                <Group position="center" spacing="xl">
                  <Dropzone.Idle>
                    <Flex w="654px" direction="column" align="center">
                      <Box mt="20px" mb="32px">
                        <Image
                          src="/upload-placeholder.svg"
                          width={100}
                          height={100}
                          alt="drop yout file here"
                        />
                      </Box>
                      <Text size="20px" weight="bold">
                        Drag your image here
                      </Text>
                      <Text
                        my="8px"
                        size="16px"
                        weight="bold"
                        sx={{ lineHeight: 1.5 }}
                      >
                        or
                      </Text>
                      <Button mt="8px">Upload</Button>
                      <Box mt="36px">
                        <Text size="14px" align="center">
                          {`While there's a generous ${sizeLimit}KB limit for images, don't
                          forget to factor in the CKB staking for on-chain
                          placement. We recommend keeping the image size under
                          10KB. 😉📸`}
                        </Text>
                      </Box>
                    </Flex>
                  </Dropzone.Idle>
                </Group>
              </Dropzone>
            )}
            {content && txStatus === 'init' && (
              <Group position="center" mt="60px">
                <Button
                  disabled={!content}
                  onClick={handleSubmit}
                  loading={addSporeMutation.isLoading}
                >
                  Submit
                </Button>
              </Group>
            )}
          </Box>
        ),
      });
    } else {
      modals.close(modalId);
    }
  }, [
    modalId,
    addSporeMutation.isLoading,
    content,
    handleDrop,
    handleSubmit,
    dataUrl,
    opened,
    close,
    classes.dropzone,
    classes.preview,
    sizeLimit,
    txStatus,
  ]);

  return {
    open,
    close,
    loading,
  };
}
