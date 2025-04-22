import { Vercel } from "@vercel/sdk";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN!,
});

export async function addDomainToProject(domain: string) {
  try {
    const result = await vercel.projects.addProjectDomain({
      idOrName: process.env.VERCEL_PROJECT_ID!,
      requestBody: {
        name: domain,
      },
    });

    if (!result.verified) {
      console.log("Domain needs verification:", result.verification);
    }

    return result;
  } catch (error) {
    console.error("Error adding domain to project:", error);
    throw error;
  }
}

export async function verifyDomain(domain: string) {
  try {
    const result = await vercel.projects.verifyProjectDomain({
      idOrName: process.env.VERCEL_PROJECT_ID!,
      domain,
    });

    return result;
  } catch (error) {
    console.error("Error verifying domain:", error);
    throw error;
  }
}
