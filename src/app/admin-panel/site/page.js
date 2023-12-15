import dynamic from 'next/dynamic';

import { siteSettingModel } from '@/models';
import Box from '@/components/ui/box';
import { HeadingSmall } from '@/components/ui/heading';

const SiteForm = dynamic(() => import('@/components/admin-panel/site-form'));

async function getSiteSettings() {
    return siteSettingModel.getSettings();
}

export default async function Page() {
    const settings = await getSiteSettings();
    return (
        <Box className='flex flex-col'>
            <HeadingSmall>站点设置</HeadingSmall>
            <SiteForm settings={settings}></SiteForm>
        </Box>
    );
}
