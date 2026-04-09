/*******************************
[rewrite_local]
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/.+$) url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/cloak.js
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/.+$) url script-request-header https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/cloak.js

[mitm] 
hostname = api.revenuecat.com
*******************************/
let obj = {};

if (typeof $response == "undefined") {
  // 移除 ETag，确保 RevenueCat 每次返回完整数据
  delete $request.headers["x-revenuecat-etag"];
  delete $request.headers["X-RevenueCat-ETag"];
  obj.headers = $request.headers;
} else {
  let body = JSON.parse(typeof $response != "undefined" && $response.body || null);
  if (body && body.subscriber) {
    // 注入提取到的 Lifetime 终身版 product_id
    const product_id = "com.c2.applock.cloak.lifetime";
    
    let data = {
      "expires_date": "2999-01-01T00:00:00Z",
      "original_purchase_date": "2021-01-01T00:00:00Z",
      "purchase_date": "2021-01-01T00:00:00Z",
      "ownership_type": "PURCHASED",
      "store": "app_store"
    };

    let subscriber = body.subscriber;
    
    // 初始化节点防止报错
    subscriber.subscriptions = subscriber.subscriptions || {};
    subscriber.entitlements = subscriber.entitlements || {};

    // 写入订阅商品
    subscriber.subscriptions[product_id] = data;

    // 批量注入最常见的解锁权限标识，确保解锁成功
    const entitlements_to_inject = ["pro", "premium", "vip", "CloakPro"];
    entitlements_to_inject.forEach(ent => {
      subscriber.entitlements[ent] = Object.assign({}, data);
      subscriber.entitlements[ent].product_identifier = product_id;
    });

    obj.body = JSON.stringify(body);
  }
}

$done(obj);
