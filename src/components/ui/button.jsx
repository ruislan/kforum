import clsx from 'clsx';
import React from 'react';

const variants = {
    base: 'inline-flex whitespace-nowrap items-center justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
    kind: {
        default: 'bg-gray-300 text-gray-900 hover:bg-gray-300/90',
        ghost: "hover:bg-neutral-700 hover:text-neutral-300",
    },
    shape: {
        default: 'default',
        square: 'square',
        circle: 'circle',
    },
    size: {
        default: {
            default: 'h-10 px-6 py-2 text-sm rounded-md',
            xs: 'h-6 px-2 text-xs rounded-md',
            sm: 'h-8 px-4 text-xs rounded-md',
            lg: 'h-11 px-8 text-base rounded-md',
        },
        square: {
            default: 'h-9 w-9 p-3 text-sm rounded-md',
            xs: 'h-6 w-6 p-1 text-xs rounded-md',
            sm: 'h-8 w-8 p-2 text-xs rounded-md',
            lg: 'h-10 w-10 p-4 text-base rounded-md',
        },
        circle: {
            default: 'h-9 w-9 p-6 rounded-full',
            xs: 'h-6 w-6 p-1 text-xs rounded-full',
            sm: 'h-8 w-8 p-1 text-xs rounded-full',
            lg: 'h-10 w-10 p-3 text-base rounded-full',
        }
    },
};

const loadingVariants = {
    base: 'animate-spin text-current',
    size: {
        default: 'h-5 w-5',
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        lg: 'h-6 w-6',
    }
};

const Button = React.forwardRef(({ className, kind = 'default', size = 'default', shape = 'default', isLoading, children, ...props }, ref) => {
    return (
        <button ref={ref} className={clsx(variants.base, variants.kind[kind], variants.size[shape][size], className || '',)} {...props}>
            {isLoading ? <svg className={clsx(loadingVariants.base, loadingVariants.size[size])} fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle><path className='opacity-75' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' fill='currentColor'></path></svg> : children}
        </button>
    );
});
Button.displayName = 'Button';

export default Button;