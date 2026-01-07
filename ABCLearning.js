/*
ABCLearning - user/info
[rewrite_local]
^https:\/\/ios\.abc-learning\.net\/api\/v1\/learning\/user\/info url script-response-body ABCLearning.js
[mitm]
hostname = ios.abc-learning.net
*/

var body = $response.body;

try {
    $notify(body);
} catch (e) {
    $notify("ABCLearning", "❌ 错误", String(e));
}

$done({ body: body });
