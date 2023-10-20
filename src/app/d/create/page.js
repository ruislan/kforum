import Box from "@/components/ui/box";
import SplitBall from "@/components/split-ball";
import Tiptap from "@/components/ui/tiptap";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/button";

async function getCategories() {
  // XXX flat the categories or just first level categories
  return await prisma.category.findMany({ orderBy: { sequence: 'asc' } });
}

export default async function Page({ params }) {
  const categories = await getCategories();
  return (
    <div className='flex w-full min-h-screen gap-6'>
      {/* main container */}
      <div className='flex flex-col w-[680px] gap-2'>
        <Box className='flex flex-col w-full gap-2'>
          <div className='text-sm focus:outline-none bg-neutral-800 p-3 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
            <select className='w-full text-neutral-200 bg-transparent outline-none '>
              <option>选择分类</option>
              {categories.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
          {/* input */}
          <div className='flex items-center text-sm focus:outline-none bg-neutral-800 p-3 border border-solid border-neutral-700 rounded-md focus-within:border-neutral-400'>
            <input type='text' className='w-full text-neutral-200 bg-transparent outline-none' />
            <span className='text-xs ml-2 text-neutral-500'>5/300</span>
          </div>
          <Tiptap kind='default' />
          <div className='flex justify-end'>
            <Button>发布</Button>
          </div>
        </Box>
      </div>
      {/* right side */}
      <div className='flex flex-col w-80 gap-4'>
        {/* step list */}
        <Box className='flex flex-col text-sm'>
          <span>1.Posting to Reddit</span>
          <span>2.Remember the human</span>
          <span>3.Behave like you would in real life</span>
          <span>4.Look for the original source of content</span>
          <span>5.Search for duplicates before posting</span>
          <span>6.Read the community’s rules</span>
        </Box>
      </div>
    </div>
  )
}
