'use client';

import clsx from 'clsx';
import { useState, useEffect } from 'react';

import Button from './button';

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
        <div
            className={clsx(
                isVisible ? 'flex' : 'hidden',
                'items-center justify-center mt-4 sticky'
            )}
            style={{
                top: 'calc(100vh - 64px)'
            }}
        >
            <Button
                className='rounded-2xl'
                onClick={scrollToTop}
            >
                回到顶端
            </Button>
        </div>
    );
}