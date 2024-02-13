import { getServerSession } from 'next-auth';
import Link from 'next/link';

import authOptions from '@/lib/auth';
import Box from '../ui/box';
import Stats from '../ui/stats';
import { SettingsIcon } from '../icons';
import Tag from '../ui/tag';

export default async function TagInfo({ tag }) {
    const session = await getServerSession(authOptions);
    if (!tag) return null;
    return (
        <Box className='flex flex-col text-sm'>
            <div className='flex items-center mb-1'>
                <Tag
                    color={tag.textColor}
                    bgColor={tag.bgColor}
                >
                    {tag.name}
                </Tag>
                <div className='ml-4 flex items-center text-gray-400 gap-6'>
                    {(session?.user?.isAdmin || session?.user?.isModerator) && (
                        <Link
                            href={`/admin-panel/tags/${tag.id}`}
                            className='w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-50 transition-all'
                        >
                            <SettingsIcon />
                        </Link>
                    )}
                </div>
            </div>
            <div className='text-gray-400 mt-1'>t/{tag.name}</div>
            <div className='grid grid-cols-3 mt-2'>
                <Stats name='话题数' value={tag.discussionCount || 0} />
                <Stats name='创建于' value={new Date(tag.createdAt).toLocaleDateString()} />
            </div>
        </Box>
    );
}
