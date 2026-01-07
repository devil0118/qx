/*
ABCLearning - Notify Debug
*/

if (typeof $response !== "undefined" && $response.body) {
    let body = JSON.parse($response.body);
    let modCount = 0;
    
    function modifyObject(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    modifyObject(obj[key]);
                } else {
                    switch (key) {
                        case "is_vip":
                            obj[key] = 1;
                            modCount++;
                            break;
                        case "is_lock":
                            obj[key] = 0;
                            modCount++;
                            break;
                        case "is_free":
                            obj[key] = 1;
                            modCount++;
                            break;
                    }
                }
            }
        }
    }
    
    modifyObject(body);
    $response.body = JSON.stringify(body);
    
    // 弹出通知显示结果
    $notify("ABCLearning", "修改了 " + modCount + " 个字段", $request.url);
} else {
    $notify("ABCLearning", "⚠️ 响应体为空", $request.url);
}

$done({ body: $response.body });
