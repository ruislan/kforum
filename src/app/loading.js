import Spinner from '@/components/ui/spinner';

export default async function Loading() {

    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center'>
            <Spinner size='lg' />
            <span className='text-lg font-semibold'>请稍候，页面加载中...</span>
        </div>
    );
}