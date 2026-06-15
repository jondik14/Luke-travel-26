// Creates a hosted Basiq Connect link for the configured user.
// The frontend opens the returned URL — bank credentials are entered
// on Basiq's hosted page and never touch this app or its server.

const { BASIQ_BASE, BASIQ_VERSION, getServerToken } = require('./_basiq');

module.exports = async function handler(req, res) {
  try {
    const userId = process.env.BASIQ_USER_ID;
    if (!userId) return res.status(400).json({ error: 'BASIQ_USER_ID is not configured yet — visit /api/basiq-setup first.' });

    const token = await getServerToken();
    const r = await fetch(BASIQ_BASE + '/users/' + userId + '/auth_link', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'basiq-version': BASIQ_VERSION,
      },
      body: '{}',
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });

    res.status(200).json({ url: data.links.public });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
