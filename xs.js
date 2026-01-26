/*
[rewrite_local]
# 拦截 Apple 收据验证
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
# 拦截私有 API (cnc07api)
^http:\/\/cnc07api\.cnc07\.com\/api\/cnc07iuapis$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
[mitm]
hostname = buy.itunes.apple.com, cnc07api.cnc07.com

*/
console.log("3333=====5555=====");
const url = $request.url;
let body = $response.body;
// --- 逻辑 A: Apple 官方收据校验拦截 ---
if (url.includes("verifyReceipt")) {
    let obj = JSON.parse(body || "{}");
    const productID = "com.yearPackage"; 
    
    obj.status = 0;
    obj.environment = "Production";
    obj.receipt = obj.receipt || {};
    obj.receipt.bundle_id = "com.iuiosappijs";
    
    // 补全 App 专属官方标识位 (解决恢复失败)
    obj.receipt.adam_id = 1619230438;
    obj.receipt.app_item_id = 1619230438;
    obj.receipt.download_id = 505229485891298169;
    obj.receipt.application_version = "1.0.0";
    const item = {
        "quantity": "1",
        "purchase_date_ms": "1769414074000",
        "expires_date_ms": "4092599349000",
        "transaction_id": "490001314520000",
        "original_transaction_id": "490001314520000",
        "product_id": productID,
        "in_app_ownership_type": "PURCHASED"
    };
    obj.receipt.in_app = [item];
    obj.latest_receipt_info = [item];
    obj.pending_renewal_info = [{
        "product_id": productID,
        "auto_renew_status": "1"
    }];
    $done({ body: JSON.stringify(obj) });
}
// --- 逻辑 B: 节点服务器列表拦截 (降级解锁方案) ---
else if (url.includes("cnc07iuapis")) {
    try {
        let obj = JSON.parse(body || '{"errcode":200,"data":[]}');
        
        // 我们反其道而行之：把 VIP 属性全部抹掉
        obj.vpnVip = 0; // 全局 VIP 关闭
        obj.isVip = 0;
        
        if (obj.data && Array.isArray(obj.data)) {
            obj.data.forEach(node => {
                node.vpnVip = 0; // 让节点看起来是免费的
                node.isVip = 0;
                node.iscode = 1; // 保持授权码开启，允许连接
            });
        }
        
        $done({
            status: "HTTP/1.1 200 OK",
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            body: JSON.stringify(obj)
        });
    } catch (e) {
        $done({});
    }
}
else {
    $done({});
}
