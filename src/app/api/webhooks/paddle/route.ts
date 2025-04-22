import { paddle } from "@/lib/paddle";
import { createSubscription } from "@/lib/webhooks/subscriptions";
import { EventName } from "@paddle/paddle-node-sdk";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const signature = request.headers.get("paddle-signature");

  const paddleSecret = process.env.PADDLE_WEBHOOK_SECRET;

  const eventData = await paddle.webhooks.unmarshal(
    body,
    paddleSecret as string,
    signature as string
  );

  switch (eventData.eventType) {
    case EventName.SubscriptionCreated:
      await createSubscription(eventData);
      break;
  }

  return NextResponse.json({
    success: true,
  });
}
