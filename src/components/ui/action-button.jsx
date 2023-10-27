'use client';
import Button from './button';

export default function ActionButton({ onClick, isActive, children, ...restProps }) {
    return (<Button onClick={onClick} kind='ghost' isActive={isActive} size='sm' shape='square' {...restProps}><span className='w-full h-full'>{children}</span></Button>);
}