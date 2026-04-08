import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    const { id } = await params;
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        seo: true,
        theme: true,
        blocks: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ page });
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const { title, content, excerpt, status, themeId, updatedBy, seo } = body;

      // Update SEO if provided
      if (seo) {
        const existingPage = await prisma.page.findUnique({
          where: { id },
          select: { seoId: true },
        });

        if (existingPage?.seoId) {
          await prisma.sEO.update({
            where: { id: existingPage.seoId },
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
              structuredData: seo.structuredData ? JSON.stringify(seo.structuredData) : null,
            },
          });
        }
      }

      const page = await prisma.page.update({
        where: { id },
        data: {
          title,
          content,
          excerpt,
          status,
          themeId,
          updatedBy,
          publishedAt: status === "PUBLISHED" ? new Date() : undefined,
        },
        include: {
          seo: true,
          theme: true,
        },
      });

      return NextResponse.json({ page });
    } catch (error) {
      console.error("Error updating page:", error);
      return NextResponse.json(
        { error: "Failed to update page" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    try {
      const { id } = await params;

      // Get page with SEO
      const page = await prisma.page.findUnique({
        where: { id },
        select: { seoId: true },
      });

      // Delete page (blocks will cascade delete)
      await prisma.page.delete({
        where: { id },
      });

      // Delete associated SEO if exists
      if (page?.seoId) {
        await prisma.sEO.delete({
          where: { id: page.seoId },
        });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting page:", error);
      return NextResponse.json(
        { error: "Failed to delete page" },
        { status: 500 }
      );
    }
  });
}
