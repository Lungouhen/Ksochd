#!/bin/bash
set -e

echo "🚀 KSO Chandigarh Portal - Deployment Setup"
echo "==========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo "Please set DATABASE_URL to your Supabase connection string"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Generate Prisma client
echo "📦 Generating Prisma client..."
npm run db:generate
echo "✅ Prisma client generated"
echo ""

# Run migrations
echo "🔄 Running database migrations..."
if npm run db:migrate; then
  echo "✅ Migrations completed successfully"
else
  echo "⚠️  Migrations failed or no migrations to run"
  echo "Attempting to push schema directly..."
  npm run db:push
fi
echo ""

# Seed database
echo "🌱 Seeding database with initial data..."
if npm run db:seed; then
  echo "✅ Database seeded successfully"
else
  echo "⚠️  Seeding failed - database may already contain data"
  echo "You can run 'npm run db:seed' manually to retry"
fi
echo ""

echo "✅ Deployment setup completed!"
echo ""
echo "📊 Next steps:"
echo "1. Verify database: npx prisma studio"
echo "2. Test application: npm run dev"
echo "3. Build for production: npm run build"
echo ""
