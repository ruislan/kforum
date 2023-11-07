'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Blank as BlankIcon } from '../icons';

export default function CategoryList({ categories }) {
    if (!categories) return null;
    return (
        <div className='flex flex-col gap-1'>
            {categories.map(c =>
                <Link key={c.slug} href={`/c/${c.slug}`} className='hover:underline underline-offset-2'>
                    <div className='flex items-center gap-1 text-sm'>
                        {c.icon ?
                            <span><Image alt={c.name} src={c.icon} className='w-4 h-4 rounded' /></span> :
                            <span className='w-5 h-5 text-gray-300 rounded' style={{ color: `${c.color}`, }}><BlankIcon /></span>
                        }
                        <span>{c.name}</span>
                    </div>
                </Link>
            )}
        </div>
    );
}
