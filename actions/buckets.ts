"use server";

import { db } from "@/db";
import { bucket, transaction } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createBucket(formData: FormData) {
  const totalAmount = formData.get("totalAmount")?.toString() ?? "0";

  const [createdBucket] = await db
    .insert(bucket)
    .values({
      name: formData.get("name")?.toString() ?? "NO NAME VALUE",
      description: formData.get("description")?.toString(),
      totalAmount,
      userId: "user_2o0bivz7lMhQNoqFPF3ZOwY0fWD",
    })
    .returning({ id: bucket.id });

  if (+totalAmount > 0) {
    await db.insert(transaction).values({
      bucketId: createdBucket.id,
      description: "Initial Bucket Value",
      amount: totalAmount,
    });
  }

  redirect("/");
}
