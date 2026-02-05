/*******************************
香蕉VPN 全能破解脚本 (终极增强版)
版本: 7.0
日期: 2026-02-05
更新：基于砸壳分析，注入潜在的内部字段

[rewrite_local]
# RevenueCat
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/.+$) url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js

# Backend API
^https:\/\/api\d+\.[a-z]+api\.(com|org|net|win)\/bana\/v1\/banalogin url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js

[mitm]
hostname = api.revenuecat.com, api*.bkrapi.com, api*.bjpapi.com, api*.busapi.org, api*.*api.com, api*.*api.org, api*.*api.net, api*.*api.win
*******************************/

const url = $request.url;
let obj = {};

// --- 1. 处理 RevenueCat API ---
if (url.includes("revenuecat.com")) {
  if (typeof $response == "undefined") {
    delete $request.headers["x-revenuecat-etag"];
    delete $request.headers["X-RevenueCat-ETag"];
    obj.headers = $request.headers;
  } else {
    let body = JSON.parse(typeof $response != "undefined" && $response.body || null);
    if (body && body.subscriber) {
      const product_id = "rc_annu";
      const entitlement = "banavip";
      let data = {
        "expires_date": "2999-12-31T23:59:59Z",
        "original_purchase_date": "2021-01-01T00:00:00Z",
        "purchase_date": "2021-01-01T00:00:00Z",
        "ownership_type": "PURCHASED",
        "store": "app_store",
        "is_sandbox": false,
        "period_type": "normal"
      };
      let subscriber = body.subscriber;
      if (!subscriber.entitlements) subscriber.entitlements = {};
      if (!subscriber.subscriptions) subscriber.subscriptions = {};
      subscriber.entitlements[entitlement] = JSON.parse(JSON.stringify(data));
      subscriber.entitlements[entitlement].product_identifier = product_id;
      subscriber.subscriptions[product_id] = data;
      obj.body = JSON.stringify(body);
    }
  }
}
// --- 2. 处理 Backend API (banalogin) ---
else if (url.includes("/bana/v1/banalogin")) {
  if (typeof $response !== "undefined") {
    let body = JSON.parse($response.body || null);

    if (body && body.status === 1) {
      // 基本 VIP 信息
      body.level = 3;
      body.class = 3;
      body.class_expire = "2999-12-31 23:59:59";
      body.expired = "2999-12-31 23:59:59";
      body.exp = 32503651199;
      body.planName = "Premium VIP";
      body.plan = "Premium VIP";
      body.transfer_enable = "99TB";
      body.remaining_traffic = "99TB";
      body.used_traffic = "0B";

      // 核心权限修改
      if (body.ip1) {
        body.ip1.level = 3;
        body.ip1.class = 3;
        body.ip1.is_admin = true;
        body.ip1.node_group = 3;
        body.ip1.node_speedlimit = 0;
        body.ip1.node_connector = 50;
        body.ip1.transfer_enable = 108850559123456;
        body.ip1.u = 0;
        body.ip1.d = 0;
        body.ip1.class_expire = "2999-12-31 23:59:59";
        body.ip1.expire_in = "2999-12-31 23:59:59";

        // --- 注入砸壳发现的潜在隐藏字段 ---
        // 虽然响应里不一定有，但注入进去不亏
        body.ip1._BauserToken = body.token;
        body.ip1.isValid = true;
        body.ip1.isVIP = true;
      }

      // 修改 config 字符串
      if (body.config) {
        try {
          body.config = body.config.replace(/"level":\s*\d+/g, '"level":3');
          body.config = body.config.replace(/"class":\s*\d+/g, '"class":3');
          body.config = body.config.replace(/"node_group":\s*\d+/g, '"node_group":3');
          body.config = body.config.replace(/"node_speedlimit":\s*\d+/g, '"node_speedlimit":0');
        } catch (e) { }
      }

      obj.body = JSON.stringify(body);
    }
  }
}

$done(obj);
