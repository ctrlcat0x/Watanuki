'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
} from 'motion/react';
import { cn } from '@/utils/cn';

export type SideBySideSlideProps = {
  /** Source URL for the "before" image (left / top). */
  beforeImage: string;
  /** Source URL for the "after" image (right / bottom). */
  afterImage: string;
  /** Alt text for the before image. */
  beforeAlt?: string;
  /** Alt text for the after image. */
  afterAlt?: string;
  /** Divider direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Initial divider position as a percentage (0–100). */
  initialPosition?: number;
  /** CSS color of the divider line. */
  dividerColor?: string;
  /** Width (or height for vertical) of the divider in px. */
  dividerWidth?: number;
  /** Box-shadow applied to the divider. */
  dividerShadow?: string;
  /** Whether to show the circular handle on the divider. */
  showHandle?: boolean;
  /** Diameter of the handle circle in px. */
  handleSize?: number;
  /** Background color of the handle. */
  handleColor?: string;
  /** Cursor style when hovering over the component. */
  cursor?: 'none' | 'col-resize' | 'row-resize' | 'pointer';
  /** Spring configuration for the divider animation. */
  springOptions?: SpringOptions;
  /** Extra CSS classes on the root container. */
  className?: string;
};

export function SideBySideSlide({
  beforeImage,
  afterImage,
  beforeAlt = 'Before',
  afterAlt = 'After',
  orientation = 'horizontal',
  initialPosition = 50,
  dividerColor = 'white',
  dividerWidth = 2,
  dividerShadow = '0 0 8px rgba(0,0,0,0.3)',
  showHandle = true,
  handleSize = 40,
  handleColor = 'white',
  cursor = 'col-resize',
  springOptions = { stiffness: 300, damping: 30 },
  className,
}: SideBySideSlideProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);
  const isHorizontal = orientation === 'horizontal';

  const raw = useMotionValue(initialPosition);
  const position = useSpring(raw, springOptions);

  const clipPath = useTransform(position, (v) =>
    isHorizontal ? `inset(0 ${100 - v}% 0 0)` : `inset(0 0 ${100 - v}% 0)`,
  );

  const dividerPos = useTransform(position, (v) => `${v}%`);

  const setFromClientPoint = (clientX: number, clientY: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = isHorizontal
      ? ((clientX - rect.left) / rect.width) * 100
      : ((clientY - rect.top) / rect.height) * 100;
    raw.set(Math.max(0, Math.min(100, pct)));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current && e.pointerType === 'mouse') {
      setFromClientPoint(e.clientX, e.clientY);
      return;
    }
    if (dragging.current) setFromClientPoint(e.clientX, e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    ref.current?.setPointerCapture(e.pointerId);
    setFromClientPoint(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      ref.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const handleMouseLeave = () => {
    if (dragging.current) return;
    raw.set(initialPosition);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'not-prose relative aspect-video select-none overflow-hidden rounded-xl border border-fd-border bg-[#d4d4d4]',
        className,
      )}
      style={{ cursor: isHorizontal ? cursor : cursor === 'col-resize' ? 'row-resize' : cursor }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseLeave={handleMouseLeave}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-orientation={orientation}
      tabIndex={0}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 10 : 2;
        const current = raw.get();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          raw.set(Math.max(0, current - step));
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          raw.set(Math.min(100, current + step));
        } else if (e.key === 'Home') {
          e.preventDefault();
          raw.set(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          raw.set(100);
        }
      }}
    >
      <img
        src={afterImage}
        alt={afterAlt}
        draggable={false}
        className="absolute inset-0 !m-0 block size-full border-0 object-fill p-0"
        style={{ margin: 0 }}
      />

      <motion.div className="absolute inset-0 m-0 p-0" style={{ clipPath }}>
        <img
          src={beforeImage}
          alt={beforeAlt}
          draggable={false}
          className="absolute inset-0 !m-0 block size-full border-0 object-fill p-0"
          style={{ margin: 0 }}
        />
      </motion.div>

      <motion.div
        className="absolute z-10"
        style={
          isHorizontal
            ? {
                left: dividerPos,
                top: 0,
                bottom: 0,
                width: dividerWidth,
                x: '-50%',
                backgroundColor: dividerColor,
                boxShadow: dividerShadow,
              }
            : {
                top: dividerPos,
                left: 0,
                right: 0,
                height: dividerWidth,
                y: '-50%',
                backgroundColor: dividerColor,
                boxShadow: dividerShadow,
              }
        }
      >
        {showHandle ? (
          <div
            className="absolute flex items-center justify-center rounded-full border border-fd-border/40"
            style={
              isHorizontal
                ? {
                    width: handleSize,
                    height: handleSize,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: handleColor,
                    boxShadow: dividerShadow,
                  }
                : {
                    width: handleSize,
                    height: handleSize,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: handleColor,
                    boxShadow: dividerShadow,
                  }
            }
          >
            <span className="flex gap-0.5 text-fd-muted-foreground" aria-hidden>
              <span className="h-3 w-0.5 rounded-full bg-current opacity-70" />
              <span className="h-3 w-0.5 rounded-full bg-current opacity-70" />
            </span>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}

/** Alias for `SideBySideSlide`. */
export const ImageCompare = SideBySideSlide;
export type ImageCompareProps = SideBySideSlideProps;
