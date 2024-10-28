import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-screen-lg p-4">{children}</main>
    </>
  );
}

function Navbar() {
  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
        <section>
          <Button variant="link" className="h-[unset] p-0" asChild>
            <Link href="/">Dashboard</Link>
          </Button>
        </section>
        <section className="grid place-content-center">
          <UserButton />
        </section>
      </div>
    </nav>
  );
}
