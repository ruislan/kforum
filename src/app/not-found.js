import Link from 'next/link';

export default function NotFound() {
    return (
        <div className='m-32 flex flex-col w-full max-w-2xl'>
            <Link href='/' className='relative font-bold text-lg text-white mr-4 flex items-center group max-w-[156px]'>
                <div className='absolute w-12 h-12 rounded-md bg-neutral-600 shadow-lg left-0 group-hover:w-full transition-[width]'></div>
                <span className='z-10 w-12 h-12 text-3xl flex justify-center items-center mr-1 group-hover:-rotate-12 transition-all duration-500'>K</span>
                <span className='z-10 text-3xl pr-3'>Forum</span>
            </Link>
            <h2 className='text-2xl font-bold mt-8 mb-4'>无法访问</h2>
            <p className='text-lg'>您访问了一个未知页面，或者该页面已经删除</p>
            <div className='flex items-center mt-4'>
                <Link href='/' className='underline underline-offset-2 font-semibold'>去首页</Link>
            </div>
        </div>
    );
}