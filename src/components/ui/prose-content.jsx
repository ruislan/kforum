'use client';

import { memo, useMemo } from 'react';

import clsx from 'clsx';
import { toHTML } from './tiptap';

const SUMMARY_LIMIT = 100;

function ProseContent({ content, limit = SUMMARY_LIMIT, isSummary, className }) {
    const c = useMemo(() => {
        let c = toHTML(content);
        if (isSummary) {
            let overflow = c.length > limit;
            c = c.substring(0, limit);
            if (overflow) c += '...';
        }
        return c;
    }, [content, limit, isSummary]);

    return (
        <div
            className={clsx(
                'prose prose-sm dark:prose-invert text-sm break-words',
                className
            )}
            dangerouslySetInnerHTML={{ __html: c }}>
        </div>
    );
}

export default memo(ProseContent);