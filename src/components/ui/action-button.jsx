'use client';
import Button from './button';

export default function ActionButton({ onClick, children }) {
    return (<Button onClick={onClick} kind='ghost' shape='square' size='sm'><span className='w-full h-full'>{children}</span></Button>);
}