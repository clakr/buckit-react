"use server";

import { db } from "@/db";
import { Bucket, buckets, Transaction, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createTransaction(formData: FormData) {
  console.log(formData);
  const bucketId = +(formData.get("bucketId")?.toString() ?? "");
  if (!bucketId) throw new Error("No bucketId provided");

  const amount = formData.get("amount")?.toString() ?? "";
  if (!amount) throw new Error("No amount provided");

  const type = formData.get("type")!.toString() as Transaction["type"];
  if (!type) throw new Error("No type provided");

  await db.insert(transactions).values({
    bucketId,
    description: formData.get("description")?.toString() ?? "NO BUCKETID VALUE",
    amount,
    // @temporary
    type,
  });

  const totalAmount =
    type === "inbound"
      ? sql`${buckets.totalAmount} + ${amount}`
      : sql`${buckets.totalAmount} - ${amount}`;

  await db
    .update(buckets)
    .set({
      totalAmount,
    })
    .where(eq(buckets.id, bucketId));

  redirect(`/buckets/${bucketId}`);
}
