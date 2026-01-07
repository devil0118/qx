var obj = JSON.parse($response.body);
var tenYearsLater = Math.floor(Date.now() / 1000) + 315360000;
if (obj.data) {
    // 结构1: data 直接包含 level 和 validity_date
    if (obj.data.hasOwnProperty("level")) {
        obj.data.level = "激活码";
        obj.data.validity_date = tenYearsLater;
    }
    
    // 结构2: data.user 包含 level 和 validity_date
    if (obj.data.user && obj.data.user.hasOwnProperty("level")) {
        obj.data.user.level = "激活码";
        obj.data.user.validity_date = tenYearsLater;
    }
}
$done({ body: JSON.stringify(obj) });
