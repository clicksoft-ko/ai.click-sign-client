'use client';
import React from 'react';
import { Button, buttonVariants } from '../button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.FC<{ className?: string }>;
  iconClassName?: string;
  iconSide?: 'left' | 'top';
}

export default function ButtonL({
  isLoading,
  children,
  className,
  disabled,
  icon: Icon,
  iconClassName,
  iconSide,
  ...props
}: Props) {
  const { pending } = useFormStatus();
  const showLoading = isLoading || pending;

  const iconComponent = !showLoading && Icon && (
    <Icon className={cn('h-6 w-6', iconClassName)} />
  );
  const loadingComponent = showLoading && (
    <Loader2 className={cn('h-6 w-6 animate-spin', iconClassName)} />
  );

  return (
    <Button
      className={cn(
        'flex items-center',
        iconSide === 'top' ? 'flex-col gap-0.5' : 'gap-1',
        className
      )}
      disabled={disabled || showLoading}
      {...props}
    >
      {(iconComponent || loadingComponent) && (
        <div>
          {iconComponent}
          {loadingComponent}
        </div>
      )}

      <div>{children}</div>
    </Button>
  );
}
