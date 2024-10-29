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

type Params = Promise<{ bucketId: string }>;

export default async function Page({ params }: { params: Params }) {
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
    <Main className="grid gap-y-8">
      <section className="grid gap-y-4">
        <h2 className="text-xl font-bold">Bucket #{bucket.id}</h2>
        <EditBucketForm bucket={bucket} />
      </section>
      <section className="grid gap-y-4">
        <h3 className="text-lg font-bold">Transactions</h3>
        <AddTransactionForm bucketId={+bucketId} />
        <BucketTransactionsTable transactions={bucket.transactions} />
      </section>
    </Main>
  );
}

function EditBucketForm({ bucket }: { bucket: Bucket }) {
  return (
    <Form className="grid gap-4 sm:grid-cols-[1fr_200px]" action={editBucket}>
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
      <div className="grid gap-y-2 sm:col-span-2">
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

      <Button type="submit" className="justify-self-end sm:col-span-2">
        Edit Bucket
      </Button>
    </Form>
  );
}

function AddTransactionForm({ bucketId }: { bucketId: Bucket["id"] }) {
  return (
    <Form
      action={createTransaction}
      className="grid gap-4 sm:grid-cols-[2fr_1fr_150px]"
    >
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
      <Button type="submit" className="self-end">
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
