export default async function handler(req, res) {
  // 目标 API 地址通过查询参数传递
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // 转发请求到目标 API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { ...req.headers, host: new URL(targetUrl).host },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // 将响应内容和状态码返回给前端
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
}