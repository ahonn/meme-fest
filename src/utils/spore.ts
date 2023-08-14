import { Cell, Indexer } from '@ckb-lumos/lumos';
import {
  SporeData,
  predefinedSporeConfigs,
  createSpore as _createSpore,
  transferSpore as _transferSpore,
  destroySpore as _destroySpore,
} from '@spore-sdk/core';
import { Network } from './network';

export interface Spore {
  id: string;
  clusterId: string | null;
  content: string;
  contentType: string;
  cell: Cell;
}

export function getSporeFromCell(cell: Cell): Spore {
  const unpacked = SporeData.unpack(cell.data);
  return {
    id: cell.cellOutput.type!.args,
    content: unpacked.content,
    contentType: Buffer.from(unpacked.contentType.slice(2), 'hex').toString(),
    clusterId: unpacked.clusterId ?? null,
    cell,
  };
}

export type QueryOptions = {
  includeContent?: boolean;
  network?: Network;
}

export async function getSpores(clusterId?: string, network: Network = 'Aggron4') {
  const config = predefinedSporeConfigs[network];
  const indexer = new Indexer(config.ckbIndexerUrl);
  const collector = indexer.collector({
    type: { ...config.scripts.Spore.script, args: '0x' },
  });

  const spores: Spore[] = [];
  for await (const cell of collector.collect()) {
    const spore = getSporeFromCell(cell);
    spores.push(spore);
  }

  if (clusterId) {
    return spores.filter((spore) => spore.clusterId === clusterId);
  }
  return spores;
}

export async function getSpore(id: string) {
  const spores = await getSpores();
  return spores.find((spore) => spore.id === id);
}
