import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where = status && status !== "all" ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {};

  const result = await withPrisma(
    async (prisma) => {
      const pages = await prisma.page.findMany({
        where,
        include: {
          seo: true,
          theme: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      return { pages };
    },
    () => ({ pages: [] })
  );

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, title, content, excerpt, status, themeId, seo, createdBy } = body;

  const result = await withPrisma(
    async (prisma) => {
      // Create SEO record if provided
      let seoId: string | undefined;
      if (seo) {
        const seoRecord = await prisma.sEO.create({
          data: {
            title: seo.title || title,
            description: seo.description || excerpt || "",
            keywords: seo.keywords,
            ogTitle: seo.ogTitle,
            ogDescription: seo.ogDescription,
            ogImage: seo.ogImage,
            twitterCard: seo.twitterCard,
            twitterTitle: seo.twitterTitle,
            twitterDescription: seo.twitterDescription,
            twitterImage: seo.twitterImage,
            canonicalUrl: seo.canonicalUrl,
            noindex: seo.noindex || false,
            nofollow: seo.nofollow || false,
            structuredData: seo.structuredData ? JSON.stringify(seo.structuredData) : Prisma.JsonNull,
          },
        });
        seoId = seoRecord.id;
      }

      const page = await prisma.page.create({
        data: {
          slug,
          title,
          content,
          excerpt,
          status: status || "DRAFT",
          themeId,
          seoId,
          createdBy,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
        },
        include: {
          seo: true,
          theme: true,
        },
      });

      return { page: page as any };
    },
    () => ({ page: null as any })
  );

  if (!result.page) {
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }

  return NextResponse.json({ page: result.page }, { status: 201 });
}
