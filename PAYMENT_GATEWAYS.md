# Multiple Payment Gateway Integration

This application supports **six payment gateways**:

**Indian Gateways:** Razorpay, Paytm, PhonePe, CCAvenue
**International Gateways:** Stripe, PayPal

## Features

- ✅ Support for multiple payment gateways (Razorpay, Paytm, PhonePe, CCAvenue, Stripe, PayPal)
- ✅ Flexible gateway switching via admin settings
- ✅ Unified payment interface for easy gateway integration
- ✅ Webhook handlers for payment status updates
- ✅ Gateway-specific configuration in admin panel
- ✅ Payment history with gateway information
- ✅ Automatic fallback to configured default gateway
- ✅ Comprehensive support for Indian payment ecosystem

## Architecture

### Payment Gateway Interface

All payment gateways implement the `IPaymentGateway` interface defined in `/lib/payments/gateway-interface.ts`:

- `createOrder()` - Create a payment order
- `verifyPayment()` - Verify payment signature/webhook
- `getPaymentDetails()` - Get payment information
- `refundPayment()` - Process refunds

### Gateway Implementations

**Indian Payment Gateways:**
1. **RazorpayGateway** (`/lib/payments/razorpay-gateway.ts`) - Full Razorpay SDK integration
2. **PaytmGateway** (`/lib/payments/paytm-gateway.ts`) - Paytm payment integration
3. **PhonePeGateway** (`/lib/payments/phonepe-gateway.ts`) - PhonePe PG SDK integration
4. **CCAvenueGateway** (`/lib/payments/ccavenue-gateway.ts`) - CCAvenue payment gateway

**International Payment Gateways:**
5. **StripeGateway** (`/lib/payments/stripe-gateway.ts`) - Stripe integration
6. **PayPalGateway** (`/lib/payments/paypal-gateway.ts`) - PayPal REST API integration

### Factory Pattern

The `getPaymentGateway()` function in `/lib/payments/gateway-factory.ts` returns the appropriate gateway instance based on configuration.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
## Indian Payment Gateways

# Razorpay
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# Paytm
PAYTM_MERCHANT_ID="your_paytm_merchant_id"
PAYTM_MERCHANT_KEY="your_paytm_merchant_key"
PAYTM_WEBSITE="DEFAULT"
PAYTM_ENVIRONMENT="staging" # or "production"

# PhonePe
PHONEPE_MERCHANT_ID="your_phonepe_merchant_id"
PHONEPE_SALT_KEY="your_phonepe_salt_key"
PHONEPE_SALT_INDEX="1"
PHONEPE_ENVIRONMENT="staging" # or "production"

# CCAvenue
CCAVENUE_MERCHANT_ID="your_ccavenue_merchant_id"
CCAVENUE_ACCESS_CODE="your_ccavenue_access_code"
CCAVENUE_WORKING_KEY="your_ccavenue_working_key"
CCAVENUE_ENVIRONMENT="test" # or "production"

## International Payment Gateways

# Stripe
STRIPE_PUBLIC_KEY="your_stripe_publishable_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

# PayPal
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_MODE="sandbox" # or "live" for production

# Active payment gateway
ACTIVE_PAYMENT_GATEWAY="RAZORPAY" # Options: RAZORPAY, PAYTM, PHONEPE, CCAVENUE, STRIPE, PAYPAL
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
  PAYTM
  PHONEPE
  CCAVENUE
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
  "gateways": ["RAZORPAY", "PAYTM", "PHONEPE", "CCAVENUE", "STRIPE", "PAYPAL"],
  "active": "RAZORPAY"
}
```

## Webhooks

Configure webhooks in each gateway's dashboard to point to:

**Indian Gateways:**
- **Razorpay**: `/api/webhooks/razorpay`
- **Paytm**: `/api/webhooks/paytm`
- **PhonePe**: `/api/webhooks/phonepe`
- **CCAvenue**: `/api/webhooks/ccavenue`

**International Gateways:**
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

1. **Sandbox/Test Mode**: All gateways support sandbox/test mode

   **Indian Gateways:**
   - **Razorpay**: Use test API keys from dashboard
   - **Paytm**: Set `PAYTM_ENVIRONMENT="staging"` and use staging credentials
   - **PhonePe**: Set `PHONEPE_ENVIRONMENT="staging"` and use UAT credentials
   - **CCAvenue**: Set `CCAVENUE_ENVIRONMENT="test"` and use test account

   **International Gateways:**
   - **Stripe**: Use test API keys (starts with `sk_test_`)
   - **PayPal**: Set `PAYPAL_MODE="sandbox"`

2. **Test Cards/Accounts**:

   **Indian Gateways:**
   - **Razorpay**: See [Razorpay test cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)
   - **Paytm**: Use staging wallet or test cards from Paytm docs
   - **PhonePe**: Use PhonePe sandbox test numbers and cards
   - **CCAvenue**: Use test cards: 4111111111111111 (Visa), 5123456789012346 (Mastercard)

   **International Gateways:**
   - **Stripe**: See [Stripe test cards](https://stripe.com/docs/testing)
   - **PayPal**: Use PayPal sandbox accounts

## Security Notes

- All webhook handlers verify signatures before processing
- Sensitive keys are stored as secrets in SystemSetting
- Payment verification happens server-side
- Never expose secret keys in client-side code

## Future Enhancements

- [ ] Add UPI direct integration for Indian gateways
- [ ] Add support for cryptocurrency payments
- [ ] Implement subscription/recurring payments
- [ ] Add payment analytics dashboard
- [ ] Support for multiple currencies per gateway
- [ ] Automatic retry logic for failed payments
- [ ] Payment dispute handling
- [ ] EMI options for high-value transactions
- [ ] QR code payments support

## Gateway-Specific Notes

### Indian Gateways

**Razorpay**
- Supports UPI, cards, net banking, wallets
- Best for quick integration with comprehensive docs
- Supports instant refunds

**Paytm**
- Popular wallet integration
- Requires merchant onboarding
- Good for e-commerce

**PhonePe**
- Strong UPI presence
- Requires base64 encoding for requests
- Mobile-first approach

**CCAvenue**
- Oldest payment gateway in India
- Supports 200+ payment options
- Requires encryption for all requests
- Good for established businesses

### International Gateways

**Stripe**
- Global leader in online payments
- Excellent developer experience
- Strong fraud detection

**PayPal**
- Trusted brand globally
- Good for international transactions
- Supports buyer protection
