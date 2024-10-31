import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { createBucket, editBucket } from "@/actions/buckets";
import { Bucket } from "@/db/schema";
import Form from "next/form";

type Props = { intent: "create" } | { intent: "edit"; bucket: Bucket };

export function CreateEditBucketForm(props: Props) {
  const action = props.intent === "create" ? createBucket : editBucket;

  let bucket;
  if (props.intent === "edit") {
    bucket = props.bucket;
  }

  return (
    <Form className="grid gap-4 sm:grid-cols-[1fr_200px]" action={action}>
      <input type="hidden" name="id" value={bucket?.id} />
      <div className="grid gap-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={bucket?.name}
          required
        />
      </div>
      <div className="grid gap-y-2">
        <Label htmlFor="totalAmount">Total Amount</Label>
        <Input
          id="totalAmount"
          name="totalAmount"
          type="number"
          step="0.01"
          defaultValue={bucket?.totalAmount}
          required
        />
      </div>
      <div className="grid gap-y-2 sm:col-span-2">
        <Label htmlFor="description">
          Description <small>(optional)</small>
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={bucket?.description ?? ""}
        />
      </div>

      <Button type="submit" className="justify-self-end sm:col-span-2">
        {bucket ? "Edit Bucket" : "Create Bucket"}
      </Button>
    </Form>
  );
}
