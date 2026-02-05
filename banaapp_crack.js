/*******************************

[rewrite_local]
^https:\/\/api\d+\.[a-z]+api\.(com|org|net)\/bana\/v1\/banalogin url script-response-body https://raw.githubusercontent.com/devil0118/qx/refs/heads/main/banaapp_crack.js
[mitm] 
hostname = api*.bkrapi.com, api*.bjpapi.com, api*.busapi.org, api*.*api.com, api*.*api.org, api*.*api.net

*******************************/

let obj = {};

if (typeof $response !== "undefined") {
  let body = JSON.parse($response.body || null);

  if (body && body.status === 1) {
    // --- 1. 修改外层基本信息 ---
    body.level = 3;
    body.class = 3;
    body.class_expire = "2099-12-31 23:59:59";
    body.expired = "2099-12-31 23:59:59";
    body.exp = 4102415999;
    body.transfer_enable = "99TB";
    body.remaining_traffic = "99TB";

    // --- 2. 深度修改 ip1 数据 (尝试管理员和最高权限) ---
    if (body.ip1) {
      body.ip1.level = 3;
      body.ip1.class = 3;
      body.ip1.is_admin = true;        // 尝试开启管理员标识
      body.ip1.node_group = 3;         // 匹配节点分组
      body.ip1.node_speedlimit = 0;    // 0 通常表示不限速
      body.ip1.node_connector = 10;    // 增加并发连接数

      body.ip1.transfer_enable = 108850559123456;
      body.ip1.u = 0;
      body.ip1.d = 0;
      body.ip1.class_expire = "2099-12-31 23:59:59";
      body.ip1.expire_in = "2099-12-31 23:59:59";
    }

    // --- 3. 核心修改：处理嵌套的 config 字符串 ---
    // 部分 App 会直接解析并使用这个 JSON 字符串里的配置
    if (body.config) {
      try {
        // 将 config 字符串里的等级和分组信息也强制替换
        // 注意：由于是字符串，我们先尝试简单的正则替换
        body.config = body.config.replace(/"level":\s*1/g, '"level":3');
        body.config = body.config.replace(/"class":\s*1/g, '"class":3');
        body.config = body.config.replace(/"node_group":\s*\d+/g, '"node_group":3');
      } catch (e) {
        console.log("Config string modification failed: " + e);
      }
    }

    obj.body = JSON.stringify(body);
  }
}

$done(obj);
