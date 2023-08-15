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

export default function ParallaxText({
  children,
  baseVelocity = 100,
}: ParallaxProps) {
  const baseX = useMotionValue(0);

  const x = useTransform(baseX, (v) => `${wrap(-20, 0, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <motion.div style={{ x, width: '200%' }}>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <span key={`text_${index}`}>{children}</span>
        ))}
    </motion.div>
  );
}
