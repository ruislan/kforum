'use client';

import { useMemo } from 'react';

import clsx from 'clsx';
import { toHTML } from './tiptap';

const SUMMARY_LIMIT = 100;

export default function ProseContent({ content, limit = SUMMARY_LIMIT, isSummary, className }) {
    let c = useMemo(() => toHTML(content), [content]);
    if (isSummary) {
        let overflow = c.length > limit;
        c = c.substring(0, limit);
        if (overflow) c += '...';
    }
    return (
        <div className={clsx('prose prose-sm dark:prose-invert text-sm break-words', className)}
            dangerouslySetInnerHTML={{ __html: c }}>
        </div>
    );
}