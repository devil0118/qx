/*
ABCLearning - user/info
[rewrite_local]
^https:\/\/ios\.abc-learning\.net\/api\/v1\/learning\/user\/info url script-response-body ABCLearning.js
[mitm]
hostname = ios.abc-learning.net
*/

if (typeof $response !== "undefined" && $response.body) {
    let body = JSON.parse($response.body);
    
    if (body.data) {
        // 修改 level 为 "激活码"
        body.data.level = "激活码";
        
        // 修改 validity_date 为 10 年后的时间戳（秒）
        let tenYearsLater = Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60);
        body.data.validity_date = tenYearsLater;
        console.log("ABC "+body.data)
    }
    
    $response.body = JSON.stringify(body);
}

$done({ body: $response.body });
