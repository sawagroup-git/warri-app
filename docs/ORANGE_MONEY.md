name: Orange Money Provider

Integration with Orange Money mobile money service for West Africa.

## Configuration

Set the following environment variables:

```
ORANGE_MONEY_API_KEY=your_api_key
ORANGE_MONEY_BASE_URL=https://api.orangemoney.ci
```

## Features

- Send money to Orange Money users
- Check transaction status
- Error handling and retry logic
- Automatic fee calculation

## Usage

```typescript
import { OrangeMoneyProvider } from '@services/providers';

const provider = new OrangeMoneyProvider({
  apiKey: process.env.ORANGE_MONEY_API_KEY,
  baseUrl: process.env.ORANGE_MONEY_BASE_URL,
});

const result = await provider.sendMoney({
  recipientPhone: '+22501234567',
  amount: 10000,
  provider: 'orange_money',
  description: 'Payment'
});
```

## Fee Structure

- Standard fee: 1.5% per transaction
- Minimum: 50 XOF
- Maximum: No limit

## Status Codes

- `processing` - Transaction is being processed
- `completed` - Transaction completed successfully
- `failed` - Transaction failed
- `pending` - Awaiting confirmation
