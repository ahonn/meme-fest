import {
  useMotionValue,
  useTransform,
  useAnimationFrame,
  motion,
} from 'framer-motion';
import { wrap } from '@motionone/utils';
import { useMemo, useRef } from 'react';
import { useElementSize, useViewportSize } from '@mantine/hooks';

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

export default function ParallaxText({
  children,
  baseVelocity = 100,
}: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { width } = useViewportSize();
  const { ref, width: elementWidth } = useElementSize();

  const min = useMemo(() => (1 - width / elementWidth) * 100, [width, elementWidth]);
  console.log(min);
  const x = useTransform(baseX, (v) => `${wrap(-min, 0, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <motion.div
      ref={ref}
      style={{ x, textAlign: 'right', whiteSpace: 'nowrap' }}
    >
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <span key={`text_${index}`}>{children}</span>
        ))}
    </motion.div>
  );
}
