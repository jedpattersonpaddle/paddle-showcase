import { db } from "@/db";
import { showcase as ShowcaseSchema, user as UserSchema } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paddle Showcase",
  description: "Paddle Showcase",
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const showcases = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.userId, session.user.id))
    .leftJoin(UserSchema, eq(ShowcaseSchema.userId, UserSchema.id));

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="relative w-full min-h-screen">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 h-full">
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Your Showcases
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage your checkout showcases
                </p>
              </div>
              <Link href="/create">
                <Button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Showcase
                </Button>
              </Link>
            </div>

            {showcases.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No showcases yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create your first showcase to start selling your products
                    with Paddle.
                  </p>
                  <Link href="/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Showcase
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showcases.map((showcase) => (
                  <div
                    key={showcase.showcase.id}
                    className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div
                      className="h-2"
                      style={{ backgroundColor: showcase.showcase.brandColor }}
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        {showcase.showcase.logoUrl ? (
                          <Image
                            src={showcase.showcase.logoUrl}
                            alt={showcase.showcase.companyName}
                            className="h-12 w-12 rounded-md object-contain"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div
                            className="h-12 w-12 rounded-md flex items-center justify-center text-white font-bold"
                            style={{
                              backgroundColor: showcase.showcase.brandColor,
                            }}
                          >
                            {showcase.showcase.companyName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {showcase.showcase.companyName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Created{" "}
                            {new Date(
                              showcase.showcase.createdAt
                            ).toLocaleDateString()}{" "}
                            by {showcase.user?.name}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Subdomain
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {showcase.showcase.subdomain}.paddle-showcase.com
                          </span>
                        </div>

                        <div className="pt-4 flex gap-2">
                          <Link
                            href={`http://${showcase.showcase.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/`}
                            target="_blank"
                            className="flex-1"
                          >
                            <Button variant="outline" className="w-full">
                              View Showcase
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                          <Link
                            href={`/edit/${showcase.showcase.id}`}
                            className="flex-1"
                          >
                            <Button variant="outline" className="w-full">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
