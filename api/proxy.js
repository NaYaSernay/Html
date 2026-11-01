export default async function handler(req, res) {
  // 1. 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. 获取前端传来的目标 API 地址
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: '缺少 url 参数' });
  }

  try {
    // 3. 伪装请求头，防止被网易云/QQ音乐识别为机器请求
    const headers = { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    // 4. 如果是请求 NekoMusic，自动加上你的 Client ID 请求头
    if (targetUrl.includes('cnmsb.xin')) {
        headers['X-Neko-Client'] = 'nkc_pub_b2b41a1a70e64687a74a';
    }

    const response = await fetch(targetUrl, { method: 'GET', headers });
    const data = await response.text();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
