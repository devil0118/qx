/*
[rewrite_local]
# 拦截 Apple 收据验证
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
# 拦截私有 API (cnc07api)
^http:\/\/cnc07api\.cnc07\.com\/api\/cnc07iuapis$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
[mitm]
hostname = buy.itunes.apple.com, cnc07api.cnc07.com

*/
console.log("3333==========");
let body = $response.body;
let url = $request.url;
// --- 逻辑 1: iTunes 验证 (恢复订阅) ---
if (url.includes("verifyReceipt")) {
    let obj = JSON.parse(body);
    const productID = "com.yearPackage"; // 核心修正
    const bundleID = "com.iuiosappijs";
    
    obj.status = 0;
    obj.receipt = {
        "bundle_id": bundleID,
        "in_app": [{
            "quantity": "1",
            "purchase_date_ms": "9999999999999",
            "transaction_id": "490001314520000",
            "product_id": productID,
            "original_transaction_id": "490001314520000",
            "purchase_date": "2099-09-09 09:09:09 Etc/GMT",
            "expires_date": "2099-09-09 09:09:09 Etc/GMT",
            "expires_date_ms": "9999999999999"
        }]
    };
    obj.latest_receipt_info = obj.receipt.in_app;
    obj.pending_renewal_info = [{
        "product_id": productID,
        "auto_renew_status": "1"
    }];
    
    $done({ body: JSON.stringify(obj) });
}
// --- 逻辑 2: 私有域名 API ---
if (url.includes("cnc07iuapis")) {
    // 强制返回 200 并注入 VIP 标志
    // 即使服务器返回的是 304 也会被此处重写
    let finalBody = body || "{}";
    try {
        let obj = JSON.parse(finalBody);
        
        // 修正用户状态
        obj.vpnVip = 1;
        obj.isVip = 1; // 备选字段
        
        // 修正线路列表中的 VIP 标志
        if (obj.data && Array.isArray(obj.data)) {
            obj.data = obj.data.map(item => {
                item.vpnVip = 1;
                item.iscode = 1;
                return item;
            });
        }
        
        $done({ 
            status: "HTTP/1.1 200 OK", 
            body: JSON.stringify(obj) 
        });
    } catch (e) {
        $done({});
    }
}
$done({});
}
$done({});
