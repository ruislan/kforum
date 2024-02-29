// 前后端的通用常量都可以放这里

export const REPORT_TYPES = [
    { name: '偏离话题', description: '此帖与当前话题无关，口水贴、价值不高等。', value: 'spam' },
    { name: '违反规则', description: '此贴违反了社区规则。', value: 'rules' },
    { name: '不当言论', description: '此贴包含了脏话、威胁、仇恨、人身攻击等不当内容。', value: 'rudely' },
    { name: '侵犯权益', description: '此贴侵犯了隐私、肖像权、著作权等他人权益', value: 'infringement' },
    { name: '其他', description: '以上原因均不适合', value: 'other' },
];

export const REPORT_FILTERS = [
    { name: '待处理', value: 'pending' },
    { name: '已忽略', value: 'ignored' },
    { name: '已处理', value: 'agreed' },
    { name: '全部', value: 'all' },
];

export const SITE_SETTING_TYPES = {
    IMAGE: 'IMAGE',
    STRING: 'STRING',
    TEXT: 'TEXT',
    HTML: 'HTML'
};

export const NOTIFICATION_TYPES = {
    NEW_DISCUSSION: 'NEW_DISCUSSION', // 有新的话题
    NEW_POST: 'NEW_POST', // 话题有新的帖子
};


// 声望值的类型
export const REPUTATION_TYPES = {
    NEW_DISCUSSION: 'NEW_DISCUSSION', // 你发布了新的话题， +10
    NEW_POST: 'NEW_POST', // 你发布了新的回帖，或者你的话题有了新的回帖， +10
    NEW_REACTION: 'NEW_REACTION', // 你的帖子有新的反馈， +2
};

export const MIN_LENGTH_TITLE = 2;
export const MIN_LENGTH_CONTENT = 2;

export const DISCUSSION_SORT = ['hot', 'recent', 'oldest', 'posts'];
export const DISCUSSION_SORT_NAMES = {
    hot: '最热',
    recent: '最新',
    oldest: '最早',
    posts: '最多回帖'
};

export const POST_SORT = ['recent', 'oldest'];
export const POST_SORT_NAMES = {
    recent: '最新',
    oldest: '最早',
};

export const USER_SORT = ['recent', 'oldest'];
export const USER_SORT_NAMES = {
    recent: '最新',
    oldest: '最早',
};

