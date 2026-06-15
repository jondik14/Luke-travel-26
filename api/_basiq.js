// Shared helper for talking to Basiq (Open Banking aggregator).
// File is prefixed with `_` so Vercel doesn't expose it as its own endpoint.

const BASIQ_BASE = 'https://au-api.basiq.io';
const BASIQ_VERSION = '3.0';

// Basiq's Basic auth expects the dashboard API key base64-encoded as the credential.
async function getServerToken() {
  const apiKey = process.env.BASIQ_API_KEY;
  if (!apiKey) throw new Error('BASIQ_API_KEY is not set');

  const res = await fetch(BASIQ_BASE + '/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(apiKey).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'basiq-version': BASIQ_VERSION,
    },
    body: 'scope=SERVER_ACCESS',
  });
  if (!res.ok) throw new Error('Basiq token request failed (' + res.status + '): ' + await res.text());
  const data = await res.json();
  return data.access_token;
}

module.exports = { BASIQ_BASE, BASIQ_VERSION, getServerToken };
