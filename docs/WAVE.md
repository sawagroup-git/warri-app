name: Wave Provider

Integration with Wave mobile money service for West Africa.

## Configuration

Set the following environment variables:

```
WAVE_API_KEY=your_api_key
WAVE_BASE_URL=https://api.wave.money
```

## Features

- Send money to Wave users
- Check transaction status
- Error handling and retry logic
- Automatic fee calculation

## Usage

```typescript
import { WaveProvider } from '@services/providers';

const provider = new WaveProvider({
  apiKey: process.env.WAVE_API_KEY,
  baseUrl: process.env.WAVE_BASE_URL,
});

const result = await provider.sendMoney({
  recipientPhone: '+22501234567',
  amount: 10000,
  provider: 'wave',
  description: 'Payment'
});
```

## Fee Structure

- Standard fee: 1.2% per transaction
- Minimum: 25 XOF
- Maximum: No limit

## Status Codes

- `PROCESSING` - Transaction is being processed
- `COMPLETED` - Transaction completed successfully
- `FAILED` - Transaction failed
- `PENDING` - Awaiting confirmation
