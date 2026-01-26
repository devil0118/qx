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
    const bundle_id = "com.iuiosappijs";
    const product_id = "com.yearPackage"; // 确认的 Product ID
    
    // 1. 构造标准订阅项
    const receipt_item = {
        "quantity": "1",
        "purchase_date_ms": "1769414074000",
        "expires_date": "2099-09-09 09:09:09 Etc/GMT",
        "expires_date_ms": "4092599349000",
        "transaction_id": "490001314520000",
        "original_transaction_id": "490001314520000",
        "product_id": product_id,
        "in_app_ownership_type": "PURCHASED",
        "original_purchase_date_ms": "1769414074000"
    };
    // 2. 深度覆盖所有校验位 (完全对标 ituns.js)
    if (obj.receipt) {
        obj.receipt.in_app = [receipt_item];
        obj.receipt.bundle_id = bundle_id;
    }
    obj.latest_receipt_info = [receipt_item];
    obj.pending_renewal_info = [{
        "product_id": product_id,
        "original_transaction_id": "490001314520000",
        "auto_renew_product_id": product_id,
        "auto_renew_status": "1"
    }];
    obj.status = 0;
    
    // 如果返回体里没有 receipt（例如 21007 状态），补全它
    if (!obj.receipt) {
        obj.receipt = { "bundle_id": bundle_id, "in_app": [receipt_item] };
    }
    $done({ body: JSON.stringify(obj) });
} 
// 私有 API 逻辑：配合解锁节点列表中的 VIP 标识 (必改，否则只有图标没节点)
if (url.includes("cnc07iuapis")) {
    try {
        let obj = JSON.parse(body || "{}");
        obj.vpnVip = 1;
        if (obj.data && Array.isArray(obj.data)) {
            obj.data.forEach(item => { 
                item.vpnVip = 1; 
                item.iscode = 1; // 强制开启加密线路访问权限
            });
        }
        $done({ status: "HTTP/1.1 200 OK", body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
}
$done({});
