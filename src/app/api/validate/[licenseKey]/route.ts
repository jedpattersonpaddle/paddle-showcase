import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscription as SubscriptionSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ licenseKey: string }> }
) {
  const { licenseKey } = await params;

  const subscription = await db
    .select()
    .from(SubscriptionSchema)
    .where(eq(SubscriptionSchema.licenseKey, licenseKey));

  if (subscription[0] && subscription[0].status === "active") {
    return NextResponse.json({ valid: true });
  }

  return NextResponse.json({ valid: false });
}
