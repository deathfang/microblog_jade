var path = require('path');

exports.config = {
    debug: true,
    name: 'iTwitter',
    description: '模仿twitter界面的demo,前端用bootstrap+twitter样式补丁，后端Node.js+mongodb',
    version: '0.0.1',

    // site settings
    site_headers: [
        '<meta name="author" content="copy Code" />'
    ],
    host: 'localhost',
    site_logo: '', // default is `name`
    site_static_host: '', // 静态文件存储域名


    db: 'mongodb://127.0.0.1/iTwitter',
    session_secret: 'iTwitter',
    auth_cookie_name: 'iTwitter',
    port: 3000,
    list_topic_count: 20
};