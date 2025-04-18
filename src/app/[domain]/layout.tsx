import { ReactNode } from "react";
import PreviewNav from "@/components/PreviewNav";

interface DomainLayoutProps {
  children: ReactNode;
  params: Promise<{ domain: string }>;
}

export default async function DomainLayout({
  children,
  params,
}: DomainLayoutProps) {
  const { domain } = await params;
  return (
    <div className="relative min-h-screen">
      <PreviewNav domain={domain} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />
      {children}
    </div>
  );
}
