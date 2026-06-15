// Returns recent bank transactions for the configured Basiq user,
// simplified to just what the Budget tab needs.

const { BASIQ_BASE, BASIQ_VERSION, getServerToken } = require('./_basiq');

module.exports = async function handler(req, res) {
  try {
    const userId = process.env.BASIQ_USER_ID;
    if (!userId) return res.status(400).json({ error: 'BASIQ_USER_ID is not configured yet — visit /api/basiq-setup first.' });

    const token = await getServerToken();
    const r = await fetch(BASIQ_BASE + '/users/' + userId + '/transactions?limit=500', {
      headers: {
        Authorization: 'Bearer ' + token,
        'basiq-version': BASIQ_VERSION,
      },
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });

    const transactions = (data.data || []).map(function (t) {
      return {
        id: t.id,
        date: (t.postDate || t.transactionDate || '').slice(0, 10),
        description: t.description,
        amount: parseFloat(t.amount),
        category: (t.subClass && t.subClass.title) || t.class || '',
      };
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });

    res.status(200).json({ transactions: transactions });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
