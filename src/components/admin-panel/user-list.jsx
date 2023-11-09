'use client';

import { useState } from 'react';
import Box from '../ui/box';
import Button from '../ui/button';
import { HeadingSmall } from '../ui/heading';
import Spinner from '../ui/spinner';
import Image from 'next/image';
import Link from 'next/link';
import UserAvatar from '../ui/user-avatar';


export default function UserList({
    users,
    skipFirstPage = true,
    hasMore: initHasMore
}) {
    const [isLoading, setIsLoading] = useState(!skipFirstPage);
    const [dataList, setDataList] = useState([...users]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initHasMore);

    if (!users) return null;

    return (
        <Box className='flex flex-col'>
            <HeadingSmall>用户列表</HeadingSmall>
            {dataList.map(user => (
                <div key={user.id}>
                    <div className='flex items-center'>
                        <UserAvatar
                            className='mr-1.5'
                            name={user.name}
                            avatar={user.avatar}
                        />
                        <Link
                            href={`/u/${user.name}`}
                            onClick={e => e.stopPropagation()}
                            className='text-sm hover:underline underline-offset-2 cursor-pointer'>
                            u/{user.name}
                        </Link>
                    </div>
                </div>
            ))}
            {isLoading && <Spinner />}
            {hasMore && (
                <div className='self-center py-2'>
                    <Button kind='ghost' disabled={isLoading} onClick={() => setPage(prev => prev + 1)}>查看更多</Button>
                </div>
            )}
        </Box>
    );
}