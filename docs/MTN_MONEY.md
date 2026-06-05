name: MTN Money Provider

Integration with MTN Money mobile money service for West Africa.

## Configuration

Set the following environment variables:

```
MTN_MONEY_API_KEY=your_api_key
MTN_MONEY_BASE_URL=https://api.mtnmoney.ci
MTN_PARTNER_ID=your_partner_id
```

## Features

- Send money to MTN Money users
- Check transaction status
- Error handling and retry logic
- Automatic fee calculation

## Usage

```typescript
import { MTNMoneyProvider } from '@services/providers';

const provider = new MTNMoneyProvider({
  apiKey: process.env.MTN_MONEY_API_KEY,
  baseUrl: process.env.MTN_MONEY_BASE_URL,
  partnerId: process.env.MTN_PARTNER_ID,
});

const result = await provider.sendMoney({
  recipientPhone: '+22501234567',
  amount: 10000,
  provider: 'mtn_money',
  description: 'Payment'
});
```

## Fee Structure

- Standard fee: 1.8% per transaction
- Minimum: 100 XOF
- Maximum: No limit

## Status Codes

- `processing` - Transaction is being processed
- `completed` - Transaction completed successfully
- `failed` - Transaction failed
- `pending` - Awaiting confirmation
