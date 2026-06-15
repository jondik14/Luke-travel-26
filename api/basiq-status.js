// Reports whether the configured Basiq user has any connected bank accounts.

const { BASIQ_BASE, BASIQ_VERSION, getServerToken } = require('./_basiq');

module.exports = async function handler(req, res) {
  try {
    const userId = process.env.BASIQ_USER_ID;
    if (!userId) return res.status(200).json({ connected: false, accounts: [] });

    const token = await getServerToken();
    const r = await fetch(BASIQ_BASE + '/users/' + userId + '/accounts', {
      headers: {
        Authorization: 'Bearer ' + token,
        'basiq-version': BASIQ_VERSION,
      },
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });

    const accounts = (data.data || []).map(function (a) {
      return { name: a.name, institution: a.institution, balance: a.balance, currency: a.currency };
    });
    res.status(200).json({ connected: accounts.length > 0, accounts: accounts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
