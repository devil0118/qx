/*******************************

[rewrite_local]
^https:\/\/api\d+\.[a-z]+api\.(com|org|net)\/bana\/v1\/banalogin url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js
[mitm] 
hostname = api*.bkrapi.com, api*.bjpapi.com, api*.busapi.org, api*.*api.com, api*.*api.org, api*.*api.net

*******************************/


let obj = {};

if (typeof $response !== "undefined") {
  let body = JSON.parse($response.body || null);

  if (body && body.status === 1) {
    // --- 1. 修改外层控制字段 ---
    body.level = 3;
    body.class = 3;
    body.planName = "Premium VIP";
    body.plan = "Premium VIP";

    // 修改过期时间
    body.class_expire = "2999-12-31 23:59:59";
    body.expired = "2999-12-31 23:59:59";
    body.exp = 32503651199;

    // 修改流量显示 (字符串格式)
    body.used_traffic = "0B";
    body.transfer_enable = "99.00TB";
    body.remaining_traffic = "99.00TB";

    // --- 2. 修改嵌套的 ip1 对象 (核心数据) ---
    if (body.ip1) {
      body.ip1.level = 3;
      body.ip1.class = 3;
      body.ip1.u = 0;              // 已用流量清零
      body.ip1.d = 0;              // 已用流量清零
      // 99TB 对应的字节数 (99 * 1024^4)
      body.ip1.transfer_enable = 108850559123456;

      // 同步过期时间
      body.ip1.class_expire = "2999-12-31 23:59:59";
      body.ip1.expire_in = "2999-12-31 23:59:59";
      body.ip1.expire_time = 32503651199;

      // 其他会员标识
      body.ip1.user_name = "Premium User";
    }

    obj.body = JSON.stringify(body);
  }
}

$done(obj);
