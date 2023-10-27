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
import { generateHTML } from '@tiptap/html';

function ActionButton({ isActive, onClick, ...rest }) {
  return <Button kind='ghost' shape='square' size='sm'
    className={isActive ? 'text-neutral-200' : 'text-neutral-500'}
    onClick={e => { e.preventDefault(); onClick(); }}
    {...rest} />;
}

function MenuBar({ editor, endActionEnhancer }) {
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
        {/* <ActionButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}>
          <LinkIcon />
        </ActionButton>
        <ActionButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}>
          <ImageIcon />
        </ActionButton> */}
      </div>
      {endActionEnhancer}
    </div>
  );
}

const extensions = [
  Image, Underline,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false, },
    orderedList: { keepMarks: true, keepAttributes: false, },
    heading: { levels: [1, 2, 3,] },
  }),
];

export function toHTML(stringContent) {
  if (!stringContent) return '';
  try {
    const json = JSON.parse(stringContent);
    return generateHTML(json, extensions);
  } catch (_) {
    return stringContent;
  }
}

export default function Tiptap({ content, endActionEnhancer, onCreate = () => { }, onUpdate = () => { } }) {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm p-3 focus:outline-none min-h-[100px] max-w-[618px]',
      },
    },
    content,
    onCreate,
    onUpdate
  });

  return (
    <div className='flex flex-col p-0 border border-solid border-neutral-700 bg-neutral-800  rounded-md focus-within:border-neutral-400'>
      <EditorContent editor={editor} />
      <MenuBar editor={editor} endActionEnhancer={endActionEnhancer} />
    </div>
  );
};