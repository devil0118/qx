/*
[rewrite_local]
# 拦截 Apple 收据验证
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
# 拦截私有 API (cnc07api)
^http:\/\/cnc07api\.cnc07\.com\/api\/cnc07iuapis$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
[mitm]
hostname = buy.itunes.apple.com, cnc07api.cnc07.com

*/
console.log("3333=====66666=====");
const url = $request.url;
let body = $response.body;
if (url.includes("verifyReceipt")) {
    // ... 保持 V7 的收据拦截逻辑 ...
    let obj = JSON.parse(body || "{}");
    obj.status = 0;
    // ... (省略部分重复的收据注入代码，保持与 V7 一致)
    $done({ body: JSON.stringify(obj) });
} 
else if (url.includes("cnc07iuapis")) {
    try {
        let obj = JSON.parse(body);
        if (obj.servers) {
            // --- 核心解密步骤 ---
            // 这里假设你已经通过 @require 引入了 CryptoJS
            const key = CryptoJS.enc.Hex.parse("f3851cfeb40c44f58f37bf502fa201c1");
            const iv = CryptoJS.enc.Utf8.parse("0123456789ABCDEF");
            
            // 1. 解密旧数据
            let decrypted = CryptoJS.AES.decrypt(obj.servers, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8);
            
            let serverList = JSON.parse(decrypted);
            // 2. 将 VIP 降级为非 VIP (你的绝妙思路)
            serverList.forEach(node => {
                node.vpnVip = 0; 
                node.isVip = 0;
                node.iscode = 1;
            });
            // 3. 重新加密
            let newServers = CryptoJS.AES.encrypt(JSON.stringify(serverList), key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString();
            obj.servers = newServers;
            obj.vpnVip = 0; // 全局也降级
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        console.log("iUVPN 解密失败: " + e);
        $done({});
    }
}
else {
    $done({});
}
