export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") return res.status(405).json({ok:false,error:"Method not allowed"});
  const target = process.env.GAS_WEB_APP_URL;
  if (!target) return res.status(500).json({ok:false,error:"GAS_WEB_APP_URL belum diatur di Vercel"});
  try {
    const r = await fetch(target, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(req.body || {})
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { return res.status(502).json({ok:false,error:"Apps Script mengembalikan respons bukan JSON"}); }
    res.setHeader("Cache-Control","no-store");
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(502).json({ok:false,error:e.message || "Gagal menghubungi Apps Script"});
  }
}
