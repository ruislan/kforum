import { siteSettingModel } from '@/models';
import Box from './ui/box';
import { HeadingSmall } from './ui/heading';

async function getSiteAbout() {
    return await siteSettingModel.getFieldValue(siteSettingModel.fields.siteAbout);
}

export default async function About() {
    const about = await getSiteAbout();
    return (
        <Box className='flex flex-col'>
            <HeadingSmall>关于</HeadingSmall>
            <div className='text-sm text-gray-100'>{about}</div>
        </Box>
    )
}
