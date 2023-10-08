import React from 'react';


const variants = {
    base: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    kind: {
        default: 'bg-gray-300 text-gray-900 hover:bg-gray-300/90',
    },
    size: {
        default: 'h-10 px-6 py-2',
        xs: 'h-8 px-2 py-2',
        sm: 'h-9 px-4',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
    },
};

const Button = React.forwardRef(({ className, kind = 'default', size = 'default', ...props }, ref) => {
    return (
        <button ref={ref} className={`${variants.base} ${variants.kind[kind]} ${variants.size[size]} ${className || ''}`} {...props} />
    );
});
Button.displayName = 'Button';

export default Button;