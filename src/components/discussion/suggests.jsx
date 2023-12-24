'use client';

import Box from '../ui/box';
import { HeadingSmall } from '../ui/heading';

export default function Suggests() {
    return (
        <Box className='flex flex-col text-sm font-mono'>
            <HeadingSmall>建议</HeadingSmall>
            <span>1.阅读我们的社区规则</span>
            <span>2.请使用文明用语</span>
            <span>3.做真实率真的自己</span>
            <span>4.尊重原创</span>
            <span>5.发布前搜索内容，避免发布相同内容</span>
            <span>6.避免政治话题</span>
            <span>7.避免色情、赌博等不良话题</span>
            <span>8.避免伤风败俗、违背道德等话题</span>
            <span>9.避免非法话题</span>
            <span>10.谨慎书写标题，为了保持上下文一致性，一旦发布将不允许修改</span>
        </Box>
    );
}