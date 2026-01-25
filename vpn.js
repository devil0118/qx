/*************************************
脚本功能：解锁 VPN Unlimited / KeepSolid VPN 订阅
支持版本：兼容 account_status_short 和 account_status_v2_full 两种响应格式
使用方法：在 Quantumult X 中配置重写规则

[rewrite_local]
^https?:\/\/online\.altovate\.xyz\/api\/v1\/ url script-response-body https://github.com/devil0118/qx/raw/refs/heads/main/vpn.js

[mitm]
hostname = online.altovate.xyz
*************************************/

var body = $response.body;
var obj = {};

try {
    obj = JSON.parse(body);

    // ==========================================
    // 逻辑分支 1: 处理服务器列表 (vpn_regions)
    // ==========================================
    if (obj.servers && Array.isArray(obj.servers)) {
        // 遍历普通服务器列表，全部设为免费
        obj.servers.forEach(function(server) {
            server.free = true;
            // 如果只有部分节点好用，可以尝试调高优先级
            // server.priority = 100; 
        });
        
        // (可选) 如果流媒体服务器也有锁，可以在这里处理
        if (obj.stream_servers && Array.isArray(obj.stream_servers)) {
             obj.stream_servers.forEach(function(server) {
                 // 流媒体节点通常没有 free 字段，但可能有 hidden 属性，视情况而定
                 // 这里通常只要 VIP 状态是对的，服务器就能连
                 server.free = true; // 强制加上尝试一下
             });
        }
    } 
    // ==========================================
    // 逻辑分支 2: 处理账号状态 (account_status)
    // ==========================================
    else {
        // 设定一个遥远的未来时间 (2099年)
        const vipTime = "4102444800.00000"; 

        if (obj.data) {
            console.log("obj.data===="+obj.data);
            // 完整版状态 (v2_full)
            obj.data.expired_timestamp = vipTime;
            obj.data.md_lifetime = true;
            obj.data.trial_period = true; // 双重保险
            
            if (!obj.data.trial_statuses) obj.data.trial_statuses = {};
            obj.data.trial_statuses.store_trial_purchase = true;
            obj.data.trial_statuses.ks_trial = true;

            if (obj.data.modules) {
                obj.data.modules.proto_rotator = true;
                obj.data.modules.firewall = true;
            }
        } else {
            console.log("obj======"+obj);
            // 简略版状态 (short)
            // 只要有过期时间字段就修改
            if (typeof obj.expired_timestamp !== "undefined") {
                obj.expired_timestamp = vipTime;
            }
            obj.store_trial_purchase = true;
            obj.ks_trial = true;
            obj.md_lifetime = true;
        }
    }

    $done({body: JSON.stringify(obj)});

} catch (e) {
    console.log("VPN Script Error: " + e);
    $done({});
}
