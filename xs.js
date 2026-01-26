/*
[rewrite_local]
^https://api.purchasely.io/paab/user_purchases url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js
[mitm]
hostname = api.purchasely.io
*/

var body = JSON.parse($response.body);

var premiumSubscription = {
  "id": "11111111-2222-3333-4444-555555555555",
  "plan_id": "ios_vpn360_365_99.99_trial",  // <--- 使用这个 ID
  "next_renewal_at": "2026-12-31T23:59:59Z",
  "purchase_token": "sandbox_token",
  "offer_type": "FREE_TRIAL",
  "original_purchased_at": "2026-01-01T00:00:00Z",
  "subscription_status": "AUTO_RENEWING",
  "store_country": "CN",
  "environment": "PRODUCTION",
  "is_family_shared": false,
  "store_type": "APPLE_APP_STORE"
};

body.active_subscriptions = [premiumSubscription];
$done({ body: JSON.stringify(body) });
