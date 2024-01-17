'use client';

import { useState, useEffect } from 'react';

import { Transition } from '@headlessui/react';
import clsx from 'clsx';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        setIsVisible(window.scrollY > window.innerHeight);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Transition
            as='div'
            show={isVisible}
            appear
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            className='flex items-center justify-center mt-4 sticky'
            style={{
                top: 'calc(100vh - 64px)'
            }}
        >
            <div
                className={clsx(
                    'rounded-2xl bg-neutral-300 hover:bg-neutral-200 px-4 py-1.5',
                    'text-sm font-bold text-gray-900 cursor-pointer select-none'
                )}
                onClick={scrollToTop}
            >
                回到顶端
            </div>
        </Transition>
    );
}