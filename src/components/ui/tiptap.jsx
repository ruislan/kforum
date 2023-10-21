'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Button from './button';
import { Bold, Italic, Underline as UnderlineIcon, Strike, Heading1, Heading2, Heading3, BulletList, OrderedList, BlockQuote, Link as LinkIcon, Image as ImageIcon } from '../icons';

function ActionButton({ isActive, ...rest }) {
  return <Button kind='ghost' shape='square' size='sm' className={isActive ? 'text-neutral-200' : 'text-neutral-500'} {...rest} />;
}

function MenuBar({ editor, hasReply = false, }) {
  // const [imageURL, setImageURL] = useState('');
  const limit = 500;
  if (!editor) return null;
  return (
    <div className='flex items-center justify-between p-2'>
      <div className='flex items-center gap-1'>
        <ActionButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}>
          <Bold />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}>
          <Italic />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}>
          <Strike />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}>
          <UnderlineIcon />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}>
          <Heading1 />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}>
          <Heading2 />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}>
          <Heading3 />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}>
          <BulletList />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}>
          <OrderedList />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}>
          <BlockQuote />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}>
          <LinkIcon />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}>
          <ImageIcon />
        </ActionButton>
      </div>
      {hasReply &&
        <div className='flex items-center'>
          <Button size='sm'>
            回复
          </Button>
        </div>
      }
    </div>
  );
}

export default function Tiptap({ content, kind = 'reply' }) {
  const editor = useEditor({
    extensions: [
      Image, Underline,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false, },
        orderedList: { keepMarks: true, keepAttributes: false, },
        heading: { levels: [1, 2, 3,] },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm max-w-none p-3 focus:outline-none min-h-[100px] max-w-[618px]',
      },
    },
    //     content: `
    //     <h2>
    //       Hi there,
    //     </h2>
    //     <p>
    //       this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    //     </p>
    //     <ul>
    //       <li>
    //         That’s a bullet list with one …
    //       </li>
    //       <li>
    //         … or two list items.
    //       </li>
    //     </ul>
    //     <p>
    //       Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    //     </p>
    // <pre><code class="language-css">body {
    //   display: none;
    // }</code></pre>
    //     <p>
    //       I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    //     </p>
    //     <blockquote>
    //       Wow, that’s amazing. Good work, boy! 👏
    //       <br />
    //       — Mom
    //     </blockquote>
    //   `,
    content,
  })

  return (
    <div className='flex flex-col p-0 border border-solid border-neutral-700 bg-neutral-800  rounded-md focus-within:border-neutral-400'>
      <EditorContent editor={editor} />
      <MenuBar editor={editor} hasReply={kind === 'reply'} />
    </div>
  );
};