// Vercel serverless function — keeps the OpenAI key server-side.
// Plain CJS on purpose: Vercel compiled the .ts version to ESM but ran it as
// CommonJS ("Unexpected token 'export'"). No types were lost — it was all `any`.
// ponytail: in-memory per-instance rate limit — good enough to stop casual abuse
// of the OpenAI key; move to Vercel WAF rate rules or KV if it ever matters.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 10;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return res
      .status(429)
      .json({ error: "Too many requests — try again in a minute" });
  }

  const { title, overview } = req.body ?? {};
  if (typeof title !== "string" || !title || typeof overview !== "string") {
    return res.status(400).json({ error: "title and overview are required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Summarise the movie "${title.slice(0, 200)}" in 3 short bullet points.
      - Keep the tone engaging, like a teaser or movie poster.
      - Highlight the setting, main theme, and genre without revealing key plot twists or the ending.
      - Do not include spoilers.\n\nOverview: ${overview.slice(0, 2000)}`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!upstream.ok) {
    return res
      .status(502)
      .json({ error: `OpenAI request failed (${upstream.status})` });
  }

  const data = await upstream.json();
  return res
    .status(200)
    .json({ summary: data.choices[0].message.content.trim() });
};
