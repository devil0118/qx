/*
ABCLearning - user/info
*/

var obj = JSON.parse($response.body);

if (obj.data) {
    obj.data.level = "激活码";
    obj.data.validity_date = Math.floor(Date.now() / 1000) + 315360000;
}
console.log(obj)
$done({ body: JSON.stringify(obj) });
