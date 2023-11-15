'use client';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { generateHTML } from '@tiptap/html';

import Button from './button';
import { Bold, Italic, Underline as UnderlineIcon, Strike, Heading1, Heading2, Heading3, BulletList, OrderedList, BlockQuote, Link as LinkIcon, Image as ImageIcon } from '../icons';
import { runIfFn } from '@/lib/fn';

const IMAGE_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 10; // 10MB

function ImageActionButton({ isActive, onUploaded }) {
  const imageInput = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFields = (file) => {
    if (!file || file.size === 0) {
      toast.error('你还没准备好，请先选择图片');
      return false;
    }
    if (file.size > IMAGE_UPLOAD_SIZE_LIMIT) {
      toast.error('图片大小不能超过10MB');
      return false;
    }
    return true;
  };

  const handleSubmit = async (file) => {
    if (isSubmitting) return;
    if (!validateFields(file)) return;
    setIsSubmitting(true);
    try {
      const checksum = await new Promise((resolve,) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target.result;
          const wordArray = CryptoJS.lib.WordArray.create(result);
          const hash = CryptoJS.SHA1(wordArray).toString();
          resolve(hash);
        }
        reader.readAsArrayBuffer(file);
      });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('checksum', checksum);

      const res = await fetch('/api/uploads', { method: 'POST', body: formData });

      if (res.ok) {
        const json = await res.json();
        runIfFn(onUploaded, { ...json.data });
      } else {
        if (res.status === 400) {
          const json = await res.json();
          toast.error(json.message);
        } else if (res.status === 401) {
          toast.error('您的登录已过期，请重新登录');
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      toast.error('未知错误，请稍后再试');
    } finally {
      imageInput.current.value = null;
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <ActionButton onClick={() => imageInput.current.click()} disabled={!isActive}>
        <ImageIcon />
      </ActionButton>
      <input ref={imageInput}
        type='file'
        hidden
        accept='image/*'
        onChange={e => {
          e.preventDefault();
          handleSubmit(e.target.files[0]);
        }} />
    </>
  );
}

function ActionButton({ isActive, onClick, ...rest }) {
  return <Button kind='ghost' shape='square' size='sm'
    className={isActive ? 'text-neutral-200' : 'text-neutral-500'}
    onClick={e => { e.preventDefault(); onClick(); }}
    {...rest} />;
}

function MenuBar({ editor, endActionEnhancer }) {
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
        <ImageActionButton
          // 如果我传了两个相同图片，该如何处理？
          onUploaded={(data) => {
            editor
              .chain()
              .focus()
              .setImage({
                src: data.url,
                alt: data.originalFileName,
                title: data.originalFileName
              })
              .run();
          }}
          isActive={true}
        />
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

export default function Tiptap({ content, endActionEnhancer, onCreate, onUpdate }) {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm py-2 px-3 focus:outline-none min-h-[100px] max-w-full',
      },
    },
    content,
    onCreate: onCreate ?? (() => { }),
    onUpdate: onUpdate ?? (() => { }),
  });

  return (
    <div className='flex flex-col p-0 border border-solid border-neutral-700 bg-neutral-800 rounded-md focus-within:border-neutral-400'>
      {editor ?
        <>
          <EditorContent editor={editor} />
          <MenuBar editor={editor} endActionEnhancer={endActionEnhancer} />
        </> : <>
          {/* <textarea></textarea> XXX 在editor加载出来之前，显示textarea，让用户可以输入内容*/}
        </>
      }

    </div>
  );
};