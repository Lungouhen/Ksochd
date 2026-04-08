# Database Seeding Guide

This guide explains how to seed the KSO Chandigarh Portal database with initial data during deployment.

## Overview

The seed script (`prisma/seed.ts`) populates your Supabase PostgreSQL database with:
- Demo users (Admin, Moderator, Members)
- System settings and configurations
- Sample events and content
- Branding and ID format configurations
- Module toggles
- Default theme and CMS pages

## Local Development

### Prerequisites
1. Ensure you have a valid `DATABASE_URL` in your `.env.local` file
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run db:generate`

### Running the Seed Script

```bash
# Apply migrations (if needed)
npm run db:push

# Run the seed script
npm run db:seed
```

## Production Deployment

### Vercel Deployment

1. **Set Environment Variables**
   - Add `DATABASE_URL` to your Vercel environment variables
   - Format: `postgresql://[user]:[password]@[host]:[port]/[database]?pgbouncer=true`

2. **Add Build Command**
   In your Vercel project settings or `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "installCommand": "npm install && npm run db:setup"
   }
   ```

3. **Alternative: Post-Deploy Hook**
   Add to `package.json`:
   ```json
   {
     "scripts": {
       "vercel-build": "npm run db:migrate && npm run build"
     }
   }
   ```

### Supabase Setup

1. **Get Database URL**
   - Go to Supabase Dashboard → Settings → Database
   - Copy the connection string (Connection Pooling mode recommended)
   - Replace `[password]` with your database password

2. **Connection String Format**
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

3. **Enable Connection Pooling**
   - Use the pooler URL for serverless deployments
   - Reduces connection overhead

### Manual Seeding (One-time)

If you need to manually seed the database after deployment:

```bash
# Install dependencies
npm install

# Set DATABASE_URL environment variable
export DATABASE_URL="your-supabase-connection-string"

# Run migrations
npm run db:migrate

# Run seed script
npm run db:seed
```

## Seed Data

### Users Created

1. **Admin User**
   - ID: `admin-1`
   - Email: `admin@ksochd.org`
   - Phone: `+91-9999999999`
   - Role: `ADMIN`

2. **Moderator User**
   - ID: `mod-1`
   - Email: `moderator@ksochd.org`
   - Phone: `+91-9876543211`
   - Role: `MODERATOR`

3. **Member User**
   - ID: `user-1`
   - Email: `member@ksochd.org`
   - Phone: `+91-9876543210`
   - Role: `MEMBER`

4. **Additional Members** (3)
   - Various pending and active members for testing

### Configuration Data

- **System Settings**: Site name, membership fee, payment keys
- **Branding Config**: Logo, colors, typography
- **ID Formats**: Member, receipt, and event ID formats
- **Module Toggles**: Events, payments, gallery, CMS
- **Default Theme**: KSO default theme with teal/gold colors

### Content Data

- **Events**: 2 sample events
- **Content**: Announcements, news, gallery items
- **Notifications**: Welcome and confirmation messages
- **Payments**: Sample membership payment

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm run db:migrate

      - name: Seed database
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm run db:seed

      - name: Build application
        run: npm run build
```

### Environment Variables Required

```bash
DATABASE_URL="postgresql://..."              # Supabase connection string
NEXT_PUBLIC_SUPABASE_URL="https://..."       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."          # Supabase anon key
```

## Troubleshooting

### Connection Issues

1. **Error: Connection timeout**
   - Use connection pooling URL (port 6543)
   - Enable SSL: `?sslmode=require`

2. **Error: Too many connections**
   - Switch to transaction pooling mode
   - Reduce connection pool size

### Seed Script Failures

1. **Error: Foreign key constraint**
   - Ensure migrations are run first: `npm run db:migrate`
   - Check that all related tables exist

2. **Error: Unique constraint violation**
   - Database may already be seeded
   - Comment out the cleanup section in `seed.ts` if preserving data

3. **Error: Permission denied**
   - Ensure database user has CREATE/INSERT permissions
   - Check Supabase RLS policies (seed runs with direct connection, bypassing RLS)

## Customizing Seed Data

Edit `prisma/seed.ts` to customize:
- User details (names, emails, roles)
- Initial settings and configurations
- Sample content and events
- Branding colors and logos

After editing, run:
```bash
npm run db:seed
```

## Best Practices

1. **Version Control**: Keep seed script in version control
2. **Idempotent**: Make seed script safe to run multiple times
3. **Environment-Specific**: Use different seed data for dev/staging/prod
4. **Backup First**: Always backup production database before reseeding
5. **Test Locally**: Test seed script in development before deploying

## Security Notes

- Never commit real passwords or API keys to seed scripts
- Use environment variables for sensitive data
- Consider separate seed scripts for production vs development
- Review audit logs after seeding production database

## Maintenance

### Updating Seed Data

1. Modify `prisma/seed.ts` with new data
2. Test locally: `npm run db:seed`
3. Commit changes
4. Deploy (seed will run automatically)

### Resetting Database

⚠️ **WARNING**: This will delete all data!

```bash
# Drop and recreate database schema
npm run db:push -- --force-reset

# Reseed database
npm run db:seed
```

## Support

For issues or questions:
- Check Supabase logs: Dashboard → Logs
- Review Prisma documentation: https://www.prisma.io/docs
- Contact: support@ksochd.org
