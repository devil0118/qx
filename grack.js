/**

[rewrite_local]
 ^https?://.*netlify\.app url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/grack.js

[mitm]
 hostname = *.netlify.app

 */
console.log("adsfasdfasd");
const CRACK_CONFIG = {
    level: "Plus",
    expiry: 2000000000,  // 2033-05-18
    plus_expires_unix: 2000000000,
    recurring: true
};

// 获取响应体
let body = $response.body;
let obj = null;

try {
    // 尝试解析 JSON
    obj = JSON.parse(body);
    console.log("[Geph Crack] 原始响应:", body);

    // 检查是否包含用户信息相关字段
    if (obj) {
        let modified = false;

        // 情况1: 直接在响应中有 level 字段
        if (obj.level !== undefined) {
            obj.level = CRACK_CONFIG.level;
            obj.expiry = CRACK_CONFIG.expiry;
            obj.plus_expires_unix = CRACK_CONFIG.plus_expires_unix;
            if (obj.recurring !== undefined) {
                obj.recurring = CRACK_CONFIG.recurring;
            }
            modified = true;
        }

        // 情况2: 包装在 result 中
        if (obj.result && typeof obj.result === 'object') {
            if (obj.result.level !== undefined) {
                obj.result.level = CRACK_CONFIG.level;
                obj.result.expiry = CRACK_CONFIG.expiry;
                obj.result.plus_expires_unix = CRACK_CONFIG.plus_expires_unix;
                if (obj.result.recurring !== undefined) {
                    obj.result.recurring = CRACK_CONFIG.recurring;
                }
                modified = true;
            }
        }

        // 情况3: 包装在 account 中
        if (obj.account && typeof obj.account === 'object') {
            obj.account.level = CRACK_CONFIG.level;
            obj.account.expiry = CRACK_CONFIG.expiry;
            obj.account.plus_expires_unix = CRACK_CONFIG.plus_expires_unix;
            if (obj.account.recurring !== undefined) {
                obj.account.recurring = CRACK_CONFIG.recurring;
            }
            modified = true;
        }

        // 情况4: 服务器出口配置中的 allowed_levels
        if (obj.allowed_levels) {
            if (!obj.allowed_levels.includes("Free")) {
                obj.allowed_levels.push("Free");
            }
            modified = true;
        }

        // 如果有任何 exits (服务器出口) 配置
        if (Array.isArray(obj.exits)) {
            obj.exits.forEach(exit => {
                if (exit.allowed_levels && !exit.allowed_levels.includes("Free")) {
                    exit.allowed_levels.push("Free");
                }
            });
            modified = true;
        }

        if (modified) {
            body = JSON.stringify(obj);
            console.log("[Geph Crack] 修改后响应:", body);
        }
    }
} catch (e) {
    console.log("[Geph Crack] 解析失败，可能是加密数据:", e.message);
    // 如果不是 JSON，可能是加密数据，无法处理
}

$done({ body: body });
