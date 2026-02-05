import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex min-h-9 w-full border-green-500  px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent  file:text-sm file:font-medium file:text-white placeholder:text-white/50 placeholder:text-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#22c55e8c]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-[#9db0d0] text-[#e8eefc] border border-[#ffffff1a] bg-[#00000038] outline-none p-[12px] focus:border-[#22c55e8c] focus:drop-shadow-[0_18px_60px_#0000008c] rounded-[14px]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
