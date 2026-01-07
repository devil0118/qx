/*
ABCLearning - Debug Version
*/

// 调试：打印请求信息
console.log("========== ABCLearning 脚本开始 ==========");
console.log("请求 URL: " + $request.url);

if (typeof $response !== "undefined" && $response.body) {
    let body = JSON.parse($response.body);
    
    // 调试：打印原始响应（截取前500字符避免太长）
    console.log("原始响应: " + JSON.stringify(body).substring(0, 500));
    
    function modifyObject(obj, path = "") {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let currentPath = path ? path + "." + key : key;
                
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    modifyObject(obj[key], currentPath);
                } else {
                    switch (key) {
                        case "is_vip":
                            console.log("🔧 修改 " + currentPath + ": " + obj[key] + " -> 1");
                            obj[key] = 1;
                            break;
                        case "is_lock":
                            console.log("🔓 修改 " + currentPath + ": " + obj[key] + " -> 0");
                            obj[key] = 0;
                            break;
                        case "is_free":
                            console.log("🆓 修改 " + currentPath + ": " + obj[key] + " -> 1");
                            obj[key] = 1;
                            break;
                    }
                }
            }
        }
    }
    
    modifyObject(body);
    $response.body = JSON.stringify(body);
    
    // 调试：打印修改后响应（截取前500字符）
    console.log("修改后响应: " + $response.body.substring(0, 500));
} else {
    console.log("⚠️ 响应体为空或不存在");
}

console.log("========== ABCLearning 脚本结束 ==========");

$done({ body: $response.body });
