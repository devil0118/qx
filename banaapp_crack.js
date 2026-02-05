/*******************************

[rewrite_local]
^https:\/\/api01\.bkrapi\.com\/bana\/v1\/banalogin url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js
[mitm] 
hostname = api01.bkrapi.com

*******************************/

let obj = {};

if (typeof $response !== "undefined") {
    let body = JSON.parse($response.body || null);

    if (body && body.status === 1) {
        // 修改用户等级为最高等级
        body.level = 3;           // 用户等级改为 3
        body.class = 3;           // class 字段也改为 3

        // 修改会员过期时间为 2999 年
        body.class_expire = "2999-12-31 23:59:59";
        body.expired = "2999-12-31 23:59:59";
        body.exp = 32503651199;  // 2999-12-31 的 Unix 时间戳

        // 修改套餐名称（可选）
        body.planName = "VIP Premium";
        body.plan = "VIP Premium";

        // 修改流量限制（可选 - 设置为 100GB）
        body.transfer_enable = "107374182400";  // 100GB in bytes
        body.remaining_traffic = "100GB";

        obj.body = JSON.stringify(body);
    }
}

$done(obj);
