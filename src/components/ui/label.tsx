import * as React from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export interface ILabelProps extends VariantProps<typeof labelVariants> {
  extraLabel?: React.ReactNode;
  required?: boolean;
}

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & ILabelProps
>(({ className, extraLabel, children, required, ...props }, ref) => (
  <div className="flex items-center justify-between">
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children} {required && <span className="text-danger">*</span>}
    </LabelPrimitive.Root>
    {extraLabel && <div className="text-sm">{extraLabel}</div>}
  </div>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
