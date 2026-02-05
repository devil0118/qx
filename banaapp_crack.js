/*******************************

[rewrite_local]
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/.+$) url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/.+$) url script-request-header https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js

[mitm] 
hostname = api.revenuecat.com

*******************************/

let obj = {};

// 处理请求头，删除 ETag 避免缓存
if (typeof $response == "undefined") {
  delete $request.headers["x-revenuecat-etag"];
  delete $request.headers["X-RevenueCat-ETag"];
  obj.headers = $request.headers;
} else {
  // 处理响应体
  let body = JSON.parse(typeof $response != "undefined" && $response.body || null);

  if (body && body.subscriber) {
    let subscriber = body.subscriber;

    // 确认的产品 ID 和 entitlement（从二进制分析）
    const lifetime_product_id = "rc_life";
    const entitlement_id = "banavip";

    // 确保必要的对象存在
    if (!subscriber.entitlements) {
      subscriber.entitlements = {};
    }
    if (!subscriber.subscriptions) {
      subscriber.subscriptions = {};
    }
    if (!subscriber.non_subscriptions) {
      subscriber.non_subscriptions = {};
    }

    // 终身购买数据结构（非订阅类型）
    // RevenueCat 对终身购买使用 non_subscriptions 字段
    subscriber.non_subscriptions[lifetime_product_id] = [{
      "id": "banaapp_lifetime_" + Date.now(),
      "is_sandbox": false,
      "original_purchase_date": "2021-01-01T00:00:00Z",
      "purchase_date": "2021-01-01T00:00:00Z",
      "store": "app_store",
      "store_transaction_id": "banaapp_" + Date.now()
    }];

    // 设置 entitlement（会员权限）
    // 注意：终身购买的 entitlement 不应该有 expires_date
    subscriber.entitlements[entitlement_id] = {
      "expires_date": null,  // 终身购买没有过期时间
      "product_identifier": lifetime_product_id,
      "purchase_date": "2021-01-01T00:00:00Z"
    };

    // 设置其他必要字段
    subscriber.original_app_user_id = subscriber.original_app_user_id || "$RCAnonymousID:" + generateRandomID();
    subscriber.first_seen = subscriber.first_seen || "2021-01-01T00:00:00Z";
    subscriber.original_application_version = subscriber.original_application_version || "1";
    subscriber.original_purchase_date = subscriber.original_purchase_date || "2021-01-01T00:00:00Z";

    obj.body = JSON.stringify(body);
  }
}

// 生成随机 ID
function generateRandomID() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

$done(obj);
