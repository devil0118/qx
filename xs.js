/**

[rewrite_local]
^http:\/\/43\.155\.109\.221\/servers\/index\.txt$ url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/xs.js

[mitm]
hostname = 43.155.109.221

*/

const body = $response.body;
console.log("[Xiashi Server] Processing list...");

// Replace VIP flag '1' with '0' (Free)
// Pattern looks like: IP, Flag, Country, ...
// Example: 146.190.157.232, 1,h;
// We look for ", 1," or ", 1" followed by boundaries.

const newBody = body.replace(/(,\s*)1(\s*,)/g, '$10$2');

console.log("[Xiashi Server] Patch applied (VIP -> Free)");
$done({ body: newBody });
