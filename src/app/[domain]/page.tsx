import { db } from "@/db";
import {
  showcase as ShowcaseSchema,
  product as ProductSchema,
} from "@/db/schema";
import { eq } from "drizzle-orm";
async function getShowcase(domain: string) {
  const showcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.subdomain, domain))
    .leftJoin(ProductSchema, eq(ShowcaseSchema.id, ProductSchema.showcaseId));
  return showcase;
}

export default async function SiteHomePage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const domain = decodeURIComponent((await params).domain);

  const showcase = await getShowcase(domain);

  if (!showcase || showcase.length === 0) {
    return <div>Showcase not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to {showcase[0].showcase.companyName}
        </h1>
      </main>
    </div>
  );
}
