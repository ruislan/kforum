import clsx from 'clsx';

import { forwardRef } from 'react';

const Textarea = forwardRef(({ className, ...props }, ref) => {
    return (
        <div className='flex items-center text-sm w-full focus:outline-none bg-neutral-800 py-2 px-3 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
            <textarea
                className={clsx(
                    'w-full text-gray-200 bg-transparent outline-none',
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});
Textarea.displayName = 'textarea';

export default Textarea;
