/*
ABCLearning - 完整版
[rewrite_local]
^https:\/\/ios\.abc-learning\.net\/api\/v.*\/learning\/(user\/info|account\/info|home\/layout) url script-response-body ABCLearning.js
[mitm]
hostname = ios.abc-learning.net
*/

var obj = JSON.parse($response.body);
var now = Math.floor(Date.now() / 1000);
var twoYearsLater = now + 63072000;
var tenYearsLater = now + 315360000;
var today = new Date();
var todayStr = today.getFullYear() + "." + String(today.getMonth() + 1).padStart(2, "0") + "." + String(today.getDate()).padStart(2, "0");
var tenYearsLaterStr = (today.getFullYear() + 10) + "." + String(today.getMonth() + 1).padStart(2, "0") + "." + String(today.getDate()).padStart(2, "0");

if (obj.data) {
    
    // ========== user/info 接口 ==========
    // 结构1: data 直接包含 level
    if (obj.data.hasOwnProperty("level")) {
        obj.data.level = "激活码";
        obj.data.validity_date = tenYearsLater;
    }
    // 结构2: data.user 包含 level
    if (obj.data.user) {
        obj.data.user.level = "激活码";
        obj.data.user.validity_date = tenYearsLater;
    }
    
    // ========== account/info 接口 ==========
    // is_vip
    if (obj.data.hasOwnProperty("is_vip")) {
        obj.data.is_vip = true;
    }
    // vip_rights
    if (obj.data.hasOwnProperty("vip_rights")) {
        obj.data.vip_rights = "激活码";
    }
    // validity_date (字符串格式)
    if (obj.data.hasOwnProperty("validity_date") && typeof obj.data.validity_date === "string") {
        obj.data.validity_date = tenYearsLaterStr;
    }
    // orders 数组
    if (obj.data.orders && Array.isArray(obj.data.orders)) {
        obj.data.orders.forEach(function(order) {
            order.end_date = tenYearsLaterStr;
            order.buy_content = "激活码";
        });
    }
    // orders 为 null 时创建一个
    if (obj.data.orders === null) {
        obj.data.orders = [{
            "end_date": tenYearsLaterStr,
            "state": "使用中",
            "price": 0,
            "buy_content": "激活码",
            "buy_date": todayStr
        }];
        obj.data.validity_date = tenYearsLaterStr;
    }
    
    // ========== home/layout 接口 (新增) ==========
    // free_chat_count
    if (obj.data.hasOwnProperty("free_chat_count")) {
        obj.data.free_chat_count = 100;
    }
    // vip_expire_time (两年后时间戳)
    if (obj.data.hasOwnProperty("vip_expire_time")) {
        obj.data.vip_expire_time = twoYearsLater;
    }
    // vip_name
    if (obj.data.hasOwnProperty("vip_name")) {
        obj.data.vip_name = "激活码";
    }
}

$done({ body: JSON.stringify(obj) });
