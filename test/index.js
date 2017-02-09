var weiboTimeline = require('../index.js');

var opts={
    userName:'xjchenhao',  // 用户名
    type: 1                    // 类别(0所有,1原创,4图片,6音乐,5视频,9心情)
};

weiboTimeline(opts,function(val){
    console.log(val);
});