/*
[rewrite_local]
# 拦截 Apple 收据验证
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
# 拦截私有 API (cnc07api)
^http:\/\/cnc07api\.cnc07\.com\/api\/cnc07iuapis$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
[mitm]
hostname = buy.itunes.apple.com, cnc07api.cnc07.com

*/
console.log("3333=====4444=====");
let body = $response.body;
let url = $request.url;
if (url.includes("verifyReceipt")) {
    let obj = JSON.parse(body);
    const productID = "com.yearPackage"; // 已确认的硬编码 ID
    const bundleID = "com.iuiosappijs";
    
    // 构造订阅条目
    const subscriptionEntry = {
        "quantity": "1",
        "purchase_date_ms": "1769414074000",
        "expires_date": "2099-09-09 09:09:09 Etc/GMT",
        "expires_date_ms": "4092599349000",
        "transaction_id": "490001314520000",
        "original_transaction_id": "490001314520000",
        "product_id": productID,
        "in_app_ownership_type": "PURCHASED",
        "original_purchase_date_ms": "1769414074000"
    };
    // 核心注入：修改 receipt 内部的 in_app
    if (obj.receipt) {
        obj.receipt.in_app = [subscriptionEntry];
    }
    
    // 同时修改最新收据信息
    obj.latest_receipt_info = [subscriptionEntry];
    obj.status = 0;
    
    $done({ body: JSON.stringify(obj) });
} 
// 私有 API 拦截逻辑保持不变，用于解锁后端列表状态
if (url.includes("cnc07iuapis")) {
    try {
        let obj = JSON.parse(body || "{}");
        obj.vpnVip = 1;
        if (obj.data && Array.isArray(obj.data)) {
            obj.data.forEach(item => { item.vpnVip = 1; });
        }
        $done({ status: "HTTP/1.1 200 OK", body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
$done({});
