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
    NUMBER: 'NUMBER',
    TEXT: 'TEXT',
    HTML: 'HTML'
};

export const NOTIFICATION_TYPES = {
    NEW_DISCUSSION: 'NEW_DISCUSSION', // 有新的话题
    NEW_POST: 'NEW_POST', // 话题有新的帖子
};


// 声望值的类型
// 声望的概念来自于用户在论坛中的影响力，影响力通过个人或者话题被关注，话题的置顶与否，回帖的数量等体现
// 用户的声望不能低于0，所以，如果有任何操作导致用户声望低于 0，那么都强制设置为 0。
export const REPUTATION_TYPES = {
    DISCUSSION_PINNED: 'DISCUSSION_PINNED', // 话题被置顶，奖励拥有人 20
    DISCUSSION_UNPINNED: 'DISCUSSION_UNPINNED', // 话题被取消置顶，扣除拥有人 -20
    DISCUSSION_FOLLOWED: 'DISCUSSION_FOLLOWED', // 话题被关注，奖励拥有人 2
    DISCUSSION_UNFOLLOWED: 'DISCUSSION_UNFOLLOWED', // 话题被取消关注，扣除拥有人 -2
    POST_CREATED: 'POST_CREATED', // 帖子被创建，奖励话题拥有人 10
    POST_DELETED: 'POST_DELETED', // 帖子被删除，扣除话题拥有人 -10
    REACTION_CREATED: 'REACTION_CREATED', // 帖子被反馈，奖励帖子拥有人 2
    REACTION_DELETED: 'REACTION_DELETED', // 反馈被删除，扣除帖子拥有人 -2
    USER_FOLLOWED: 'USER_FOLLOWED', // 用户被关注，奖励被关注用户 2
    USER_UNFOLLOWED: 'USER_UNFOLLOWED', // 用户被取消关注，扣除被关注用户 -2
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

