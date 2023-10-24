'use client';

import clsx from 'clsx';
import { toHTML } from './tiptap';

export default function ProseContent({ content, className }) {
    return (
        <div className={clsx('prose prose-sm dark:prose-invert text-sm break-words', className)}
            dangerouslySetInnerHTML={{ __html: toHTML(content) }}>
        </div>
    );
}