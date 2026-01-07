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
    
    $notify("ABCLearning", "body类型: " + typeof body, "obj类型: " + typeof obj);
    
    if (obj && obj.data) {
        obj.data.level = "激活码";
        obj.data.validity_date = Math.floor(Date.now() / 1000) + 315360000;
        body = JSON.stringify(obj);
        $notify("ABCLearning", "✅ 修改成功", "");
    }
} catch (e) {
    $notify("ABCLearning", "❌ 错误", String(e));
}

$done({ body: body });
