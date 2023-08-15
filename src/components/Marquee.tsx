import {
  useMotionValue,
  useTransform,
  useAnimationFrame,
  motion,
} from 'framer-motion';
import { wrap } from '@motionone/utils';
import { useRef } from 'react';

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

export default function Marquee({
  children,
  baseVelocity = 100,
}: ParallaxProps) {
  const baseX1 = useMotionValue(0);
  const baseX2 = useMotionValue(-200);

  const x1 = useTransform(baseX1, (v) => `${wrap(-100, 100, v)}%`);
  const x2 = useTransform(baseX2, (v) => `${wrap(-200, 0, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    baseX1.set(baseX1.get() + moveBy);
    baseX2.set(baseX2.get() + moveBy);
  });

  return (
    <div style={{ display: 'flex' }}>
      <motion.div
        style={{
          x: x1,
          whiteSpace: 'nowrap',
        }}
      >
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <span key={`text_x1_${index}`}>{children}</span>
          ))}
      </motion.div>
      <motion.div
        style={{
          x: x2,
          whiteSpace: 'nowrap',
        }}
      >
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <span key={`text_x2_${index}`}>{children}</span>
          ))}
      </motion.div>
    </div>
  );
}
