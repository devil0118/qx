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
if (url.includes("itunes.apple.com")) {
    let obj = JSON.parse(body);
    // 修正 Product ID 为 App 二进制中存在的 ID
    const productID = "com.yearPackage"; 
    const bundleID = "com.iuiosappijs";
    
    obj.status = 0;
    obj.receipt = {
        "bundle_id": bundleID,
        "in_app": [{
            "quantity": "1",
            "purchase_date_ms": "9999999999999",
            "transaction_id": "490001314520000",
            "product_id": productID,
            "expires_date": "2099-09-09 09:09:09 Etc/GMT",
            "expires_date_ms": "9999999999999"
        }]
    };
    obj.latest_receipt_info = obj.receipt.in_app;
    $done({ body: JSON.stringify(obj) });
} 
if (url.includes("cnc07api")) {
    // 如果返回是明文 JSON，则尝试解锁 VIP 字段
    try {
        let obj = JSON.parse(body);
        if (obj.data) {
            // 遍历所有线路或节点，设为 VIP 可用
            if (Array.isArray(obj.data)) {
                obj.data.forEach(item => {
                    if (item.hasOwnProperty('vpnVip')) item.vpnVip = 1;
                });
            } else if (typeof obj.data === 'object') {
                if (obj.data.hasOwnProperty('vpnVip')) obj.data.vpnVip = 1;
            }
        }
        if (obj.hasOwnProperty('vpnVip')) obj.vpnVip = 1;
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // 如果是加密数据，则保持原样（需进一步破解 key）
        $done({});
    }
}
$done({});
