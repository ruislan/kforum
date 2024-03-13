'use client';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className='w-screen flex justify-center py-12'>
            <div className='flex flex-col-reverse md:flex-row gap-3 items-center justify-center md:gap-8 text-sm'>
                <span className='text-gray-400'>@2024&nbsp;
                    <Link href='https://github.com/ruislan/kforum' className='underline underline-offset-2'>KForum</Link>
                    &nbsp;. Built with Love ❤️ By&nbsp;
                    <Link href='https://ruislan.com' className='underline underline-offset-2'>Rui</Link>
                </span>
                <div className='flex items-center gap-2'>
                    <Link className='text-gray-200 underline underline-offset-2' href='https://github.com/ruislan/kforum'>源码</Link>
                    <Link className='text-gray-200 underline underline-offset-2' href='#'>社区规则</Link>
                    <Link className='text-gray-200 underline underline-offset-2' href='/privacy'>隐私声明</Link>
                </div>
            </div>
        </div>
    );
}
