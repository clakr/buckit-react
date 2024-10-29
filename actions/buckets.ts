"use server";

import { db } from "@/db";
import { buckets, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createBucket(formData: FormData) {
  const totalAmount = formData.get("totalAmount")?.toString() ?? "0";

  const [createdBucket] = await db
    .insert(buckets)
    .values({
      name: formData.get("name")?.toString() ?? "NO NAME VALUE",
      description: formData.get("description")?.toString(),
      totalAmount,
      userId: formData.get("userId")?.toString() ?? "NO USERID VALUE",
    })
    .returning({ id: buckets.id });

  if (+totalAmount > 0) {
    await db.insert(transactions).values({
      bucketId: createdBucket.id,
      description: "Initial Bucket Value",
      amount: totalAmount,
    });
  }

  redirect("/");
}

export async function editBucket(formData: FormData) {
  const bucketId = +(formData.get("id")?.toString() ?? "");
  if (!bucketId) throw new Error("No bucketId provided");

  await db
    .update(buckets)
    .set({
      name: formData.get("name")?.toString(),
      description: formData.get("description")?.toString(),
      totalAmount: formData.get("totalAmount")?.toString(),
    })
    .where(eq(buckets.id, bucketId));

  redirect(`/buckets/${bucketId}`);
}
