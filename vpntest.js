/**

[rewrite_local]
^https:\/\/.*jcjjym\.xyz\/.* url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/vpntest.js

[mitm]
hostname = *.jcjjym.xyz
**/

var body = $response.body;
var url = $request.url;
var obj = JSON.parse(body);

const VIP_EXPIRE_TIME = 4092599349; // 2099-09-09
const VIP_FLAG = 1; // 尝试用 1 或 true

// 递归函数：遍历 JSON 对象，查找并修改关键字段
// 这种方式比硬编码路径更强大，能适应未知的 JSON 结构
function traverseAndModify(node) {
    if (typeof node === 'object' && node !== null) {
        for (var key in node) {
            // 1. 修改特定字段 (基于静态分析发现的关键词)
            if (key === 'userTrialPremiumPackagesFlags' || key === 'userAvailableCoins') {
                node[key] = 999999;
            }
            if (key === 'is_vip' || key === 'vip' || key === 'isVip') {
                node[key] = true;
            }
            if (key === 'vip_level' || key === 'level') {
                node[key] = 10;
            }
            if (key === 'expire_time' || key === 'end_time' || key === 'expireAt') {
                node[key] = VIP_EXPIRE_TIME;
            }
            if (key === 'plan' || key === 'package') {
                // 如果是字符串，尝试改为高级套餐名；如果是对象，继续递归
                if (typeof node[key] === 'string' && node[key] !== 'premium') {
                    node[key] = 'premium';
                }
            }

            // 2. 递归处理子对象
            traverseAndModify(node[key]);
        }
    }
}

if (obj) {
    // 执行递归修改
    traverseAndModify(obj);

    // 3. 针对 userSystemPlans (套餐列表) 的特殊处理
    // 静态分析发现了 "userSystemPlans" 字符串，推测是返回可用套餐列表
    // 我们可以尝试把所有套餐价格改为 0，或者直接伪造一个已拥有的套餐
    if (obj.userSystemPlans && Array.isArray(obj.userSystemPlans)) {
        obj.userSystemPlans.forEach(plan => {
            plan.price = 0;
            plan.is_active = true;
        });
    }

    $done({body: JSON.stringify(obj)});
} else {
    $done({});
}
