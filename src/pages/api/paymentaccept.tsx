import type { NextApiRequest, NextApiResponse } from 'next';

//receving the payment transaction details from payment gateway
export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const statusCode = JSON.parse(req.body['redirect'])['transactions'][
      'transaction'
    ][0]['status']['code'];
    res.redirect(302, `/paymentprocess?status=${statusCode}`);
  }
}
