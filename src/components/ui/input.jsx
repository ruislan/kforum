import clsx from 'clsx';

import { forwardRef } from 'react';

const Input = forwardRef(({ className, type, ...props }, ref) => {
    return (
        <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 p-2 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
            <input
                type={type}
                className={clsx(
                    'w-full h-7 text-neutral-200 bg-transparent outline-none',
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});
Input.displayName = 'Input';

export default Input;
