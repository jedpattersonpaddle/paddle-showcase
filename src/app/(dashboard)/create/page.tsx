import { CreateShowcaseClient } from "./client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Showcase",
  description: "Create a new showcase",
};

export default async function CreateShowcase() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  return <CreateShowcaseClient />;
}
