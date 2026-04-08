import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await withPrisma(
    async (prisma) => {
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
        return { notFound: true, page: null };
      }

      return { page };
    },
    () => ({ page: null, error: "Database unavailable" })
  );

  if (result.notFound) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ page: result.page });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, content, excerpt, status, themeId, updatedBy, seo } = body;

  const result = await withPrisma(
    async (prisma) => {
      try {
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

        return { success: true, page };
      } catch (error) {
        console.error("Error updating page:", error);
        return { success: false, error: "Failed to update page" };
      }
    },
    () => ({ success: false, error: "Database unavailable" })
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ page: result.page });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await withPrisma(
    async (prisma) => {
      try {
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

        return { success: true };
      } catch (error) {
        console.error("Error deleting page:", error);
        return { success: false, error: "Failed to delete page" };
      }
    },
    () => ({ success: false, error: "Database unavailable" })
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
