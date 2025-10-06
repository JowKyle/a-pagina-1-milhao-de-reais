import fetch from 'node-fetch'
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST');
  const { items, metadata } = req.body;
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  try {
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items,
        notification_url: process.env.WEBHOOK_FULL_URL,
        metadata,
        back_urls: {
          success: process.env.BACK_URL_SUCCESS,
          failure: process.env.BACK_URL_FAILURE,
          pending: process.env.BACK_URL_SUCCESS
        }
      })
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'create preference failed' });
  }
}
