import { SignUp } from "@clerk/nextjs";

export default function page() {
  return (
    <main className="grid place-content-center min-h-svh">
      <SignUp />
    </main>
  );
}
