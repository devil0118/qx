/*
[rewrite_local]
^https?:\/\/online\.altovate\.xyz\/api\/v1\/?$ url script-response-body vpn_debug.js

[mitm]
hostname = online.altovate.xyz
*/

var body = $response.body;
var obj = {};

try {
    obj = JSON.parse(body);
    console.log("🟢 [VPN Debug] 收到原始数据，长度: " + body.length);

    // ===================================
    // 1. 生成未来时间戳
    // ===================================
    var now = Date.now() / 1000;
    var tenYearsLater = now + 315360000; 
    var vipTimeStr = tenYearsLater.toFixed(5); // 类似 "1985678123.12345"

    // ===================================
    // 2. 修改服务器列表
    // ===================================
    if (obj.hasOwnProperty("servers") && Array.isArray(obj.servers)) {
        console.log("🔵 [VPN Debug] 检测到服务器列表，正在解锁...");
        obj.servers.forEach(function(server) {
            server.free = true;
            server.price = 0;
            if (server.stream_url) server.p2p_allowed = true;
        });
        if (obj.stream_servers) {
             obj.stream_servers.forEach(function(s) { s.free = true; });
        }
    }

    // ===================================
    // 3. 修改账户状态
    // ===================================
    function makeVip(target, label) {
        if (!target) return;
        console.log("🟠 [VPN Debug] 正在修改账户状态 (" + label + ")...");
        
        target.expired_timestamp = vipTimeStr;
        target.md_lifetime = true;
        target.trial_period = true;
        target.subscription_type = "lifetime";
        
        if (!target.modules) target.modules = {};
        target.modules.proto_rotator = true;
        target.modules.firewall = true;

        if (!target.trial_statuses) target.trial_statuses = {};
        target.trial_statuses.store_trial_purchase = true;
        target.trial_statuses.ks_trial = true;
    }

    // 分支判断
    if (obj.data) {
        makeVip(obj.data, "v2_full");
    } else if (obj.hasOwnProperty("store_trial_purchase") || obj.hasOwnProperty("ks_trial") || obj.hasOwnProperty("expired_timestamp")) {
        makeVip(obj, "short");
    }

    // ===================================
    // 4. 打印修改结果并结束
    // ===================================
    var finalBody = JSON.stringify(obj);
    
    // ⚠️ 打印修改后的关键字段供检查
    var debugInfo = {
        "is_full_data": !!obj.data,
        "new_expire": obj.data ? obj.data.expired_timestamp : obj.expired_timestamp,
        "is_lifetime": obj.data ? obj.data.md_lifetime : obj.md_lifetime,
        "server_count": obj.servers ? obj.servers.length : 0
    };
    console.log("✅ [VPN Debug] 修改完成! 关键信息校验: " + JSON.stringify(debugInfo));
    
    // 如果你想看完整的修改后数据（注意日志可能会截断）：
    // console.log("✅ [VPN Debug] 完整修改内容: " + finalBody);

    $done({ body: finalBody });

} catch (e) {
    console.log("❌ [VPN Debug] 脚本错误: " + e);
    $done({});
}
