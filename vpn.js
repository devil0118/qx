/*
[rewrite_local]
^https?:\/\/online\.altovate\.xyz\/api\/v1\/?$ url script-response-body vpn.js

[mitm]
hostname = online.altovate.xyz
*/

var body = $response.body;
var obj = {};

try {
    obj = JSON.parse(body);
    // 调试标记：证明脚本进来了
    console.log("🟢 [VPN Script] Start. Original/Data Expired: " + (obj.data?.expired_timestamp || obj.expired_timestamp || "N/A"));

    // 统一常量
    const futureTime = "4102444800.00000"; // 2099-12-31

    // -------------------------------------
    // 场景 1: 服务器列表 (包含 servers 数组)
    // -------------------------------------
    if (obj.servers && Array.isArray(obj.servers)) {
        console.log("🔵 [VPN Script] Unlocking Servers...");
        obj.servers.forEach(function(s) {
            s.free = true;
            // s.priority = 100; // 可选：提高权重
        });
        if (obj.stream_servers) {
            obj.stream_servers.forEach(function(s) { s.free = true; });
        }
    } 
    // -------------------------------------
    // 场景 2: 账号状态/详情
    // -------------------------------------
    else {
        // 部分请求可能只有 store_trial_purchase 而没有 data 层级
        console.log("🟠 [VPN Script] Unlocking Account/Trial...");
        
        // 辅助函数：修改指定对象的状态
        function unlock(target) {
            if (!target) return;
            target.expired_timestamp = futureTime;
            target.md_lifetime = true;
            target.trial_period = true;
            
            // 确保试用状态全开
            if (!target.trial_statuses) target.trial_statuses = {};
            target.trial_statuses.store_trial_purchase = true;
            target.trial_statuses.ks_trial = true;
        }

        if (obj.data) {
            unlock(obj.data);
            // 额外开启模块
            if (obj.data.modules) {
                obj.data.modules.proto_rotator = true;
                obj.data.modules.firewall = true;
            }
        } else {
            // 针对简短版响应，直接修改根对象
            unlock(obj);
        }
    }

    // -------------------------------------
    // 强制写入修改后的数据
    // -------------------------------------
    const modifiedBody = JSON.stringify(obj);
    console.log("✅ [VPN Script] Success. New Body Length: " + modifiedBody.length);
    
    $done({ body: modifiedBody });

} catch (e) {
    console.log("❌ [VPN Script] Error: " + e);
    // 出错时尽量不要以 $done({}) 结束，把原数据扔回去防止 App 崩溃（除非你想阻断）
    $done({}); 
}
