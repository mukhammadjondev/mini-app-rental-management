'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types
export interface ActionProps {
  label: string;
  icon: ReactNode;
  onAction: () => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
}

export interface SwipeActionProps {
  children: ReactNode;
  leftAction?: ActionProps;
  rightAction?: ActionProps;
  threshold?: number;
}

// Updated SwipeContent interface to match the expected types
interface SwipeContentProps {
  children: ReactNode;
  offset: number;
  isDragging: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  containerRef: RefObject<HTMLDivElement>;
}

// Custom hook for swipe logic
const useSwipeAction = (options: {
  leftAction?: ActionProps;
  rightAction?: ActionProps;
  threshold: number;
}) => {
  const { leftAction, rightAction, threshold } = options;
  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWidth = useRef(0);

  // Update content width on resize
  useEffect(() => {
    const updateContentWidth = () => {
      if (containerRef.current) {
        contentWidth.current = containerRef.current.offsetWidth;
      }
    };

    // Initial measurement
    updateContentWidth();

    window.addEventListener('resize', updateContentWidth, { passive: true });
    return () => window.removeEventListener('resize', updateContentWidth);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;

      // Limit the swipe distance
      const maxOffset = contentWidth.current * 0.6;

      // Early return for invalid swipe directions
      if ((!leftAction && diff > 0) || (!rightAction && diff < 0)) {
        setOffset(0);
        return;
      }

      // Calculate new offset with bounds
      const newOffset = Math.max(Math.min(diff, maxOffset), -maxOffset);
      setOffset(newOffset);
    },
    [isDragging, startX, leftAction, rightAction]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);

    const thresholdDistance = contentWidth.current * threshold;

    if (offset > thresholdDistance && leftAction) {
      // Trigger left action
      leftAction.onAction();
    } else if (offset < -thresholdDistance && rightAction) {
      // Trigger right action
      rightAction.onAction();
    }

    // Reset position
    setOffset(0);
  }, [offset, threshold, leftAction, rightAction]);

  return {
    offset,
    isDragging,
    containerRef,
    handlers: {
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    },
  };
};

// Action button component
const ActionButton = memo(
  ({
    action,
    position,
  }: {
    action: ActionProps;
    position: 'left' | 'right';
  }) => (
    <Button
      variant={
        action.variant || (position === 'left' ? 'default' : 'destructive')
      }
      size="sm"
      className="h-10"
      onClick={action.onAction}
    >
      {position === 'left' && action.icon}
      <span className={position === 'left' ? 'ml-2' : 'mr-2'}>
        {action.label}
      </span>
      {position === 'right' && action.icon}
    </Button>
  )
);

ActionButton.displayName = 'ActionButton';

// Swipe content component - now with proper type definition
const SwipeContent = memo((props: SwipeContentProps) => {
  const {
    children,
    offset,
    isDragging,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    containerRef,
  } = props;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-background',
        isDragging
          ? 'transition-none'
          : 'transition-transform duration-300 ease-out'
      )}
      style={{ transform: `translateX(${offset}px)` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
});

SwipeContent.displayName = 'SwipeContent';

// Main SwipeAction component
export function SwipeAction({
  children,
  leftAction,
  rightAction,
  threshold = 0.4,
}: SwipeActionProps) {
  const { offset, isDragging, containerRef, handlers } = useSwipeAction({
    leftAction,
    rightAction,
    threshold,
  });

  return (
    <div className="relative overflow-hidden rounded-md">
      <div className="absolute inset-0 flex items-center justify-between px-2">
        {leftAction && <ActionButton action={leftAction} position="left" />}
        <div className="flex-1" />
        {rightAction && <ActionButton action={rightAction} position="right" />}
      </div>

      <SwipeContent
        offset={offset}
        isDragging={isDragging}
        onTouchStart={handlers.handleTouchStart}
        onTouchMove={handlers.handleTouchMove}
        onTouchEnd={handlers.handleTouchEnd}
        containerRef={containerRef!}
      >
        {children}
      </SwipeContent>
    </div>
  );
}
