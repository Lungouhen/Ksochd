import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data (optional - comment out if you want to preserve data)
  console.log("🧹 Cleaning existing data...");
  await prisma.notification.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.event.deleteMany();
  await prisma.content.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.pageBlock.deleteMany();
  await prisma.pageVersion.deleteMany();
  await prisma.page.deleteMany();
  await prisma.sEO.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.gTMConfig.deleteMany();
  await prisma.mediaLibrary.deleteMany();
  await prisma.brandingConfig.deleteMany();
  await prisma.idFormatConfig.deleteMany();
  await prisma.outputTemplate.deleteMany();
  await prisma.customFieldValue.deleteMany();
  await prisma.customField.deleteMany();
  await prisma.moduleToggle.deleteMany();
  await prisma.savedReportView.deleteMany();
  await prisma.settingsBackup.deleteMany();
  await prisma.hookRegistration.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.executiveTerm.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  console.log("👤 Creating admin user...");
  const adminUser = await prisma.user.create({
    data: {
      id: "admin-1",
      name: "Admin User",
      phone: "+91-9999999999",
      email: "admin@ksochd.org",
      clan: "Admin Clan",
      college: "KSO Headquarters",
      role: "ADMIN",
      membershipStatus: "ACTIVE",
      profilePic: "/admin-avatar.png",
    },
  });

  // Create Moderator User
  console.log("👤 Creating moderator user...");
  const moderatorUser = await prisma.user.create({
    data: {
      id: "mod-1",
      name: "Moderator User",
      phone: "+91-9876543211",
      email: "moderator@ksochd.org",
      clan: "Vaiphei",
      college: "Panjab University",
      role: "MODERATOR",
      membershipStatus: "ACTIVE",
      profilePic: "/mod-avatar.png",
    },
  });

  // Create Demo Member User
  console.log("👤 Creating member user...");
  const memberUser = await prisma.user.create({
    data: {
      id: "user-1",
      name: "Chinglen Vaiphei",
      phone: "+91-9876543210",
      email: "member@ksochd.org",
      clan: "Vaiphei",
      college: "Chandigarh University",
      role: "MEMBER",
      membershipStatus: "ACTIVE",
      profilePic: "/profile.png",
    },
  });

  // Create additional members
  console.log("👥 Creating additional members...");
  const additionalMembers = await prisma.user.createMany({
    data: [
      {
        name: "Vungtin Guite",
        phone: "+91-9876501234",
        email: "vungtin@example.com",
        clan: "Guite",
        college: "DAV College",
        role: "MEMBER",
        membershipStatus: "PENDING",
      },
      {
        name: "Lunminthang Haokip",
        phone: "+91-9876505678",
        email: "lunmin@example.com",
        clan: "Haokip",
        college: "PGGC-11",
        role: "MEMBER",
        membershipStatus: "PENDING",
      },
      {
        name: "Ginzalal Kipgen",
        phone: "+91-9876509876",
        email: "ginza@example.com",
        clan: "Kipgen",
        college: "Chandigarh University",
        role: "MEMBER",
        membershipStatus: "ACTIVE",
      },
    ],
  });

  // Create Executive Term
  console.log("📅 Creating executive term...");
  const currentTerm = await prisma.executiveTerm.create({
    data: {
      name: "2025-2026",
      startYear: 2025,
      endYear: 2026,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-12-31"),
      isCurrent: true,
      description: "Current executive term for KSO Chandigarh",
      createdBy: adminUser.id,
    },
  });

  // Create System Settings
  console.log("⚙️ Creating system settings...");
  await prisma.systemSetting.createMany({
    data: [
      {
        key: "site_name",
        value: "KSO Chandigarh Portal",
        description: "Organization name",
        updatedBy: adminUser.id,
      },
      {
        key: "membership_fee",
        value: "500",
        description: "Annual membership fee in INR",
        updatedBy: adminUser.id,
      },
      {
        key: "razorpay_key_id",
        value: "rzp_test_xxxxxx",
        isSecret: true,
        description: "Razorpay API Key",
        updatedBy: adminUser.id,
      },
      {
        key: "support_email",
        value: "support@ksochd.org",
        description: "Support contact email",
        updatedBy: adminUser.id,
      },
    ],
  });

  // Create Branding Config
  console.log("🎨 Creating branding configuration...");
  await prisma.brandingConfig.createMany({
    data: [
      {
        key: "logo_url",
        value: "/logo.svg",
        category: "logo",
        description: "Main logo URL",
        updatedBy: adminUser.id,
      },
      {
        key: "primary_color",
        value: "#0ea5a6",
        category: "colors",
        description: "Primary brand color (teal)",
        updatedBy: adminUser.id,
      },
      {
        key: "secondary_color",
        value: "#f59e0b",
        category: "colors",
        description: "Secondary brand color (gold)",
        updatedBy: adminUser.id,
      },
      {
        key: "font_family",
        value: "Geist Sans",
        category: "typography",
        description: "Primary font family",
        updatedBy: adminUser.id,
      },
    ],
  });

  // Create ID Format Configurations
  console.log("🔢 Creating ID format configurations...");
  await prisma.idFormatConfig.createMany({
    data: [
      {
        entityType: "member",
        prefix: "KSO",
        separator: "-",
        padLength: 6,
        nextSequence: 1,
        format: "{{prefix}}{{separator}}{{sequence}}",
        includeYear: true,
        description: "Member ID format",
        updatedBy: adminUser.id,
      },
      {
        entityType: "receipt",
        prefix: "REC",
        separator: "-",
        padLength: 6,
        nextSequence: 1,
        format: "{{prefix}}{{separator}}{{sequence}}",
        includeYear: false,
        description: "Receipt ID format",
        updatedBy: adminUser.id,
      },
      {
        entityType: "event",
        prefix: "EVT",
        separator: "-",
        padLength: 4,
        nextSequence: 1,
        format: "{{prefix}}{{separator}}{{sequence}}",
        includeYear: true,
        description: "Event ID format",
        updatedBy: adminUser.id,
      },
    ],
  });

  // Create Module Toggles
  console.log("🔧 Creating module toggles...");
  await prisma.moduleToggle.createMany({
    data: [
      {
        moduleKey: "events",
        displayName: "Events Management",
        description: "Enable event creation and registration",
        isEnabled: true,
        order: 1,
        updatedBy: adminUser.id,
      },
      {
        moduleKey: "payments",
        displayName: "Payments",
        description: "Enable payment processing via Razorpay",
        isEnabled: true,
        order: 2,
        updatedBy: adminUser.id,
      },
      {
        moduleKey: "gallery",
        displayName: "Gallery",
        description: "Enable photo gallery and media management",
        isEnabled: true,
        order: 3,
        updatedBy: adminUser.id,
      },
      {
        moduleKey: "cms",
        displayName: "CMS",
        description: "Enable content management system",
        isEnabled: true,
        order: 4,
        updatedBy: adminUser.id,
      },
    ],
  });

  // Create Sample Events
  console.log("📅 Creating sample events...");
  const event1 = await prisma.event.create({
    data: {
      title: "KSO Annual Meet 2026",
      description:
        "Join us for the annual gathering of all KSO Chandigarh members. Network, celebrate, and plan for the year ahead.",
      date: new Date("2026-06-15T10:00:00Z"),
      venue: "Student Center, Chandigarh University",
      fee: 200,
      registrationDeadline: new Date("2026-06-10T23:59:59Z"),
      posterUrl: "/events/annual-meet-2026.jpg",
      createdBy: adminUser.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Cultural Night 2026",
      description:
        "An evening of cultural performances, traditional dances, and musical presentations showcasing Kuki heritage.",
      date: new Date("2026-08-20T18:00:00Z"),
      venue: "Punjab Engineering College Auditorium",
      fee: 150,
      registrationDeadline: new Date("2026-08-15T23:59:59Z"),
      posterUrl: "/events/cultural-night-2026.jpg",
      createdBy: moderatorUser.id,
    },
  });

  // Create Event Registrations
  console.log("📝 Creating event registrations...");
  await prisma.eventRegistration.create({
    data: {
      userId: memberUser.id,
      eventId: event1.id,
      status: "CONFIRMED",
    },
  });

  // Create Sample Content
  console.log("📰 Creating sample content...");
  await prisma.content.createMany({
    data: [
      {
        type: "ANNOUNCEMENT",
        title: "Welcome to KSO Chandigarh Portal",
        body: "We are excited to launch our new member portal. Stay connected, register for events, and engage with the community.",
        visibility: "PUBLIC",
      },
      {
        type: "NEWS",
        title: "New Executive Committee Elected",
        body: "The new executive committee for 2025-2026 has been elected. Congratulations to all the newly elected members!",
        visibility: "MEMBER",
      },
      {
        type: "GALLERY",
        title: "Freshers Welcome 2025",
        body: "Photos from the freshers welcome event held in September 2025.",
        visibility: "MEMBER",
        mediaUrl: "/gallery/freshers-2025/",
      },
    ],
  });

  // Create Notifications
  console.log("🔔 Creating notifications...");
  await prisma.notification.createMany({
    data: [
      {
        userId: memberUser.id,
        message: "Your registration for KSO Annual Meet 2026 has been confirmed!",
        read: false,
      },
      {
        userId: memberUser.id,
        message: "Welcome to KSO Chandigarh! Please complete your profile.",
        read: true,
      },
    ],
  });

  // Create Sample Payment
  console.log("💳 Creating sample payments...");
  await prisma.payment.create({
    data: {
      userId: memberUser.id,
      amount: 500,
      status: "PAID",
      purpose: "membership",
      razorpayId: "pay_demo123456789",
    },
  });

  // Create Default Theme
  console.log("🎨 Creating default theme...");
  const defaultTheme = await prisma.theme.create({
    data: {
      name: "default",
      displayName: "KSO Default Theme",
      description: "The default theme for KSO Chandigarh portal",
      isActive: true,
      isDefault: true,
      config: {
        colors: {
          primary: "#0ea5a6",
          secondary: "#f59e0b",
          background: "#030712",
        },
        fonts: {
          body: "Geist Sans",
          heading: "Geist Sans",
        },
      },
    },
  });

  // Create Sample CMS Page
  console.log("📄 Creating sample CMS pages...");
  const seo = await prisma.sEO.create({
    data: {
      title: "About Us - KSO Chandigarh",
      description:
        "Learn about the Kuki Students Organisation, Chandigarh chapter - our mission, vision, and community.",
      keywords: "KSO, Kuki Students, Chandigarh, Student Organization",
      ogTitle: "About KSO Chandigarh",
      ogDescription: "Discover the Kuki Students Organisation Chandigarh chapter",
      noindex: false,
      nofollow: false,
    },
  });

  await prisma.page.create({
    data: {
      slug: "about",
      title: "About Us",
      content:
        "The Kuki Students Organisation (KSO) Chandigarh is a vibrant student community dedicated to preserving and promoting Kuki culture and heritage while supporting academic excellence.",
      excerpt: "Learn about KSO Chandigarh's mission and vision",
      status: "PUBLISHED",
      publishedAt: new Date(),
      createdBy: adminUser.id,
      themeId: defaultTheme.id,
      seoId: seo.id,
    },
  });

  // Create Audit Log entries
  console.log("📋 Creating audit log entries...");
  await prisma.auditLog.createMany({
    data: [
      {
        action: "DATABASE_SEEDED",
        performedBy: adminUser.id,
        performedByName: adminUser.name,
        details: {
          message: "Database seeded with initial data",
          timestamp: new Date().toISOString(),
        },
      },
      {
        action: "MEMBER_APPROVED",
        targetUserId: memberUser.id,
        targetUserName: memberUser.name,
        performedBy: adminUser.id,
        performedByName: adminUser.name,
        details: {
          oldStatus: "PENDING",
          newStatus: "ACTIVE",
        },
      },
    ],
  });

  console.log("✅ Database seeding completed successfully!");
  console.log(`
  📊 Summary:
  - Users created: 5 (1 Admin, 1 Moderator, 3 Members)
  - Events created: 2
  - Content items: 3
  - Notifications: 2
  - Payments: 1
  - System settings: 4
  - Branding configs: 4
  - ID formats: 3
  - Module toggles: 4
  - Themes: 1
  - Pages: 1
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
