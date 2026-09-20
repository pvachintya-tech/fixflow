'use client';

import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import StatusQuoFrame from './frames/StatusQuoFrame';
import InterceptFrame from './frames/InterceptFrame';
import FusionFrame from './frames/FusionFrame';
import ClarityFrame from './frames/ClarityFrame';
import HandoffFrame from './frames/HandoffFrame';
import ScrollFrame from './ScrollFrame';

export default function ScrollStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  const activeIndex = Math.min(4, Math.max(0, Math.round(progress * 4)));

  const getLocalProgress = (globalProgress: number, index: number) => {
    // 5 frames -> 4 intervals of 0.25 between centers (0, 0.25, 0.5, 0.75, 1)
    const center = index * 0.25;
    const local = (globalProgress - (center - 0.125)) / 0.25;
    return Math.max(0, Math.min(1, local));
  };

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-slate-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        <ScrollFrame active={activeIndex === 0} progress={getLocalProgress(progress, 0)}>
          <StatusQuoFrame active={activeIndex === 0} progress={getLocalProgress(progress, 0)} />
        </ScrollFrame>
        
        <ScrollFrame active={activeIndex === 1} progress={getLocalProgress(progress, 1)}>
          <InterceptFrame active={activeIndex === 1} progress={getLocalProgress(progress, 1)} />
        </ScrollFrame>

        <ScrollFrame active={activeIndex === 2} progress={getLocalProgress(progress, 2)}>
          <FusionFrame active={activeIndex === 2} progress={getLocalProgress(progress, 2)} />
        </ScrollFrame>

        <ScrollFrame active={activeIndex === 3} progress={getLocalProgress(progress, 3)}>
          <ClarityFrame active={activeIndex === 3} progress={getLocalProgress(progress, 3)} />
        </ScrollFrame>

        <ScrollFrame active={activeIndex === 4} progress={getLocalProgress(progress, 4)}>
          <HandoffFrame active={activeIndex === 4} progress={getLocalProgress(progress, 4)} />
        </ScrollFrame>
        
      </div>
    </div>
  );
}
