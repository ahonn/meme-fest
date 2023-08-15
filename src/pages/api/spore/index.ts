import SporeService from '@/spore';
import { config, helpers } from '@ckb-lumos/lumos';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { clusterId, address } = req.query;
  if (address) {
    const lock = helpers.parseAddress(address as string, {
      config: config.predefined.AGGRON4,
    });
    const spores = await SporeService.shared.listByLock(
      lock,
      clusterId as string,
    );
    res.status(200).json(spores);
    return;
  }
  const spores = await SporeService.shared.list(clusterId as string);
  res.status(200).json(spores);
});

export default router.handler();
