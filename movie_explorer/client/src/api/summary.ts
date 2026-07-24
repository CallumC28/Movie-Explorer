export async function getMovieSummary(
  title: string,
  overview: string,
): Promise<string> {
  const res = await fetch("/api/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, overview }),
  });

  if (!res.ok) {
    throw new Error(`Summary request failed (${res.status})`);
  }

  const data = await res.json();
  return data.summary;
}
