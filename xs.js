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
    let obj = JSON.parse(body || "{}");
    const bundleID = "com.iuiosappijs";
    
    // 官方元数据 (根据你的截图校准)
    obj.status = 0;
    obj.environment = "Production";
    obj.receipt = obj.receipt || {};
    obj.receipt.bundle_id = bundleID;
    obj.receipt.adam_id = 1619230438;
    obj.receipt.app_item_id = 1619230438;
    obj.receipt.application_version = "1.0.0";
    obj.receipt.download_id = 505229485891298169;
    obj.receipt.version_external_identifier = 871615854;
    // 构造 VIP 订阅项
    const subs = [
        {
            "quantity": "1",
            "purchase_date": "2026-01-26 07:54:34 Etc/GMT",
            "purchase_date_ms": "1769414074000",
            "expires_date": "2099-09-09 09:09:09 Etc/GMT",
            "expires_date_ms": "4092599349000",
            "transaction_id": "490001314520000",
            "original_transaction_id": "490001314520000",
            "product_id": "com.yearPackage", // 核心 ID
            "in_app_ownership_type": "PURCHASED",
            "original_purchase_date_ms": "1769414074000"
        },
        {
            "quantity": "1",
            "product_id": "annualPackagex", // 备选 ID，增强兼容性
            "transaction_id": "490001314520001",
            "original_transaction_id": "490001314520001",
            "purchase_date_ms": "1769414074000",
            "expires_date_ms": "4092599349000"
        }
    ];
    obj.receipt.in_app = subs;
    obj.latest_receipt_info = subs;
    obj.pending_renewal_info = subs.map(s => ({
        "product_id": s.product_id,
        "auto_renew_status": "1",
        "original_transaction_id": s.original_transaction_id
    }));
    
    $done({ body: JSON.stringify(obj) });
} 
if (url.includes("cnc07iuapis")) {
    // 即使服务器没返回 body，我们也构造一个完整的 VIP 数据丢给它
    let fakeBody = {
        "resp_code": 200,
        "vpnVip": 1,
        "isVip": 1,
        "data": [
            { "vpnVip": 1, "isVip": 1, "iscode": 1, "status": 1 }
        ]
    };
    $done({ 
        status: "HTTP/1.1 200 OK", 
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify(fakeBody) 
    });
}
$done({});
