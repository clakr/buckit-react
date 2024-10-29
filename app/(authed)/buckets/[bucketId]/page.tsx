import { editBucket } from "@/actions/buckets";
import { createTransaction } from "@/actions/transactions";
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
import { Bucket, Transaction } from "@/db/schema";
import Form from "next/form";
import { Suspense } from "react";

export default async function Page({ params }) {
  return (
    <Main>
      <Suspense fallback={<p>loading...</p>}>
        <Content params={params} />
      </Suspense>
    </Main>
  );
}

async function Content({ params }) {
  const { bucketId } = await params;

  const bucket = await db.query.buckets.findFirst({
    where: (buckets, { eq }) => eq(buckets.id, +bucketId),
    with: {
      transactions: {
        orderBy: (buckets, { desc }) => [desc(buckets.createdAt)],
      },
    },
  });
  if (!bucket) return;

  return (
    <>
      <EditBucketForm bucket={bucket} />
      <section className="grid gap-y-4">
        <h3 className="text-lg font-bold">Transactions</h3>
        <AddTransactionForm bucketId={bucketId} />
        <BucketTransactionsTable transactions={bucket.transactions} />
      </section>
    </>
  );
}

function EditBucketForm({ bucket }: { bucket: Bucket }) {
  return (
    <section className="grid gap-y-4">
      <h2 className="text-xl font-bold">Bucket #{bucket.id}</h2>
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
  );
}

function AddTransactionForm({ bucketId }: { bucketId: Bucket["id"] }) {
  return (
    <Form action={createTransaction} className="grid gap-y-4">
      <input type="hidden" name="bucketId" value={bucketId} />
      <div className="grid gap-y-2">
        <Label htmlFor="transaction_description">Description</Label>
        <Input
          id="transaction_description"
          name="description"
          type="text"
          required
        />
      </div>
      <div className="grid gap-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
        />
      </div>
      <Button type="submit" className="justify-self-end">
        Add Transaction
      </Button>
    </Form>
  );
}

function BucketTransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="whitespace-nowrap">
                {transaction.description}
              </TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.createdAt.toLocaleString()}</TableCell>
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
  );
}
