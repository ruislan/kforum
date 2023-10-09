import prisma from '@/lib/prisma';
import { Blank as BlankIcon } from './icons';
import Box from './box';

async function getCategory({ slug }) {
    return await prisma.category.findUnique({ where: { slug }});
}

export default async function CategoryInfo({ slug = null}) {
    const c = await getCategory({slug});
    return (
        <Box className='flex flex-col text-sm '>
            <div className='text-gray-400 font-bold mb-3'>{c.name}</div>
            <div className='text-gray-100 mb-3'>{c.description}</div>
            <div className='text-gray-400'>创建于 {c.createdAt.toLocaleDateString()}</div>
        </Box>
    );
}
