/*
Quantumult X 脚本: 解锁快连小火箭加速器黄金会员
说明: 修改 /api/mobile/users/profile 响应数据，模拟黄金会员权益。

[rewrite_local]
^https:\/\/kuranode\.com\/api\/mobile\/users\/profile url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/vpntest.js

[mitm]
hostname = kuranode.com
*/

let body = JSON.parse($response.body);

// 覆写为黄金会员数据
// 注意: uuid 保持原封不动，因为它是实际连接凭证
const originalUuid = body.data && body.data.uuid ? body.data.uuid : "5cf3ea3c-fcfc-4437-bddf-491782c018ca";
const originalToken = body.data && body.data.token ? body.data.token : "94ebb255b93718ba5c7d995c2475602f";

const goldProfile = {
    "status": "success",
    "data": {
        "expired_at": 1798732800, // 2027-01-01
        "reset_day": 1,
        "subscribe_url": "https://10.170.0.14/api/v1/client/subscribe?token=" + originalToken,
        "u": 0,
        "d": 0,
        "uuid": originalUuid,
        "email": "vip_user@guest.com",
        "transfer_enable": 1099511627776, // 1TB
        "token": originalToken,
        "plan_id": 3,
        "plan": {
            "month_price": 3000,
            "half_year_price": 15000,
            "group_id": 4, // 黄金会员权限组
            "speed_limit": 0, // 不限速
            "two_year_price": 50000,
            "reset_price": 0,
            "year_price": 28000,
            "onetime_price": 0,
            "capacity_limit": null,
            "sort": 1,
            "quarter_price": 8000,
            "updated_at": 1760530285,
            "name": "黄金会员年付",
            "id": 3,
            "show": 1,
            "renew": 1,
            "three_year_price": 0,
            "transfer_enable": 1024,
            "reset_traffic_method": null,
            "created_at": 1669876634,
            "content": "黄金会员尊享无限流量与光速节点"
        }
    }
};

$done({ body: JSON.stringify(goldProfile) });
