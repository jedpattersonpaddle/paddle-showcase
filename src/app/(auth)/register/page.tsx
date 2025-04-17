import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Image src="/logo.jpg" alt="Logo" width={150} height={80} />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
