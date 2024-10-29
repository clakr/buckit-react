import { createBucket } from "@/actions/buckets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Main from "@/components/ui/main";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@clerk/nextjs/server";
import Form from "next/form";

export default async function Page() {
  const authedUser = await currentUser();
  if (!authedUser) return;

  return (
    <Main>
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
            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>
          <Button type="submit" className="justify-self-end">
            Create Bucket
          </Button>
        </Form>
      </section>
    </Main>
  );
}
