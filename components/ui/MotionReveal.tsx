'use client';

import React from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface MotionRevealProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView'> {
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

const buildVariants = (direction: Direction, distance: number): Variants => {
  const from: Record<Direction, { x?: number; y?: number; opacity: number }> = {
    up: { y: distance, opacity: 0 },
    down: { y: -distance, opacity: 0 },
    left: { x: distance, opacity: 0 },
    right: { x: -distance, opacity: 0 },
    none: { opacity: 0 },
  };
  return {
    hidden: from[direction],
    visible: { x: 0, y: 0, opacity: 1 },
  };
};

// Stagger children helper — spread onto container variants
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export function MotionReveal({
  children,
  direction = 'up',
  distance = 28,
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.2,
  className,
  as = 'div',
  ...rest
}: MotionRevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={buildVariants(direction, distance)}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // luxury ease-out
      }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
