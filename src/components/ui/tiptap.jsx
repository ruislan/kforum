'use client';
import { Fragment, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import _ from 'lodash';

import { Dialog, Transition } from '@headlessui/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { generateHTML } from '@tiptap/html';

import Button from './button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strike,
  Heading1,
  Heading2,
  Heading3,
  BulletList,
  OrderedList,
  BlockQuote,
  Link as LinkIcon,
  Image as ImageIcon,
  Close
} from '../icons';
import { runIfFn } from '@/lib/fn';
import FormControl from './form-control';
import Input from './input';
import urlUtils from '@/lib/url-utils';

const IMAGE_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 10; // 10MB


function ImageActionButton({ editor }) {
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
        editor.chain().focus()
          .setImage({
            src: json.data.url,
            alt: json.data.originalFileName,
            title: json.data.originalFileName
          }).run();
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

  if (!editor) return null;

  return (
    <>
      <ActionButton onClick={() => imageInput.current.click()}>
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

// 设置超链接
// 条件：
// 1. 选中了超链接，点击🔗按钮
//   a. 弹出窗口。展示出链接和文字，修改文字会将超链接的文字一并修改。
// 2. 选中了文字，点击🔗按钮
//   a. 弹出窗口。展示出文字，链接填入点击确定即可。
//   b. 修改文字会将超链接的文字一并修改。
// 3. 没有任何选中，点击🔗按钮
//   a. 弹出窗口。用户填入链接和标题（可选）点击确定即可
// 说明：
// 1. 如果标题没有填写，则直接展示 URL
function LinkActionButton({ editor }) {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [nodeRange, setNodeRange] = useState({ from: 0, to: 0 });

  const resetFields = () => {
    setTitle('');
    setUrl('');
    setError(null);
  }

  const validateFields = () => {
    setError(null);
    if (!urlUtils.isURL(url)) {
      setError('不是一个正确的 URL 地址。注意空格。');
      return false;
    }
    return true;
  };

  const getLinkNode = ({ editor, pos }) => {
    const node = editor.view.domAtPos(pos).node;
    const targetNode = node.nodeType === 3 ? node.parentNode : node;
    const link = targetNode?.closest('a');
    return link;
  };

  const handleClick = async () => {
    const { from, to } = editor.state.selection;
    const linkNode = to > from ?
      getLinkNode({ editor, pos: to - 1 }) :
      getLinkNode({ editor, pos: from });
    if (linkNode) { // maybe edit
      const nodePosStart = editor.view.posAtDOM(linkNode, 0);
      const nodePosEnd = nodePosStart + linkNode.innerText.length;
      const isOnlyLink = (from === nodePosStart && to === nodePosEnd) || (from >= nodePosStart && to <= nodePosEnd);
      if (isOnlyLink) { // only link can edit
        const text = linkNode.innerText;
        const url = linkNode.getAttribute('href');
        setTitle(text);
        setUrl(url);
        setNodeRange({ from: nodePosStart, to: nodePosEnd });
        setShow(true);
        return;
      }
    }
    if (to - from === 1) { // only one char selected
      setUrl(editor.getAttributes('link').href ?? ''); // check if there is a link
    }
    // add new url
    const text = editor.state.doc.textBetween(from, to, '');
    setNodeRange({ from, to });
    setTitle(text);
    setShow(true);
  };

  const handleClose = async () => {
    resetFields();
    setShow(false);
    setTimeout(() => editor.commands.focus(), 500); // wait 1s for editor rendering
  }

  const handleOk = async () => {
    if (!validateFields()) return;
    let fixedUrl = urlUtils.fixURL(url);
    let newTitle = _.isEmpty(title) ? fixedUrl : title;
    editor.commands.deleteRange(nodeRange);
    editor.chain().focus()
      .setLink({ href: fixedUrl })
      .insertContent(newTitle)
      .run();
    resetFields();
    setShow(false);
    setTimeout(() => editor.commands.focus(), 500);
  };

  if (!editor) return null;
  return (
    <>
      <ActionButton
        isActive={editor.isActive('link')}
        onClick={handleClick}>
        <LinkIcon />
      </ActionButton>
      <Transition appear show={show} as={Fragment}>
        <Dialog className='relative z-50' onClose={handleClose}>
          <Transition.Child as={Fragment}
            enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100'
            leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-80' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child as={Fragment}
                enter='ease-out duration-300' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100'
                leave='ease-in duration-200' leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-lg bg-neutral-800 text-left align-middle shadow-xl transition-all'>
                  <div className='flex justify-end pt-4 pl-4 pr-4'>
                    <Button size='sm' kind='ghost' shape='circle' onClick={handleClose}>
                      <Close />
                    </Button>
                  </div>
                  <Dialog.Title className='text-2xl font-bold pl-8 pr-8 mb-4'>设置超链接</Dialog.Title>
                  <div className='flex flex-col pl-8 pr-8 mb-4 gap-2'>
                    <FormControl title='链接' subtitle='通常以 http 或者 https 开头'>
                      <Input value={url} onChange={e => setUrl(e.target.value)} />
                    </FormControl>
                    <FormControl title='标题' subtitle='可选'>
                      <Input value={title} onChange={e => setTitle(e.target.value)} />
                    </FormControl>
                    {error && <span className='text-sm text-red-500'>{error}</span>}
                  </div>
                  <div className='flex gap-2 justify-end px-8 mb-8 text-sm'>
                    <Button kind='outline' onClick={handleClose}>取消</Button>
                    <Button onClick={handleOk}>确定</Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function ActionButton({ isActive, onClick, ...rest }) {
  return (
    <Button
      kind='ghost'
      shape='square'
      size='sm'
      className={isActive ? 'text-gray-200' : 'text-gray-500'}
      onClick={e => {
        e.preventDefault();
        runIfFn(onClick);
      }}
      {...rest} />
  );
}

function MenuBar({ editor, endActionEnhancer }) {
  if (!editor) return null;
  return (
    <div className='flex items-center justify-between px-2 pb-2'>
      <div className='flex items-center'>
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
        <LinkActionButton
          editor={editor}
          onLinked={(url) => {
            editor
              .chain()
              .focus()
              .setLink({ href: url, target: '_blank' })
          }}
          isActive={editor.isActive('link')}
        />
        <ImageActionButton
          editor={editor}
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
        />
      </div>
      {endActionEnhancer}
    </div>
  );
}

const extensions = [
  Image, Underline,
  Link.extend({ inclusive: false }).configure({
    openOnClick: false,
  }),
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
    const html = generateHTML(json, extensions);
    return html;
  } catch (_) {
    return stringContent;
  }
}

export default function Tiptap({ content, endActionEnhancer, onCreate, onUpdate }) {
  const [isReady, setIsReady] = useState(false);
  const editor = useEditor({
    extensions,
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm py-2 px-3 focus:outline-none min-h-[96px] max-w-full',
      },
    },
    content,
    onCreate: ({ editor }) => {
      setIsReady(true);
      runIfFn(onCreate, { editor });
    },
    onUpdate: onUpdate ?? (() => { }),
  });

  return (
    <div className='flex flex-col min-h-[144px] items-center justify-center'>
      {!isReady && !content && <span className='text-sm text-gray-400'>编辑器加载中...</span>}
      <Transition appear show={isReady} as={Fragment}>
        <Transition.Child as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
        >
          <div className='w-full flex flex-col p-0 border border-solid border-neutral-700 bg-neutral-800 rounded-md focus-within:border-neutral-400'>
            <EditorContent editor={editor} />
            <MenuBar editor={editor} endActionEnhancer={endActionEnhancer} />
          </div>
        </Transition.Child>
      </Transition>
    </div>
  );
};