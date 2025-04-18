import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <SignUp path="/sign-up" routing="path" />
    </main>
  );
}
