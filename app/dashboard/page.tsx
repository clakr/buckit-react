import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { truncateString } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) return;

  const buckets = await db.query.buckets.findMany({
    where: (buckets, { eq }) => eq(buckets.userId, userId),
    orderBy: (buckets, { desc }) => [desc(buckets.totalAmount)],
  });

  return (
    <main className="mx-auto max-w-screen-lg p-4">
      <section className="grid gap-y-2">
        <h2 className="text-xl font-bold">Buckets</h2>
        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {buckets.map((bucket) => (
            <Card key={bucket.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{bucket.name}</CardTitle>
                <CardDescription>
                  {bucket.description
                    ? truncateString(bucket.description)
                    : null}
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-end">
                <strong>{bucket.totalAmount}</strong>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
