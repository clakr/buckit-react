import { SignOutButton } from "@clerk/nextjs";

export default function page() {
  return (
    <main className="grid min-h-svh place-content-center">
      <SignOutButton />
    </main>
  );
}
