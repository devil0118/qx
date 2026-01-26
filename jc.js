/**

[rewrite_local]
# 匹配 juejueziapi.com 下的所有 API 请求并修改响应体
^https?:\/\/.*juejueziapi\.com\/.* url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/jc.js

[mitm]
hostname = *.juejueziapi.com

 */

var url = $request.url;

console.log("Antigravity: 捕获到请求 " + url);

if (typeof $response === "undefined") {
    console.log("Antigravity: $response is undefined. 请检查脚本是否配置在 [rewrite_local] 或 script-response-body 下，而不是 script-request-body。");
    $done({});
    return;
}

var body = $response.body;

if (!body) {
    console.log("Antigravity: 响应体为空 (Status: " + $response.status + ")");
    $done({});
    return;
}

try {
    var obj = JSON.parse(body);

    // 1. 修改顶层金币
    if (obj.hasOwnProperty('userAvailableCoins')) {
        console.log("Antigravity: 发现 userAvailableCoins，正在修改...");
        obj.userAvailableCoins = 999999;
    }

    // 2. 修改用户 VIP 状态
    if (obj.user) {
        console.log("Antigravity: 发现 user 对象，正在修改 VIP 状态...");
        obj.user.is_traffic_active = 1;      // 激活流量/VIP状态
        obj.user.active_days = 3650;         // 有效期 10 年
        obj.user.status = 1;                 // 账号状态
        obj.user.points = 999999;            // 积分
        obj.user.invite_code = "888888";     // 靓号邀请码
    } else {
        console.log("Antigravity: 未发现 user 对象");
    }

    // 3. 修改公告为成功提示
    if (obj.notice) {
        obj.notice = [{
            "id": "vip_hack",
            "name": "脚本已生效",
            "title": "脚本已生效",
            "content": "Antigravity VIP 修改成功！",
            "show_close": 1
        }];
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    console.log("Antigravity: 脚本执行错误: " + e);
    $done({});
}

