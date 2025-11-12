exports.handler = async function(event) {
  // Only POST requests supported
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed - use POST' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const url = process.env.GEMINI_TEXT_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!url || !apiKey) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing GEMINI_TEXT_URL or GEMINI_API_KEY in environment' })
      };
    }

    // Forward the request to the external Gemini text endpoint
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const text = await resp.text();

    return {
      statusCode: resp.status,
      headers: {
        'Content-Type': resp.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err?.message || String(err) })
    };
  }
};
