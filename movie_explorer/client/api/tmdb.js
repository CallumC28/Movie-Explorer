// Vercel serverless proxy — keeps the TMDB key server-side (same pattern as summary.js).
// /api/tmdb/trending/movie/week is rewritten to /api/tmdb?path=trending/movie/week
// in vercel.json (catch-all [...path].js files only work in Next.js, not the bare api dir).
module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB_API_KEY is not configured" });
  }

  const { path = "", ...query } = req.query;
  const search = new URLSearchParams({ ...query, api_key: apiKey });
  const url = `https://api.themoviedb.org/3/${[].concat(path).join("/")}?${search}`;

  const upstream = await fetch(url);
  if (!upstream.ok) {
    return res
      .status(upstream.status)
      .json({ error: `TMDB request failed (${upstream.status})` });
  }

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json(await upstream.json());
};
