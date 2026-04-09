# Authentication System

## Overview

The KSO Chandigarh Portal now features a fully functional authentication system with JWT-based sessions, password hashing, and secure session management.

## Features

- **JWT Token Authentication**: Cryptographically signed tokens using HS256
- **Password Hashing**: BCrypt password hashing with salt rounds
- **Secure Sessions**: HttpOnly cookies with configurable expiration
- **Role-Based Access Control**: ADMIN, MODERATOR, and MEMBER roles
- **Protected Routes**: Automatic redirects for unauthorized access
- **Registration Flow**: New user registration with pending approval status
- **Login Flow**: Phone-based login with optional password

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

**Required environment variables:**

```env
# Database connection (required)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ksochd"

# JWT Secret (REQUIRED - Change in production!)
JWT_SECRET="your-secret-key-change-in-production-min-32-chars-please"
```

### 2. Database Setup

Run migrations and seed the database:

```bash
npm run db:setup
```

This creates three demo users:
- **Admin**: `+91-9999999999` (no password required for demo)
- **Moderator**: `+91-9876543211` (no password required for demo)
- **Member**: `+91-9876543210` (no password required for demo)

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/login` to get started.

## Usage

### Registration

1. Navigate to `/register`
2. Fill in the registration form:
   - Name (required)
   - Phone (required)
   - Email (optional)
   - Clan (optional)
   - College (optional)
   - Password (optional)
3. Submit the form
4. Your account will be created with `PENDING` status
5. Wait for an admin to approve your membership

### Login

1. Navigate to `/login`
2. Enter your phone number
3. Enter your password (if you set one during registration)
4. For demo users, password is optional
5. Click "Continue"
6. You'll be redirected to:
   - `/admin/dashboard` if you're an ADMIN
   - `/dashboard` if you're a MEMBER or MODERATOR

### Logout

Use the logout API endpoint:

```javascript
fetch('/api/auth/logout', { method: 'POST' })
```

## API Endpoints

### POST `/api/auth/register`

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+91-9876543210",
  "email": "john@example.com",
  "clan": "Vaiphei",
  "college": "Chandigarh University",
  "password": "optional-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "role": "MEMBER",
    "membershipStatus": "PENDING"
  }
}
```

### POST `/api/auth/login`

Login with phone and optional password.

**Request:**
```json
{
  "phone": "+91-9876543210",
  "password": "optional-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "role": "MEMBER",
    "membershipStatus": "ACTIVE"
  }
}
```

### POST `/api/auth/logout`

Logout and clear session cookie.

**Response:**
```json
{
  "success": true
}
```

## Security Features

### Token Security
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 7 days
- **Verification**: All tokens are cryptographically verified
- **Storage**: HttpOnly cookies prevent XSS attacks

### Password Security
- **Hashing**: BCrypt with 10 salt rounds
- **Optional**: Passwords are optional for phone-only auth
- **No Plaintext**: Passwords are never stored in plaintext

### Session Management
- **Automatic Expiration**: Tokens expire after 7 days
- **Cookie Security**:
  - HttpOnly: Cannot be accessed by JavaScript
  - SameSite: Lax (prevents CSRF)
  - Secure: Enabled in production
  - MaxAge: 7 days

### Authorization
- **Route Protection**: Member and admin layouts check authentication
- **API Protection**: All admin APIs require valid session + ADMIN role
- **Member Approval**: Only admins can approve/reject member applications

## Protected Routes

### Admin Routes (`/admin/*`)
- Requires authentication
- Requires `ADMIN` role
- Redirects to `/login` if not authenticated

### Member Routes (`/dashboard`, `/events`, etc.)
- Requires authentication
- Accepts any authenticated user
- Redirects to `/login` if not authenticated

## Development Notes

### Demo Users
For development, you can login with demo users without passwords:
- Admin: `+91-9999999999`
- Moderator: `+91-9876543211`
- Member: `+91-9876543210`

### Custom Session Handling

The `getSession()` function in `lib/auth.ts` handles token verification:

```typescript
export async function getSession(): Promise<Session | null> {
  // Checks Authorization header OR kso-session cookie
  // Verifies JWT signature
  // Returns null if not authenticated
}
```

### Adding Protected Routes

To protect a new route, add authentication check to the layout:

```typescript
export default async function MyLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Optional: Check role
  if (session.role !== Role.ADMIN) {
    redirect('/dashboard');
  }

  return <div>{children}</div>;
}
```

### Adding Protected API Routes

```typescript
export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Your protected logic here
}
```

## Troubleshooting

### "Not authenticated" Error
- Make sure you're logged in
- Check that your session cookie hasn't expired
- Try logging out and logging back in

### Database Errors
- Ensure `DATABASE_URL` is set in `.env.local`
- Run `npm run db:setup` to initialize the database
- Check database connection

### JWT Verification Fails
- Ensure `JWT_SECRET` is set in `.env.local`
- Secret must be at least 32 characters
- Don't change the secret after creating tokens

## Production Deployment

### Required Steps

1. **Set Strong JWT Secret**
   ```env
   JWT_SECRET="generate-a-strong-random-secret-at-least-32-chars"
   ```

2. **Use Environment Variables**
   - Never commit `.env.local` to git
   - Set environment variables in your hosting platform

3. **Enable HTTPS**
   - Secure cookies require HTTPS in production
   - Set `NODE_ENV=production`

4. **Database Migration**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Consider Rate Limiting**
   - Add rate limiting to auth endpoints
   - Prevent brute force attacks

## Future Enhancements

Potential improvements:
- [ ] OTP-based authentication via SMS
- [ ] Refresh token support
- [ ] Session revocation/blacklist
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Rate limiting on auth endpoints
