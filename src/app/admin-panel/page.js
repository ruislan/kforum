import dynamic from 'next/dynamic';

const Statistics = dynamic(() => import('@/components/admin-panel/statistics'));

export default async function Page() {

  return (
    <>
      <Statistics />
    </>
  )
}
