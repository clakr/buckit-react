"use server";

import { db } from "@/db";
import { buckets, transactions } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createBucket(formData: FormData) {
  const authedUser = await currentUser();
  if (!authedUser) throw new Error("No authedUser");

  const totalAmount = formData.get("totalAmount")?.toString() ?? "0";

  const [createdBucket] = await db
    .insert(buckets)
    .values({
      name: formData.get("name")?.toString() ?? "NO NAME VALUE",
      description: formData.get("description")?.toString(),
      totalAmount,
      userId: authedUser.id,
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

export async function deleteBucket(formData: FormData) {
  await db
    .delete(buckets)
    .where(eq(buckets.id, +(formData.get("bucketId")?.toString() ?? "")));

  redirect("/");
}
