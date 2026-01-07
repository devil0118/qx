var body = $response.body;
var url = $request.url;
var body = $response.body;
var url = $request.url;
// 处理余额接口 - 将所有余额字段改为 100
if (url.indexOf('/pay/balance') != -1) {
    var obj = JSON.parse(body);
    
    // 修改所有余额相关字段为 100
    obj.isPromoting = 100;
    obj.giftBalance = 100;
    obj.peerExpiryBalance = 100;
    obj.peerBalance = 100;
    obj.paperBalance = 100;
    obj.expiryBalance = 100;
    obj.incentive = 100;
    obj.balance = 100;
    obj.peerGiftBalance = 100;
    
    body = JSON.stringify(obj);
}
$done({ body });
