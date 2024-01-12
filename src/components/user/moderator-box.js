import { userModel } from '@/models';
import Box from '../ui/box';
import { HeadingSmall } from '../ui/heading';
import clsx from 'clsx';
import Link from 'next/link';
import UserAvatar from '../ui/user-avatar';
import dateUtils from '@/lib/date-utils';


async function getModerators() {
    const moderators = await userModel.getModerators();
    return moderators;
}

export default async function ModeratorBox() {
    const moderators = await getModerators();
    return (
        <Box className={clsx('flex flex-col')}>
            <div className='flex items-center gap-4 mb-3'>
                <HeadingSmall tight>版主</HeadingSmall>
            </div>
            {
                moderators.length === 0 ?
                    <div className='text-sm text-gray-500'>暂无版主</div> :
                    <div className='flex flex-col gap-2'>
                        {moderators.map((u, index) => (
                            <div key={index} className='flex items-center gap-2'>
                                <div className='flex justify-center items-center'>
                                    <UserAvatar avatar={u.avatarUrl} name={u.name} />
                                </div>
                                <div className='flex flex-col gap-0.5 text-xs'>
                                    <div className='flex items-center'>
                                        <Link
                                            href={`/u/${u.name}`}
                                            className='font-semibold text-gray-300 hover:underline hover:underline-offset-2'
                                        >
                                            u/{u.name}
                                        </Link>
                                    </div>
                                    <span className='text-gray-400' suppressHydrationWarning>注册于 {dateUtils.fromNow(u.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
            }
        </Box>
    )
}