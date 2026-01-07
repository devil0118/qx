/*
ABCLearning - user/info
[rewrite_local]
^https:\/\/ios\.abc-learning\.net\/api\/v1\/learning\/user\/info url script-response-body ABCLearning.js
[mitm]
hostname = ios.abc-learning.net
*/

var body = $response.body;

try {
    // 检查是否需要解析
    var obj;
    if (typeof body === "string") {
        obj = JSON.parse(body);
    } else {
        obj = body;
    }
    if (obj && obj.data) {
        obj.data.level = "激活码";
        obj.data.validity_date = 1861199999;
        body = JSON.stringify(obj);
        console.log("ABCLearning ✅ 修改成功" + body);
    }
} catch (e) {
    $notify("ABCLearning", "❌ 错误", String(e));
}

$done({ body: body });
