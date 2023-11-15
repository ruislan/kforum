import dynamic from 'next/dynamic';

const Statistics = dynamic(() => import('@/components/admin-panel/statistics'));
const QuickPanel = dynamic(() => import('@/components/admin-panel/quick-panel'));

export default async function Page() {

  return (
    <div className='flex flex-col gap-2'>
      <Statistics />
      <QuickPanel />
    </div>
  );
}
