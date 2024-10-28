import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBucket } from "@/db/buckets/actions";
import { currentUser } from "@clerk/nextjs/server";
import Form from "next/form";

export default async function Page() {
  const authedUser = await currentUser();
  if (!authedUser) return;

  return (
    <section className="grid gap-y-4">
      <h2 className="text-xl font-bold">Create Bucket</h2>
      <Form className="grid gap-y-4" action={createBucket}>
        <input type="hidden" name="userId" value={authedUser.id} />
        <div className="grid gap-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="grid gap-y-2">
          <Label htmlFor="description">
            Description <small>(optional)</small>
          </Label>
          <Textarea id="description" name="description" rows={5} />
        </div>
        <div className="grid gap-y-2">
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input id="totalAmount" name="totalAmount" type="number" required />
        </div>
        <Button type="submit">Create Bucket</Button>
      </Form>
    </section>
  );
}