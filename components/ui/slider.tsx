'use client';

import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  type HTMLAttributes,
} from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

const springs = {
  fast: { type: 'spring' as const, duration: 0.08, bounce: 0 },
  moderate: { type: 'spring' as const, duration: 0.16, bounce: 0.15 },
} as const;

// LUMORA theme colors (resolved at build-time)
const GOLD = 'hsl(43, 74%, 39%)';
const GOLD_BRIGHT = 'hsl(46, 65%, 62%)';
const PLATINUM = 'hsl(30, 5%, 89%)';
const OBSIDIAN = 'hsl(0, 0%, 10%)';
const PEARL = 'hsl(45, 29%, 97%)';

type SliderValue = number | [number, number];
type ValuePosition = 'left' | 'right' | 'top' | 'bottom' | 'tooltip';

interface SliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value: SliderValue;
  onChange: (value: SliderValue) => void;
  min?: number;
  max?: number;
  step?: number;
  showSteps?: boolean;
  showValue?: boolean;
  valuePosition?: ValuePosition;
  formatValue?: (v: number) => string;
  label?: string;
  disabled?: boolean;
}

const THUMB_SIZE = 18;
const THUMB_SIZE_REST = 14;
const TRACK_HEIGHT = 6;
const DOT_SIZE = 4;

function valueToPixel(v: number, min: number, max: number, trackWidth: number): number {
  if (max === min) return 0;
  const usable = trackWidth - THUMB_SIZE;
  return ((v - min) / (max - min)) * usable;
}

function pixelToValue(px: number, min: number, max: number, step: number, trackWidth: number): number {
  const usable = trackWidth - THUMB_SIZE;
  if (usable <= 0) return min;
  const raw = (px / usable) * (max - min) + min;
  const snapped = Math.round((raw - min) / step) * step + min;
  return Math.max(min, Math.min(max, snapped));
}

function toRadixValue(value: SliderValue): number[] {
  return Array.isArray(value) ? value : [value];
}

interface TooltipValueProps {
  value: number;
  formatValue: (v: number) => string;
  motionX: MotionValue<number>;
}

function TooltipValue({ value, formatValue, motionX }: TooltipValueProps) {
  const tooltipX = useTransform(motionX, (x) => x + THUMB_SIZE / 2);
  return (
    <motion.div
      className="absolute -translate-x-1/2 pointer-events-none z-20"
      style={{ x: tooltipX, top: -22 }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4, transition: { duration: 0.1 } }}
      transition={springs.fast}
    >
      <span
        className="text-[11px] font-medium text-pearl tabular-nums whitespace-nowrap bg-obsidian px-2 py-1 rounded-sm shadow-md"
      >
        {formatValue(value)}
      </span>
    </motion.div>
  );
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      showSteps = false,
      showValue = true,
      valuePosition = 'bottom',
      formatValue = String,
      label,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isRange = Array.isArray(value);
    const values = toRadixValue(value);

    const trackRef = useRef<HTMLDivElement>(null);
    const trackWidthRef = useRef(0);
    const hasMounted = useRef(false);
    const dragging = useRef(false);
    const activeDragThumb = useRef<number>(0);

    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [hoverThumbIndex, setHoverThumbIndex] = useState<number | null>(null);
    const [focusedThumb, setFocusedThumb] = useState<number | null>(null);

    const motionX0 = useMotionValue(0);
    const motionX1 = useMotionValue(0);

    const fillLeft = useTransform(motionX0, (x) => (isRange ? x + THUMB_SIZE / 2 : 0));
    const fillWidthSingle = useTransform(motionX0, (x) => x + THUMB_SIZE / 2);
    const fillWidthRange = useTransform(
      [motionX0, motionX1] as MotionValue<number>[],
      ([x0, x1]) => (x1 as number) - (x0 as number),
    );
    const fillWidth = isRange ? fillWidthRange : fillWidthSingle;

    useEffect(() => {
      hasMounted.current = true;
    }, []);

    useEffect(() => {
      const el = trackRef.current;
      if (!el) return;
      const ro = new ResizeObserver(([entry]) => {
        trackWidthRef.current = entry.contentRect.width;
        if (!dragging.current) {
          const px0 = valueToPixel(values[0], min, max, entry.contentRect.width);
          if (hasMounted.current) {
            animate(motionX0, px0, springs.moderate);
          } else {
            motionX0.set(px0);
          }
          if (isRange && values[1] !== undefined) {
            const px1 = valueToPixel(values[1], min, max, entry.contentRect.width);
            if (hasMounted.current) {
              animate(motionX1, px1, springs.moderate);
            } else {
              motionX1.set(px1);
            }
          }
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [min, max, isRange, values, motionX0, motionX1]);

    useEffect(() => {
      if (dragging.current) return;
      const tw = trackWidthRef.current;
      if (tw <= 0) return;
      const px0 = valueToPixel(values[0], min, max, tw);
      if (hasMounted.current) {
        animate(motionX0, px0, springs.moderate);
      } else {
        motionX0.set(px0);
      }
      if (isRange && values[1] !== undefined) {
        const px1 = valueToPixel(values[1], min, max, tw);
        if (hasMounted.current) {
          animate(motionX1, px1, springs.moderate);
        } else {
          motionX1.set(px1);
        }
      }
    }, [values, min, max, isRange, motionX0, motionX1]);

    const clampForRange = useCallback(
      (px: number, thumbIndex: number): number => {
        if (!isRange) return px;
        return thumbIndex === 0
          ? Math.min(px, motionX1.get() - THUMB_SIZE * 0.5)
          : Math.max(px, motionX0.get() + THUMB_SIZE * 0.5);
      },
      [isRange, motionX0, motionX1],
    );

    const emitChange = useCallback(
      (thumbIndex: number, newValue: number) => {
        if (isRange) {
          const newValues: [number, number] = [...(values as [number, number])];
          newValues[thumbIndex] = newValue;
          onChange(newValues);
        } else {
          onChange(newValue);
        }
      },
      [isRange, values, onChange],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const trackRect = trackRef.current?.getBoundingClientRect();
        if (!trackRect) return;
        const localX = e.clientX - trackRect.left - THUMB_SIZE / 2;
        const clamped = Math.max(0, Math.min(trackRect.width - THUMB_SIZE, localX));
        if (isRange) {
          const dist0 = Math.abs(clamped - motionX0.get());
          const dist1 = Math.abs(clamped - motionX1.get());
          activeDragThumb.current = dist0 <= dist1 ? 0 : 1;
        } else {
          activeDragThumb.current = 0;
        }
        dragging.current = true;
        setIsPressed(true);
        const motionX = activeDragThumb.current === 0 ? motionX0 : motionX1;
        const snappedValue = pixelToValue(clamped, min, max, step, trackRect.width);
        const snappedPx = valueToPixel(snappedValue, min, max, trackRect.width);
        const finalPx = clampForRange(snappedPx, activeDragThumb.current);
        animate(motionX, finalPx, springs.moderate);
        const finalValue = pixelToValue(finalPx, min, max, step, trackRect.width);
        emitChange(activeDragThumb.current, finalValue);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      },
      [disabled, isRange, min, max, step, motionX0, motionX1, clampForRange, emitChange],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        e.stopPropagation();
        const trackRect = trackRef.current?.getBoundingClientRect();
        if (!trackRect) return;
        const localX = e.clientX - trackRect.left - THUMB_SIZE / 2;
        const clamped = Math.max(0, Math.min(trackRect.width - THUMB_SIZE, localX));
        const motionX = activeDragThumb.current === 0 ? motionX0 : motionX1;
        const snappedValue = pixelToValue(clamped, min, max, step, trackRect.width);
        const snappedPx = valueToPixel(snappedValue, min, max, trackRect.width);
        const finalPx = clampForRange(snappedPx, activeDragThumb.current);
        motionX.set(finalPx);
        emitChange(activeDragThumb.current, pixelToValue(finalPx, min, max, step, trackRect.width));
      },
      [min, max, step, motionX0, motionX1, clampForRange, emitChange],
    );

    const handlePointerUp = useCallback(() => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsPressed(false);
      const tw = trackWidthRef.current;
      const motionX = activeDragThumb.current === 0 ? motionX0 : motionX1;
      const snapped = pixelToValue(motionX.get(), min, max, step, tw);
      animate(motionX, valueToPixel(snapped, min, max, tw), springs.moderate);
    }, [min, max, step, motionX0, motionX1]);

    const handleRadixChange = useCallback(
      (newValues: number[]) => {
        if (dragging.current) return;
        if (isRange) {
          onChange(newValues as [number, number]);
        } else {
          onChange(newValues[0]);
        }
      },
      [isRange, onChange],
    );

    const stepDots = showSteps
      ? Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => {
          const v = min + i * step;
          return { value: v, percent: (v - min) / (max - min) };
        })
      : [];

    const isInteracting = isHovered || isPressed;

    const valueDisplay = showValue && valuePosition !== 'tooltip' && (
      <span className="shrink-0 text-xs font-body text-obsidian/70 text-right tabular-nums">
        {label && <span className="text-obsidian/50">{label}: </span>}
        {isRange ? (
          <>
            <span className="font-medium text-obsidian">{formatValue(values[0])}</span>
            <span className="mx-1 text-obsidian/40">—</span>
            <span className="font-medium text-obsidian">{formatValue(values[1])}</span>
          </>
        ) : (
          <span className="font-medium text-obsidian">{formatValue(values[0])}</span>
        )}
      </span>
    );

    const renderVisualThumb = (index: number) => {
      const motionX = index === 0 ? motionX0 : motionX1;
      const isActive =
        hoverThumbIndex === index || (isPressed && activeDragThumb.current === index);
      return (
        <motion.span
          key={`visual-thumb-${index}`}
          className="flex items-center justify-center pointer-events-none"
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            marginTop: -THUMB_SIZE / 2,
            x: motionX,
            position: 'absolute',
            top: '50%',
            left: 0,
            zIndex: 10,
          }}
          initial={false}
          transition={springs.moderate}
          onPointerEnter={() => setHoverThumbIndex(index)}
          onPointerLeave={() => setHoverThumbIndex(null)}
        >
          <motion.span
            className="block rounded-full"
            initial={{ width: THUMB_SIZE_REST, height: THUMB_SIZE_REST }}
            animate={{
              width: isActive ? THUMB_SIZE : THUMB_SIZE_REST,
              height: isActive ? THUMB_SIZE : THUMB_SIZE_REST,
            }}
            transition={springs.fast}
            style={{
              backgroundColor: PEARL,
              boxShadow: `0 1px 4px rgba(0,0,0,0.15), 0 0 0 2px ${GOLD}`,
            }}
          />
          <motion.span
            className="absolute rounded-full border-2 pointer-events-none"
            initial={{ opacity: 0, width: THUMB_SIZE + 6, height: THUMB_SIZE + 6 }}
            animate={{
              opacity: focusedThumb === index ? 1 : 0,
              width: THUMB_SIZE + 6,
              height: THUMB_SIZE + 6,
            }}
            transition={springs.fast}
            style={{ borderColor: GOLD_BRIGHT }}
          />
        </motion.span>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-2 w-full select-none touch-none overflow-visible',
          (valuePosition === 'left' || valuePosition === 'right') &&
            'flex-row items-center gap-3',
          disabled && 'opacity-50 pointer-events-none',
          className,
        )}
        {...props}
      >
        {(valuePosition === 'top' || valuePosition === 'left') && valueDisplay}
        <div
          className="relative flex-1 overflow-visible"
          style={{
            height: THUMB_SIZE + (valuePosition === 'tooltip' ? 16 : 0),
            paddingTop: valuePosition === 'tooltip' ? 16 : 0,
          }}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          {showValue && valuePosition === 'tooltip' && (
            <AnimatePresence>
              {isInteracting && (
                <TooltipValue key="tooltip-0" value={values[0]} formatValue={formatValue} motionX={motionX0} />
              )}
              {isInteracting && isRange && values[1] !== undefined && (
                <TooltipValue key="tooltip-1" value={values[1]} formatValue={formatValue} motionX={motionX1} />
              )}
            </AnimatePresence>
          )}

          <SliderPrimitive.Root
            value={values}
            onValueChange={handleRadixChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-label={label}
            className="absolute inset-0 opacity-0 pointer-events-none"
            style={{ height: THUMB_SIZE }}
          >
            <SliderPrimitive.Track className="w-full h-full">
              <SliderPrimitive.Range />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              className="block outline-none"
              style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
              onFocus={(e) => {
                if (e.currentTarget.matches(':focus-visible')) setFocusedThumb(0);
              }}
              onBlur={() => setFocusedThumb((p) => (p === 0 ? null : p))}
            />
            {isRange && (
              <SliderPrimitive.Thumb
                className="block outline-none"
                style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                onFocus={(e) => {
                  if (e.currentTarget.matches(':focus-visible')) setFocusedThumb(1);
                }}
                onBlur={() => setFocusedThumb((p) => (p === 1 ? null : p))}
              />
            )}
          </SliderPrimitive.Root>

          <div
            ref={trackRef}
            className="relative w-full cursor-pointer py-2"
            style={{ height: THUMB_SIZE + 16 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div
              className="absolute rounded-full"
              style={{
                left: 0,
                right: 0,
                backgroundColor: PLATINUM,
                height: isInteracting ? 8 : TRACK_HEIGHT,
                top: isInteracting ? 8 + (THUMB_SIZE - 8) / 2 : 8 + (THUMB_SIZE - TRACK_HEIGHT) / 2,
                transition: 'height 80ms, top 80ms',
              }}
            >
              <motion.div
                className="absolute h-full rounded-full"
                style={{
                  left: fillLeft,
                  width: fillWidth,
                  background: `linear-gradient(90deg, ${GOLD_BRIGHT}, ${GOLD})`,
                }}
              />
            </div>

            {stepDots.map(({ value: v, percent }) => {
              const onFilled = isRange ? v >= values[0] && v <= values[1] : v <= values[0];
              return (
                <div
                  key={v}
                  className="absolute pointer-events-none flex items-center justify-center"
                  style={{
                    left: `calc(${THUMB_SIZE / 2}px + ${percent} * (100% - ${THUMB_SIZE}px))`,
                    top: '50%',
                    width: 0,
                    height: 0,
                  }}
                >
                  <motion.div
                    className="relative rounded-full flex-shrink-0 z-[6]"
                    initial={false}
                    animate={{
                      width: isHovered ? DOT_SIZE * 1.25 : DOT_SIZE,
                      height: isHovered ? DOT_SIZE * 1.25 : DOT_SIZE,
                    }}
                    transition={springs.moderate}
                    style={{ backgroundColor: onFilled ? OBSIDIAN : 'rgba(0,0,0,0.2)' }}
                  />
                </div>
              );
            })}

            {renderVisualThumb(0)}
            {isRange && renderVisualThumb(1)}
          </div>
        </div>
        {(valuePosition === 'bottom' || valuePosition === 'right') && valueDisplay}
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps, SliderValue, ValuePosition };
