import { createTransaction } from "@/actions/transactions";
import { CreateEditBucketForm } from "@/components/create-edit-bucket-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Main from "@/components/ui/main";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { Bucket, Transaction } from "@/db/schema";
import { currencyFormatter } from "@/lib/utils";
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
        <CreateEditBucketForm intent="edit" bucket={bucket} />
      </section>
      <section className="grid gap-y-4">
        <h3 className="text-lg font-bold">Transactions</h3>
        <AddTransactionForm bucketId={+bucketId} />
        <BucketTransactionsTable transactions={bucket.transactions} />
      </section>
    </Main>
  );
}

function AddTransactionForm({ bucketId }: { bucketId: Bucket["id"] }) {
  return (
    <Form action={createTransaction} className="grid gap-4">
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
      <div className="grid gap-y-4">
        <Label>Transaction Type</Label>
        <RadioGroup name="type" defaultValue="inbound">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inbound" id="inbound" />
            <Label htmlFor="inbound">Inbound</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outbound" id="outbound" />
            <Label htmlFor="outbound">Outbound</Label>
          </div>
        </RadioGroup>
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
              <TableCell className="font-bold">
                {transaction.type === "inbound" ? "+" : "-"}{" "}
                {currencyFormatter.format(+transaction.amount)}
              </TableCell>
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
