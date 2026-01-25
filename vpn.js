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
    console.log("obj====="+obj);
    // 设定过期时间为 2099-12-31 (时间戳：4102444800)
    const vipTime = "4102444800.00000"; 

    // --- 逻辑分支 1: 处理完整版响应 (数据在 data 字段下) ---
    // 对应 action: account_status_v2_full
    if (obj.data) {
        obj.data.expired_timestamp = vipTime;
        obj.data.md_lifetime = true;       // 开启终身订阅
        obj.data.trial_period = true;      // 开启试用状态作为双重保险
        
        // 修改试用详细状态
        if (!obj.data.trial_statuses) obj.data.trial_statuses = {};
        obj.data.trial_statuses.store_trial_purchase = true;
        obj.data.trial_statuses.ks_trial = true;

        // 确保所有高级模块开启
        if (obj.data.modules) {
            obj.data.modules.proto_rotator = true;
            obj.data.modules.firewall = true;
        }
    } 
    // --- 逻辑分支 2: 处理简略版响应 (数据在根节点) ---
    // 对应 action: account_status_short
    else {
        obj.expired_timestamp = vipTime;
        obj.store_trial_purchase = true;
        obj.ks_trial = true;
        obj.md_lifetime = true; // 尝试在根节点也加上，防止逻辑变更
    }

    $done({body: JSON.stringify(obj)});

} catch (e) {
    // 如果 JSON 解析失败，按原样返回，防止断网
    console.log("VPN Script Error: " + e);
    $done({});
}
