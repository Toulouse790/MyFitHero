import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg',
        destructive: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg',
        'destructive-ghost':
          'text-red-600 hover:bg-red-50 focus-visible:ring-red-500',
        outline: 'border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md',
        secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 hover:shadow-md',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        link: 'text-purple-600 underline-offset-4 hover:underline hover:text-purple-700',
      },
      size: {
        default: 'h-12 px-6 py-3 rounded-xl',
        sm: 'h-10 px-4 py-2 rounded-lg text-sm',
        lg: 'h-14 px-8 py-4 rounded-2xl text-base',
      },
      shape: {
        default: '',
        pill: 'rounded-full',
      },
      isIcon: {
        true: {},
        false: {},
      },
    },
    compoundVariants: [
      {
        variant: 'link',
        size: ['sm', 'lg', 'default'],
        className: 'px-0 py-0',
      },
      {
        isIcon: true,
        size: 'default',
        className: 'w-10 p-0',
      },
      {
        isIcon: true,
        size: 'sm',
        className: 'w-9 p-0',
      },
      {
        isIcon: true,
        size: 'lg',
        className: 'w-11 p-0',
      },
      {
        isIcon: true,
        shape: 'pill',
        size: 'default',
        className: 'rounded-full',
      },
      {
        isIcon: true,
        shape: 'pill',
        size: 'sm',
        className: 'rounded-full',
      },
      {
        isIcon: true,
        shape: 'pill',
        size: 'lg',
        className: 'rounded-full',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default',
      isIcon: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      isIcon,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = loading || props.disabled;

    const loaderSize = size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, isIcon, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? <Loader2 className={cn('animate-spin', loaderSize)} /> : children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
