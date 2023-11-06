import { siteSettingsModel } from '@/lib/models';

import SiteForm from '@/components/admin-panel/site-form';
import Box from '@/components/ui/box';
import { HeadingSmall } from '@/components/ui/heading';

async function getSiteSettings() {
    return siteSettingsModel.getSettings();
}

export default async function Page() {
    const settings = await getSiteSettings();
    return (
        <Box className='flex flex-col'>
            <HeadingSmall>站点设置</HeadingSmall>
            <SiteForm settings={settings}></SiteForm>
        </Box>
    )
}
