import { SignOutButton } from "@clerk/nextjs";

export default function page() {
  return (
    <main className="min-h-svh grid place-content-center">
      <SignOutButton />
    </main>
  );
}
