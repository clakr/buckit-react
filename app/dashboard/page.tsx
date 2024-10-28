import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) return;

  const buckets = await db.query.buckets.findMany({
    where: (buckets, { eq }) => eq(buckets.user_id, userId),
  });

  return (
    <main className="mx-auto max-w-screen-lg p-4">
      <h2>Buckets</h2>
      <pre>{JSON.stringify(buckets, null, 2)}</pre>
    </main>
  );
}
