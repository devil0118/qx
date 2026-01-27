/*************************************

项目名称:iTunes-系列解锁合集
更新日期:2026-01-27
脚本作者:@ddm1023 (修正版 by AI)
修正内容:
  1. 修复时间戳字段类型错误(字符串→数字)
  2. 使用动态时间(当前时间+1年),更真实隐蔽
使用声明:⚠️仅供参考,🈲转载与售卖！

**************************************

[rewrite_local]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/ituns.js

[mitm]
hostname = buy.itunes.apple.com

*************************************/
console.log("11111111===========")
// 1. 初始化变量
const ddm = JSON.parse($response.body);
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
// Fix: Handle missing receipt/bundle_id (e.g. status 21007)
let bundle_id = "";
if (ddm.receipt && (ddm.receipt.bundle_id || ddm.receipt.Bundle_Id)) {
    bundle_id = ddm.receipt.bundle_id || ddm.receipt.Bundle_Id;
} else if (ua && (ua.includes("xiashi") || ua.includes("Xiashi") || ua.includes("x1vpn"))) {
    bundle_id = "com.x1vpn.xiashijsq";
    console.log("[Fix] Forced bundle_id from UA: " + bundle_id);
    // Reconstruct ddm for success
    ddm.status = 0;
    ddm.receipt = { bundle_id: bundle_id };
    ddm.latest_receipt_info = [];
}
const yearid = `${bundle_id}.year`;
const yearlyid = `${bundle_id}.yearly`;
const yearlysubscription = `${bundle_id}.yearlysubscription`;
const lifetimeid = `${bundle_id}.lifetime`;

// 2. 配置列表
const list = {
    'ouyou': { cm: 'timea', hx: 'hxpda', id: 'com.yearPackage', latest: 'ddm1023' },
    'com.x1vpn.xiashijsq': { cm: 'timea', hx: 'hxpda', id: 'com.x1vpn.vipAnnual', latest: 'ddm1023' },
    'vpn': { cm: 'timea', hx: 'hxpda', id: 'com.yearPackage', latest: 'ddm1023' },  // ✅ 修正产品ID
    'com.iuiosappijs': { cm: 'timea', hx: 'hxpda', id: 'com.yearPackage', latest: 'ddm1023' }  // ✅ 修正产品ID
    // ... 其他配置省略,使用时请补全完整列表
};
console.log('[Script] List configured');

// 3. 核心反混淆逻辑  
// ⚠️ 关键修复:将所有时间戳从字符串改为数字类型
// 动态计算时间: 当前时间 + 1年
const now = Date.now();
const oneYearLater = now + (365 * 24 * 60 * 60 * 1000);  // 当前时间 + 1年
const purchaseDate = new Date(now);
const expiresDate = new Date(oneYearLater);

// 格式化日期函数
function formatDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    const second = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second} Etc/GMT`;
}

function formatDatePST(date) {
    // PST = UTC-8, 简单处理
    const pstDate = new Date(date.getTime() - (8 * 60 * 60 * 1000));
    const year = pstDate.getUTCFullYear();
    const month = String(pstDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(pstDate.getUTCDate()).padStart(2, '0');
    const hour = String(pstDate.getUTCHours()).padStart(2, '0');
    const minute = String(pstDate.getUTCMinutes()).padStart(2, '0');
    const second = String(pstDate.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second} America/Los_Angeles`;
}

// 收据模板
const receipt = {
    'quantity': '1',
    'purchase_date_ms': now,  // 动态:当前时间
    'is_in_intro_offer_period': 'false',
    'transaction_id': '490001314520000',
    'is_trial_period': 'false',
    'original_transaction_id': '490001314520000',
    'purchase_date': formatDate(purchaseDate),
    'product_id': yearlyid,
    'original_purchase_date_pst': formatDatePST(purchaseDate),
    'in_app_ownership_type': 'PURCHASED',
    'original_purchase_date_ms': now,  // 动态:当前时间
    'web_order_line_item_id': '490000123456789',
    'purchase_date_pst': formatDatePST(purchaseDate),
    'original_purchase_date': formatDate(purchaseDate)
};

// 过期时间模板
const expirestime = {
    'expires_date': formatDate(expiresDate),
    'expires_date_pst': formatDatePST(expiresDate),
    'expires_date_ms': oneYearLater  // 动态:当前时间+1年
};

let anchor = false;
let data;
console.log('[Script] Start processing');

// 遍历匹配
for (const i in list) {
    const regex = new RegExp('^' + i, 'i');
    if (regex.test(ua) || regex.test(bundle_id)) {
        const { cm, hx, id, ids, latest, version } = list[i];
        const receiptdata = Object.assign({}, receipt, { 'product_id': id });

        // 生成对应类型的收据数据
        switch (cm) {
            case 'timea': // 含过期时间
                data = [Object.assign({}, receiptdata, expirestime)];
                break;
            case 'timeb': // 无过期时间(永久)
                data = [receiptdata];
                break;
            case 'timec': // 空数组
                data = [];
                break;
            case 'timed': // 多产品
                data = [
                    Object.assign({}, receiptdata, expirestime, { 'product_id': ids }),
                    Object.assign({}, receiptdata, expirestime, { 'product_id': id })
                ];
                break;
        }

        // 应用修改逻辑
        if (hx.includes('hxpda')) {
            // 标准模式
            ddm.receipt.in_app = data;
            ddm.latest_receipt_info = data;
            ddm.pending_renewal_info = [{
                'product_id': id,
                'original_transaction_id': '490001314520000',
                'auto_renew_product_id': id,
                'auto_renew_status': '1'
            }];
            ddm.status = 0;
            ddm.environment = 'Production';

            // 补全receipt对象的必需字段
            if (!ddm.receipt.request_date) {
                ddm.receipt.request_date = formatDate(new Date());
                ddm.receipt.request_date_pst = formatDatePST(new Date());
                ddm.receipt.request_date_ms = Date.now();
            }
            if (!ddm.receipt.receipt_creation_date) {
                ddm.receipt.receipt_creation_date = formatDate(purchaseDate);
                ddm.receipt.receipt_creation_date_pst = formatDatePST(purchaseDate);
                ddm.receipt.receipt_creation_date_ms = now;
            }
            if (!ddm.receipt.original_purchase_date) {
                ddm.receipt.original_purchase_date = formatDate(purchaseDate);
                ddm.receipt.original_purchase_date_pst = formatDatePST(purchaseDate);
                ddm.receipt.original_purchase_date_ms = now;
            }

            // Fix: Preserve original receipt if possible to bypass local signature check
            if (ddm.latest_receipt) {
                console.log("[Fix] Preserving original latest_receipt");
            } else {
                ddm.latest_receipt = latest;
            }

            // 调试日志
            console.log("[Debug] Product ID: " + id);
            console.log("[Debug] Receipt items: " + data.length);
            console.log("[Debug] Status: " + ddm.status);
        } else if (hx.includes('hxpdb')) {
            // 仅修改 in_app
            ddm.receipt.in_app = data;
        } else if (hx.includes('hxpdc')) {
            // 特殊订阅格式
            const xreceipt = {
                'expires_date_formatted': formatDate(expiresDate),
                'expires_date': oneYearLater,  // 动态:当前时间+1年
                'expires_date_formatted_pst': formatDatePST(expiresDate),
                'product_id': id
            };
            ddm.subscriber = Object.assign({}, ddm.subscriber, xreceipt);
            ddm.subscription = Object.assign({}, ddm.subscription, xreceipt);
            ddm.status = 0;
            ddm.is_sandbox = 1;
            ddm.subscribed = id;
            delete ddm.expirationTime;
            delete ddm.message;
        }

        if (version && version.trim() !== '') {
            ddm.receipt.app_version = version;
        }

        anchor = true;
        console.log('[Match] 成功匹配: ' + i);
        break;
    }
}

// 默认逻辑
if (!anchor) {
    console.log('[Default] 未匹配,执行默认解锁');
    data = [Object.assign({}, receipt, expirestime)];
    ddm.receipt.in_app = data;
    ddm.latest_receipt_info = data;
    ddm.pending_renewal_info = [{
        'product_id': yearlyid,
        'original_transaction_id': '490001314520000',
        'auto_renew_product_id': yearlyid,
        'auto_renew_status': '1'
    }];
    ddm.latest_receipt = 'ddm1023';
}

$done({
    'body': JSON.stringify(ddm)
});
