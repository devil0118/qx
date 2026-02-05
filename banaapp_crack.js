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
    // 修改用户等级为最高等级
    body.level = 3;
    body.class = 3;

    // 修改过期时间为 2999 年
    body.class_expire = "2999-12-31 23:59:59";
    body.expired = "2999-12-31 23:59:59";
    body.exp = 32503651199;  // Unix 时间戳

    // 修改套餐名称
    body.planName = "Premium VIP";
    body.plan = "Premium VIP";

    obj.body = JSON.stringify(body);
  }
}

$done(obj);
