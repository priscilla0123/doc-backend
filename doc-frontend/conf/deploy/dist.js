module.exports = {
    from: '/',
    //本地目录
    to: '../dist',
    //include: /\/static\/.*/,    //过滤
    subOnly: true, //只移动子文件夹
    // replace: {  //对文件内容进行替换， 替换所有的域名
    //     from: "//www.baidu.com",
    //     to: "//www.tieba.com"
    // }  
};
