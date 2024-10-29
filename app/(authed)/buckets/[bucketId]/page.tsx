import { editBucket } from "@/actions/buckets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Main from "@/components/ui/main";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import Form from "next/form";

export default async function Page({ params }) {
  const { bucketId } = await params;

  const bucket = await db.query.buckets.findFirst({
    where: (buckets, { eq }) => eq(buckets.id, +bucketId),
    with: {
      transactions: true,
    },
  });
  if (!bucket) return;

  return (
    <Main>
      <section className="grid gap-y-4">
        <h2 className="text-xl font-bold">Bucket #{bucketId}</h2>
        <Form className="grid gap-y-4" action={editBucket}>
          <input type="hidden" name="id" value={bucket.id} />
          <div className="grid gap-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={bucket.name}
              required
            />
          </div>
          <div className="grid gap-y-2">
            <Label htmlFor="description">
              Description <small>(optional)</small>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={bucket.description ?? ""}
            />
          </div>
          <div className="grid gap-y-2">
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={bucket.totalAmount}
              required
            />
          </div>
          <Button type="submit" className="justify-self-end">
            Edit Bucket
          </Button>
        </Form>
      </section>
      <section className="grid gap-y-4">
        <h3 className="text-lg font-bold">Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bucket.transactions.length > 0 ? (
              bucket.transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {transaction.description}
                  </TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    {transaction.createdAt.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </Main>
  );
}