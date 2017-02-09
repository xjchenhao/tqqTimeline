'use strict';

let request = require('request');
let cheerio = require('cheerio');

let tqqTimeline = function (newOpts, callBack) {

    // 设置参数
    let opts={};

    Object.assign(opts, {
        userName: '',       //用户名
        type: 1             // 类别(0所有,1原创,4图片,6音乐,5视频,9心情)
    },newOpts);

    // 时间轴的序列
    let timeLineArr = [];
    let currentPage = 1;

    // 获取页面渲染的数据
    let reqPage = function (url) {

        request({
            url: url,
            headers: {
                'User-agent': 'spider'
            }
        }, function (error, response, html) {
            if (error) {
                console.log(error);
                return false;
            }

            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html, {decodeEntities: false});

                $('#talkList>li').each(function (index) {
                    let $this = $(this);

                    // 来自微信公众平台的微博，其实是文章的转发。过滤之。。。
                    if ($this.find('.pubInfo').find('.sico').attr('title') == '来自微信公众平台') {
                        return false;
                    }

                    // 获取页面数据
                    timeLineArr.push({
                        time: $this.find('.pubInfo').find('.time').text(),
                        from: $this.find('.pubInfo').find('.sico').attr('title'),
                        img: (function () {
                            var arr = [];

                            $this.find('.mediaWrap img').each(function () {
                                arr.push($(this).attr('crs'));
                            });
                            return arr;
                        }()),
                        content: $this.find('.msgCnt').text(),
                        map: $this.find('.areaInfo a').eq(0).text()
                    });
                });

                console.log('...正在获取第' + currentPage + '页的数据...');
                currentPage++;

                // 获取其它页的数据
                let urlParameter = $('#pageNav .pageBtn').last().attr('href');

                if (urlParameter) {
                    reqPage('http://t.qq.com/' + opts.userName + urlParameter);
                } else {
                    callBack(timeLineArr);
                }
            }
        });
    };

    reqPage('http://t.qq.com/' + opts.userName + '?filter=' + opts.type);
};

module.exports = tqqTimeline;