import fetch from 'node-fetch'
import { buffer } from 'micro'
export const config = { api: { bodyParser: true } }

export default async function handler(req, res) {
  // Mercado Pago sends notifications with data.id in body
  try {
    const id = req.body && req.body.data && req.body.data.id;
    if (!id) return res.status(400).send('no id');
    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
    });
    const payment = await paymentRes.json();
    if (payment.status === 'approved') {
      // TODO: mark payment in DB, create pixel record (status=paid), send upload link by email
      console.log('Payment approved', payment);
    } else {
      console.log('Payment status', payment.status);
    }
    return res.status(200).send('ok');
  } catch (err) {
    console.error(err);
    return res.status(500).send('error');
  }
}
