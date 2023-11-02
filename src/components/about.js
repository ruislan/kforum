import { siteSettingsModel } from '@/lib/models';
import Box from './ui/box';

async function getSiteAbout() {
    return await siteSettingsModel.getFieldValue(siteSettingsModel.fields.siteAbout);
}

export default async function About() {
    const about = await getSiteAbout();
    return (
        <Box className='flex flex-col'>
            <h3 className='text-sm text-gray-400 font-bold mb-3'>关于</h3>
            <div className='text-sm text-gray-100'>{about}</div>
        </Box>
    )
}
