# Multiple Payment Gateway Integration

This application now supports three payment gateways: **Razorpay**, **Stripe**, and **PayPal**.

## Features

- ✅ Support for multiple payment gateways (Razorpay, Stripe, PayPal)
- ✅ Flexible gateway switching via admin settings
- ✅ Unified payment interface for easy gateway integration
- ✅ Webhook handlers for payment status updates
- ✅ Gateway-specific configuration in admin panel
- ✅ Payment history with gateway information
- ✅ Automatic fallback to configured default gateway

## Architecture

### Payment Gateway Interface

All payment gateways implement the `IPaymentGateway` interface defined in `/lib/payments/gateway-interface.ts`:

- `createOrder()` - Create a payment order
- `verifyPayment()` - Verify payment signature/webhook
- `getPaymentDetails()` - Get payment information
- `refundPayment()` - Process refunds

### Gateway Implementations

1. **RazorpayGateway** (`/lib/payments/razorpay-gateway.ts`)
2. **StripeGateway** (`/lib/payments/stripe-gateway.ts`)
3. **PayPalGateway** (`/lib/payments/paypal-gateway.ts`)

### Factory Pattern

The `getPaymentGateway()` function in `/lib/payments/gateway-factory.ts` returns the appropriate gateway instance based on configuration.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Razorpay
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# Stripe
STRIPE_PUBLIC_KEY="your_stripe_publishable_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

# PayPal
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_MODE="sandbox" # or "live" for production

# Active payment gateway
ACTIVE_PAYMENT_GATEWAY="RAZORPAY"
```

### Admin Configuration

1. Navigate to **Admin > Settings > Integrations**
2. Configure API keys for each gateway you want to use
3. Set the `ACTIVE_PAYMENT_GATEWAY` to your preferred default gateway

## Database Schema

The `Payment` model has been updated to support multiple gateways:

```prisma
model Payment {
  id              String         @id @default(cuid())
  userId          String
  amount          Int
  status          PaymentStatus
  gateway         PaymentGateway @default(RAZORPAY)
  gatewayOrderId  String?        // Order ID from the gateway
  gatewayPaymentId String?       // Payment ID from the gateway
  purpose         String
  metadata        String?        // JSON string for additional data
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  user User @relation(fields: [userId], references: [id])
}

enum PaymentGateway {
  RAZORPAY
  STRIPE
  PAYPAL
}
```

## API Routes

### Create Payment Order

**POST** `/api/payments/create-order`

```json
{
  "amount": 500,
  "currency": "INR",
  "purpose": "Event Registration",
  "userId": "user_123",
  "gateway": "RAZORPAY"
}
```

### Verify Payment

**POST** `/api/payments/verify`

```json
{
  "paymentId": "pay_123",
  "orderId": "order_123",
  "paymentProof": {
    "paymentId": "gateway_payment_id",
    "signature": "signature_string"
  },
  "gateway": "RAZORPAY"
}
```

### Get Available Gateways

**GET** `/api/payments/gateways`

Returns:
```json
{
  "gateways": ["RAZORPAY", "STRIPE", "PAYPAL"],
  "active": "RAZORPAY"
}
```

## Webhooks

Configure webhooks in each gateway's dashboard to point to:

- **Razorpay**: `/api/webhooks/razorpay`
- **Stripe**: `/api/webhooks/stripe`
- **PayPal**: `/api/webhooks/paypal`

### Webhook Events Handled

- Payment captured/succeeded → Update status to `PAID`
- Payment failed/denied → Update status to `FAILED`
- Payment refunded → Update status to `REFUNDED`

## Migration

After pulling these changes, run the database migration:

```bash
npm run db:push
```

Or if using Prisma Migrate:

```bash
npx prisma migrate dev --name add_multiple_payment_gateways
```

## Usage in Frontend

The checkout page (`/payments/checkout`) now automatically:

1. Fetches available payment gateways
2. Shows gateway selection if multiple gateways are configured
3. Creates payment order with selected gateway
4. Redirects to success page after payment

## Testing

1. **Sandbox Mode**: All gateways support sandbox/test mode
   - Razorpay: Use test API keys
   - Stripe: Use test API keys (starts with `sk_test_`)
   - PayPal: Set `PAYPAL_MODE="sandbox"`

2. **Test Cards/Accounts**:
   - Razorpay: See [Razorpay test cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)
   - Stripe: See [Stripe test cards](https://stripe.com/docs/testing)
   - PayPal: Use PayPal sandbox accounts

## Security Notes

- All webhook handlers verify signatures before processing
- Sensitive keys are stored as secrets in SystemSetting
- Payment verification happens server-side
- Never expose secret keys in client-side code

## Future Enhancements

- [ ] Add support for cryptocurrency payments
- [ ] Implement subscription/recurring payments
- [ ] Add payment analytics dashboard
- [ ] Support for multiple currencies per gateway
- [ ] Automatic retry logic for failed payments
- [ ] Payment dispute handling
