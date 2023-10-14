import React from 'react';


const variants = {
    base: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    kind: {
        default: 'bg-gray-300 text-gray-900 hover:bg-gray-300/90',
        ghost: "hover:bg-neutral-700 hover:text-neutral-300",
    },
    shape: {
        default: 'default',
        square: 'square',
    },
    size: {
        default: {
            default: 'h-10 px-6 py-2',
            xs: 'h-8 px-2',
            sm: 'h-9 px-4',
            lg: 'h-11 px-8',
        },
        square: {
            default: 'h-10 w-10 p-6',
            xs: 'h-6 w-6 p-1',
            sm: 'h-8 w-8 p-2',
            lg: 'h-9 w-9 p-4',
        }
    },
};

const Button = React.forwardRef(({ className, kind = 'default', size = 'default', shape = 'default', ...props }, ref) => {
    return (
        <button ref={ref} className={`${variants.base} ${variants.kind[kind]} ${variants.size[shape][size]} ${className || ''}`} {...props} />
    );
});
Button.displayName = 'Button';

export default Button;