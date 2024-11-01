import Main from "@/components/ui/main";

export default function Loading() {
  return (
    <Main className="grid gap-y-8">
      <section className="grid gap-y-2">
        <h2 className="text-xl font-bold">Buckets</h2>
        <p>loading...</p>
      </section>

      <section className="grid gap-y-2">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <p>loading...</p>
      </section>
    </Main>
  );
}
