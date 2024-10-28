"use server";

import { db } from "..";
import { buckets, insertBucketSchema } from "../schema";
import { redirect } from "next/navigation";
import { parse } from "valibot";

export async function createBucket(formData: FormData) {
  await db.insert(buckets).values({
    name: formData.get("name")?.toString() ?? "NO NAME VALUE",
    description: formData.get("description")?.toString(),
    totalAmount: formData.get("totalAmount")?.toString() ?? "0",
    userId: "user_2o0bivz7lMhQNoqFPF3ZOwY0fWD",
  });

  redirect("/dashboard");
}
