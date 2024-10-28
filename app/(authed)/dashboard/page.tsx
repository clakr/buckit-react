import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { currencyFormatter, truncateString } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const authedUser = await currentUser();
  if (!authedUser) return;

  const buckets = await db.query.bucket.findMany({
    where: (bucket, { eq }) => eq(bucket.userId, authedUser.id),
    orderBy: (bucket, { desc }) => [desc(bucket.totalAmount)],
  });

  const transactions = await db.query.transaction.findMany({
    // @todo: add where clause
    orderBy: (transaction, { desc }) => [desc(transaction.createdAt)],
  });

  return (
    <>
      <section className="grid gap-y-2">
        <h2 className="text-xl font-bold">Buckets</h2>
        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {buckets.map((bucket) => (
            <Card key={bucket.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{truncateString(bucket.name)}</CardTitle>
                <CardDescription>
                  {bucket.description
                    ? truncateString(bucket.description)
                    : null}
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-end">
                <strong>{currencyFormatter.format(+bucket.totalAmount)}</strong>
              </CardFooter>
            </Card>
          ))}
          <Link href="/buckets/create">
            <Card className="grid h-full place-content-center hover:bg-primary/5">
              <Plus className="size-20" />
            </Card>
          </Link>
        </div>
      </section>
      <section className="grid gap-y-2">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        {transactions.map((transaction) => (
          <pre key={transaction.id}>{JSON.stringify(transaction, null, 2)}</pre>
        ))}
      </section>
    </>
  );
}
