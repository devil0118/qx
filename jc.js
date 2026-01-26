/**

[rewrite_local]
# 匹配 juejueziapi.com 下的所有 API 请求并修改响应体
^https?:\/\/.*juejueziapi\.com\/api\/.* url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/jc.js

[mitm]
hostname = *.juejueziapi.com

 */

var body = $response.body;
var url = $request.url;

try {
    var obj = JSON.parse(body);
    console.log("juejueziapi--------");
    // 1. 修改顶层金币
    if (obj.hasOwnProperty('userAvailableCoins')) {
        obj.userAvailableCoins = 999999;
    }

    // 2. 修改用户 VIP 状态
    if (obj.user) {
        obj.user.is_traffic_active = 1;      // 激活流量/VIP状态
        obj.user.active_days = 3650;         // 有效期 10 年
        obj.user.status = 1;                 // 账号状态
        obj.user.points = 999999;            // 积分
        obj.user.invite_code = "888888";     // 靓号邀请码
        // obj.user.expired_at = "2099-12-31"; // 如果有过期时间字段，也可以加上
    }
    
    // 3. 修改公告为成功提示，验证脚本是否生效
    if (obj.notice) {
         obj.notice = [{
            "id": "vip_hack",
            "name": "脚本已生效",
            "title": "脚本已生效",
            "content": "Antigravity VIP 修改成功！",
            "show_close": 1
        }];
    }

    $done({body: JSON.stringify(obj)});
} catch (e) {
    console.log("脚本执行错误: " + e);
    $done({});
}
