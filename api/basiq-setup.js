// One-time setup: creates the single Basiq user for this app.
// Visit /api/basiq-setup?email=you@example.com once, then add the
// returned userId as the BASIQ_USER_ID env var in Vercel and redeploy.

const { BASIQ_BASE, BASIQ_VERSION, getServerToken } = require('./_basiq');

module.exports = async function handler(req, res) {
  try {
    if (process.env.BASIQ_USER_ID) {
      return res.status(200).json({
        userId: process.env.BASIQ_USER_ID,
        note: 'BASIQ_USER_ID is already configured — nothing to do.',
      });
    }

    const email = (req.query.email || '').trim();
    if (!email) {
      return res.status(400).json({ error: 'Add ?email=you@example.com to the URL the first time you call this.' });
    }

    const token = await getServerToken();
    const r = await fetch(BASIQ_BASE + '/users', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'basiq-version': BASIQ_VERSION,
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });

    res.status(200).json({
      userId: data.id,
      next: 'Add BASIQ_USER_ID=' + data.id + ' as a Vercel environment variable, then redeploy.',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
