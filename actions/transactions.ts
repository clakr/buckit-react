"use server";

import { db } from "@/db";
import { buckets, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createTransaction(formData: FormData) {
  const bucketId = +(formData.get("bucketId")?.toString() ?? "");
  if (!bucketId) throw new Error("No bucketId provided");

  const amount = formData.get("amount")?.toString() ?? "";
  if (!amount) throw new Error("No amount provided");

  await db.insert(transactions).values({
    bucketId,
    description: formData.get("description")?.toString() ?? "NO BUCKETID VALUE",
    amount,
  });

  await db
    .update(buckets)
    .set({
      totalAmount: sql`${buckets.totalAmount} + ${amount}`,
    })
    .where(eq(buckets.id, bucketId));

  redirect(`/buckets/${bucketId}`);
}
