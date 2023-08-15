import ClusterService from '@/cluster';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const cluster = await ClusterService.shared.get(id as string);
  res.status(200).json(cluster);
});

export default router.handler();
