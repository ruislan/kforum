import Link from "next/link";

export default async function Footer() {
    return (
        <div className='w-screen flex justify-center py-12'>
            <div className='flex flex-col-reverse md:flex-row gap-3 items-center justify-center md:gap-8 text-sm'>
                <span className='text-gray-400'>@2023 Rui. All rights reserved.</span>
                <div className='flex items-center gap-2'>
                    <Link className='text-gray-200 underline underline-offset-2' href='https://github.com/ruislan/kforum'>源码</Link>
                    <Link className='text-gray-200 underline underline-offset-2' href='#'>社区规则</Link>
                    <Link className='text-gray-200 underline underline-offset-2' href='#'>隐私声明</Link>
                </div>
            </div>
        </div>
    );
}