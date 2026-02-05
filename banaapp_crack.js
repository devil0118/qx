/*******************************

[rewrite_local]
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/.+$) url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/.+$) url script-request-header https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js

[mitm] 
hostname = api.revenuecat.com

*******************************/

let obj = {};

// 处理请求头，删除 ETag 避免缓存
if(typeof $response == "undefined") {
  delete $request.headers["x-revenuecat-etag"];
  delete $request.headers["X-RevenueCat-ETag"];
  obj.headers = $request.headers;
} else {
  // 处理响应体
  let body = JSON.parse(typeof $response != "undefined" && $response.body || null);
  
  if(body && body.subscriber) {
    // 香蕉VPN 的产品配置
    // 基于分析报告，提供多个可能的产品 ID
    const products = [
      "rc_life",           // 终身订阅（主要）
      "rc_annu",           // 年度订阅
      "rc_six_",           // 半年订阅
      "rc_thre",           // 三个月订阅
    ];
    
    // 可能的 entitlement 标识符
    const entitlements = [
      "banavip",           // 根据二进制文件分析
      "premium",           // 通用命名
      "pro",               // 备选
      "vip",               // 备选
    ];
    
    // 订阅数据模板（永久有效）
    let subscriptionData = {
      "expires_date": "2999-12-31T23:59:59Z",
      "original_purchase_date": "2021-01-01T00:00:00Z",
      "purchase_date": "2021-01-01T00:00:00Z",
      "ownership_type": "PURCHASED",
      "store": "app_store",
      "is_sandbox": false,
      "unsubscribe_detected_at": null,
      "billing_issues_detected_at": null,
      "grace_period_expires_date": null,
      "refunded_at": null,
      "auto_resume_date": null,
      "period_type": "normal"
    };
    
    let subscriber = body.subscriber;
    
    // 确保 entitlements 和 subscriptions 对象存在
    if (!subscriber.entitlements) {
      subscriber.entitlements = {};
    }
    if (!subscriber.subscriptions) {
      subscriber.subscriptions = {};
    }
    
    // 注入所有产品订阅（确保兼容性）
    products.forEach(product_id => {
      subscriber.subscriptions[product_id] = JSON.parse(JSON.stringify(subscriptionData));
    });
    
    // 注入所有可能的 entitlements（确保兼容性）
    entitlements.forEach(entitlement => {
      let entitlementData = JSON.parse(JSON.stringify(subscriptionData));
      entitlementData.product_identifier = "rc_life"; // 主产品 ID
      subscriber.entitlements[entitlement] = entitlementData;
    });
    
    // 特别处理主要的终身订阅
    // 使用最可能的组合
    const main_product = "rc_life";
    const main_entitlement = "banavip";
    
    subscriber.subscriptions[main_product] = JSON.parse(JSON.stringify(subscriptionData));
    subscriber.entitlements[main_entitlement] = JSON.parse(JSON.stringify(subscriptionData));
    subscriber.entitlements[main_entitlement].product_identifier = main_product;
    
    // 设置订阅状态
    if (!subscriber.non_subscriptions) {
      subscriber.non_subscriptions = {};
    }
    
    // 添加终身购买记录
    subscriber.non_subscriptions[main_product] = [{
      "id": "banaapp_lifetime_" + Date.now(),
      "is_sandbox": false,
      "original_purchase_date": "2021-01-01T00:00:00Z",
      "purchase_date": "2021-01-01T00:00:00Z",
      "store": "app_store",
      "store_transaction_id": "banaapp_" + Date.now()
    }];
    
    // 设置管理 URL（可选）
    if (!subscriber.management_url) {
      subscriber.management_url = null;
    }
    
    // 设置原始应用用户 ID
    if (!subscriber.original_app_user_id) {
      subscriber.original_app_user_id = "$RCAnonymousID:" + generateRandomID();
    }
    
    // 设置其他字段
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
