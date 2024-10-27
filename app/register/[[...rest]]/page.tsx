import { SignUp } from "@clerk/nextjs";

export default function page() {
  return (
    <main className="grid min-h-svh place-content-center">
      <SignUp />
    </main>
  );
}
