import Main from "@/components/ui/main";

export default function Loading() {
  return (
    <Main className="grid gap-y-8">
      <section className="grid gap-y-4">
        <h2 className="text-xl font-bold">Bucket #</h2>
        <p>loading...</p>
      </section>
      <section className="grid gap-y-4">
        <h3 className="text-lg font-bold">Transactions</h3>
        <p>loading...</p>
      </section>
    </Main>
  );
}
