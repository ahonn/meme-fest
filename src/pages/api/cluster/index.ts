import { getClusters } from '@/utils/cluster';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
  .get(async (_: NextApiRequest, res: NextApiResponse) => {
    const clusters = await getClusters();
    res.status(200).json(clusters);
  })

export default router.handler();
