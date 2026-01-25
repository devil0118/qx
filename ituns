/*************************************
* 项目名称: iTunes 系列解锁合集 (反编译版)
* 更新日期: 2026-01-07
* 脚本作者: @ddm1023
* 功能说明: 劫持App Store收据验证请求,伪造订阅状态
* 
* ⚠️ 警告: 此脚本仅供学习研究,请勿用于商业用途
* 
* 使用方法:
* [rewrite_local]
* ^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body iTunes_Deobfuscated.js
* 
* [mitm]
* hostname = buy.itunes.apple.com
*************************************/
// ========== 全局变量 ==========
const responseData = JSON.parse($response.body);
const userAgent = $request.headers["User-Agent"] || $request.headers["user-agent"];
const bundleId = responseData.receipt["bundle_id"] || responseData.receipt["Bundle_Id"];
// 动态生成产品ID
const yearlyProductId = `${bundleId}.year`;
const yearlySubscriptionId = `${bundleId}.yearly`;
const yearlySubscription2Id = `${bundleId}.yearlysubscription`;
const lifetimeProductId = `${bundleId}.lifetime`;
// ========== 应用配置列表 ==========
/**
 * 配置说明:
 * - cm: 订阅类型 (timea=年订阅, timeb=永久, timec=按版本, timed=多产品)
 * - hx: 处理方式 (hxpda=标准处理, hxpdb=特殊处理1, hxpdc=特殊处理2)
 * - id: 主产品ID
 * - ids: 备用产品ID (用于timed类型)
 * - latest: 最新版本标识
 * - version: 指定应用版本
 */
const AppConfigList = {
    'PulseWatch': {
        cm: 'timeb',
        hx: 'hxpda',
        id: "relaxlife_ebp",
        latest: "ddm1023"
    }, // RelaxWatch:AI智能压力监测
    'PicCompress': {
        cm: 'timea',
        hx: 'hxpda',
        id: "pc_vip_new_1y",
        latest: "ddm1023"
    }, // 图片压缩
    'XiangCePhoto': {
        cm: 'timeb',
        hx: 'hxpda',
        id: "ql128",
        latest: "ddm1023"
    }, // 相册清理-删除重复照片
    'FileMaster': {
        cm: 'timeb',
        hx: 'hxpda',
        id: "FileMaster_ProVersion",
        latest: "ddm1023"
    }, // 文件大师
    'Squeeze': {
        cm: 'timea',
        hx: 'hxpda',
        id: "uk.co.olsonapps.kegeltrainerlite.yearly",
        latest: "ddm1023"
    },
  'HttpCatcher': {
      cm: 'timeb',      // 永久订阅
      hx: 'hxpda',      // 标准处理
      id: 'com.imxiaozhi.HttpCatcher.Pro',
      latest: 'ddm1023'
    }
};
// ========== 收据模板 ==========
/**
 * 标准IAP收据结构
 * 所有时间设置为2099年,模拟永久订阅
 */
const ReceiptTemplate = {
    'quantity': '1',
    'purchase_date_ms': '9999999999999',
    'is_in_intro_offer_period': 'false',
    'transaction_id': '490001314520000',
    'is_trial_period': 'false',
    'original_transaction_id': '490001314520000',
    'purchase_date': '2099-09-09 09:09:09 Etc/GMT',
    'product_id': yearlyProductId, // 动态设置
    'original_purchase_date_pst': '2099-09-09 02:09:09 America/Los_Angeles',
    'in_app_ownership_type': 'PURCHASED',
    'original_purchase_date_ms': '9999999999999',
    'web_order_line_item_id': '490000123456789',
    'purchase_date_pst': '2099-09-09 02:09:09 America/Los_Angeles',
    'original_purchase_date': '2099-09-09 09:09:09 Etc/GMT'
};
/**
 * 订阅过期时间模板
 * 设置为2099年,确保订阅永不过期
 */
const ExpirationTemplate = {
    'expires_date': '2099-09-09 09:09:09 Etc/GMT',
    'expires_date_pst': '2099-09-09 06:06:06 America/Los_Angeles',
    'expires_date_ms': '9999999999999'
};
// ========== 核心逻辑 ==========
/**
 * 检查脚本开关状态
 * 从持久化存储读取配置
 */
function getScriptSwitch() {
    try {
        // Surge/Shadowrocket 支持
        if (typeof $persistentStore !== 'undefined' && typeof $persistentStore.read === 'function') {
            const value = $persistentStore.read('iTunes_Script_Switch');
            console.log(`[Switch] 从$persistentStore读取: ${value}`);
            return value;
        }
        // Quantumult X 支持
        if (typeof $prefs !== 'undefined' && typeof $prefs.valueForKey === 'function') {
            const value = $prefs.valueForKey('iTunes_Script_Switch');
            console.log(`[Switch] 从$prefs读取: ${value}`);
            return value;
        }
        console.log('[Switch] 未找到持久化存储接口');
    } catch (error) {
        console.log('[Switch] 读取配置时发生错误: ' + error.message);
    }
    return null;
}
/**
 * 主函数: 处理收据验证请求
 */
function main() {
    // 检查脚本开关
    const scriptSwitch = getScriptSwitch();
    const isEnabled = scriptSwitch === 'true' || scriptSwitch === true;
    console.log(`[Main] 脚本开关状态: ${scriptSwitch}`);
    if (!isEnabled) {
        console.log('[Main] 脚本已禁用,跳过处理');
        $notification.post(
            'iTunes解锁脚本',
            '脚本已禁用',
            '请在配置中启用开关'
        );
        $done();
        return;
    }
    // 尝试匹配应用配置
    let matchedConfig = null;
    let matchedIdentifier = null;
    for (const identifier in AppConfigList) {
        const regex = new RegExp('^' + identifier, 'i');
        // 匹配User-Agent或Bundle ID
        if (regex.test(userAgent) || regex.test(bundleId)) {
            matchedConfig = AppConfigList[identifier];
            matchedIdentifier = identifier;
            console.log(`[Match] 成功匹配应用: ${identifier}`);
            break;
        }
    }
    // 生成收据数据
    let inAppData = [];
    if (matchedConfig) {
        const { cm, hx, id, ids, latest, version } = matchedConfig;
        // 创建基础收据
        const baseReceipt = Object.assign({}, ReceiptTemplate, { 'product_id': id });
        // 根据订阅类型生成数据
        switch (cm) {
            case 'timea': // 年订阅(带过期时间)
                inAppData = [Object.assign({}, baseReceipt, ExpirationTemplate)];
                break;
            case 'timeb': // 永久订阅(无过期时间)
                inAppData = [baseReceipt];
                break;
            case 'timec': // 按版本控制
                inAppData = [];
                break;
            case 'timed': // 多产品订阅
                inAppData = [
                    Object.assign({}, baseReceipt, ExpirationTemplate, { 'product_id': ids }),
                    Object.assign({}, baseReceipt, ExpirationTemplate, { 'product_id': id })
                ];
                break;
        }
        // 根据处理方式修改响应
        if (hx.includes('hxpda')) {
            // 标准处理: 修改receipt和latest_receipt_info
            responseData.receipt.in_app = inAppData;
            responseData.latest_receipt_info = inAppData;
            responseData.pending_renewal_info = [{
                'product_id': id,
                'original_transaction_id': '490001314520000',
                'auto_renew_product_id': id,
                'auto_renew_status': '1'
            }];
            responseData.latest_receipt = latest;
        } else if (hx.includes('hxpdb')) {
            // 特殊处理1: 仅修改receipt
            responseData.receipt.in_app = inAppData;
        } else if (hx.includes('hxpdc')) {
            // 特殊处理2: 使用自定义收据格式
            const customReceipt = {
                'expires_date_formatted': '2099-09-09 09:09:09 Etc/GMT',
                'expires_date': '9999999999999',
                'expires_date_formatted_pst': '2099-09-09 06:06:06 America/Los_Angeles',
                'product_id': id
            };
            responseData.subscriber = Object.assign({}, responseData.subscriber, customReceipt);
            responseData.subscription = Object.assign({}, responseData.subscription, customReceipt);
            responseData.status = 0;
            responseData.is_sandbox = 1;
            responseData.subscribed = id;
            delete responseData.expirationTime;
            delete responseData.message;
        }
        // 设置版本信息
        if (version && version.trim() !== '') {
            responseData.receipt.app_version = version;
        }
        console.log('[Success] 收据修改成功');
    } else {
        // 未匹配到配置,使用默认处理
        console.log('[Default] 未匹配到应用配置,使用默认设置');
        inAppData = [Object.assign({}, ReceiptTemplate, ExpirationTemplate)];
        responseData.receipt.in_app = inAppData;
        responseData.latest_receipt_info = inAppData;
        responseData.pending_renewal_info = [{
            'product_id': yearlyProductId,
            'original_transaction_id': '490001314520000',
            'auto_renew_product_id': yearlyProductId,
            'auto_renew_status': '1'
        }];
        responseData.latest_receipt = 'ddm1023';
    }
    // 返回修改后的响应
    $done({ 'body': JSON.stringify(responseData) });
}
// ========== 执行主函数 ==========
main();
