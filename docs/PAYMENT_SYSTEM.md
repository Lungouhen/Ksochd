# Payment System Integration

## Overview

Production-ready financial system integrated with Razorpay for handling:
- Membership fees (Individual & Family)
- Event registration fees
- Payment history and receipts
- Admin payment overview and analytics
- Secure payment processing with webhook verification

## Features

### Member Features
- **Membership Payment**: Pay individual (₹500) or family (₹1000) membership fees
- **Payment History**: View all past transactions with status and payment IDs
- **Secure Checkout**: Client-side Razorpay integration with payment verification

### Admin Features
- **Payment Overview**: View metrics (total, completed, pending, failed)
- **Revenue Analytics**: Track total, membership, and event revenue
- **Recent Payments**: Monitor latest transactions across the organization

## Environment Variables

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id_here"
RAZORPAY_KEY_SECRET="your_razorpay_secret_here"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret_here"

# Payment Configuration
MEMBERSHIP_FEE_INDIVIDUAL=500
MEMBERSHIP_FEE_FAMILY=1000
```

## Payment Flow

1. **User initiates payment** → Clicks "Pay Now" button
2. **Order creation** → Backend creates Razorpay order and database record
3. **Razorpay checkout** → User completes payment via Razorpay UI
4. **Client verification** → Payment signature verified on backend
5. **Status update** → Payment status updated to PAID in database
6. **Webhook confirmation** → Razorpay sends webhook for additional confirmation

## Webhook Setup

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret to `RAZORPAY_WEBHOOK_SECRET`

## Production Checklist

- [ ] Replace test Razorpay keys with live keys
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Test payment flows end-to-end
- [ ] Verify webhook signature validation
- [ ] Configure email notifications for successful payments
