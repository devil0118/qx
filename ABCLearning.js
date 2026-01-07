/*
ABCLearning - user/info
[rewrite_local]
^https:\/\/ios\.abc-learning\.net\/api\/v1\/learning\/user\/info url script-response-body ABCLearning.js
[mitm]
hostname = ios.abc-learning.net
*/

if (typeof $response !== "undefined" && $response.body) {
     let body = JSON.parse($response.body);
     console.log("原始响应: " + JSON.stringify(body));
    

     $response.body = JSON.stringify(body);
    
}
