'use client';

function FormControl({ title, subtitle, children }) {
    return (
        <div className='flex flex-col gap-1'>
            <h2 className='font-bold'>{title}</h2>
            {subtitle && <span className='text-xs text-gray-400'>{subtitle}</span>}
            {children}
        </div>
    );
}

export default FormControl;