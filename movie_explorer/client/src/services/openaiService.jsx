export const getMovieSummary = async (title, overview) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('Missing OpenAI API key');
    return 'Error: Missing API key.';
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_API_KEY`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Summarise the movie "${title}" in 3 short bullet points. 
      - Keep the tone engaging, like a teaser or movie poster. 
      - Highlight the setting, main theme, and genre without revealing key plot twists or the ending. 
      - Do not include spoilers.\n\nOverview: ${overview}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('OpenAI error:', error);
      return 'Error generating summary.';
    }

    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('Fetch failed:', err);
    return 'AI request failed.';
  }
};

 
