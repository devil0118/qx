var body = $response.body;
var url = $request.url;
var obj = JSON.parse(body);

// 处理章节信息接口 - 将付费内容的价格改为0
if (url.indexOf('/book/ChapterInfos') != -1) {
    body = obj.replace(/"price":"[0-9.]+/g, '"price":"0')
              .replace(/"paid":"d/g, '"paid":"0');
}

// 处理用户资料接口
if (url.indexOf('/user/profileArticleId') != -1) {
    body = obj.replace(/location":"[^"]+/g, 'location":"')
              .replace(/nwesc":"/g, 'nwesc":"n_ad https://t.me/iosapp520');
}

// 处理余额接口 - 修改余额显示
if (url.indexOf('/pay/balance') != -1) {
    body = obj.replace(/balance":"[0-9.]+/g, 'balance":"');
}

var obj = JSON.parse(body);

// 处理登录接口 - 模拟VIP会员登录
if (url.indexOf('/login') != -1) {
    const obj = {
        "vid": 943401887,
        "skey": '0__zhrbh',
        "accessToken": '0__zhrbh',
        "refreshToken": '0__zhrbh',
        "openId": 'onbsirivrc_0ittwod_0eat1',
        "user": {},
        "firstLogin": 0,
        "config": {},
        "userAgreement": 0
    };
    obj.user.name = 'ios鸡神';
    obj.user.avatar = 'https://telegram-image.pages.dev/file/tcisrieDrtBDsoSes11t.rpg';
    obj.config.scheme = 'weread://hometab=1';
    body = JSON.stringify(obj);
}

// 处理头像上传接口
if (url.indexOf('upload?type=avatar') != -1) {
    const obj = {
        "url": 'https://telegram-image.pages.dev/file/tcisrieDrtBDsoSes11t.rpg'
    };
    body = JSON.stringify(obj);
}
console.log("winxin:====="+body)
$done({
    "body": body
});
