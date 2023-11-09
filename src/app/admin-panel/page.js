import Spinner from '@/components/ui/spinner';
import dynamic from 'next/dynamic';

const Statistics = dynamic(() => import('@/components/admin-panel/statistics'));

export default async function Page() {

  return (
      <Statistics />
  );
}
