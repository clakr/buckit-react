import { BucketDropdownMenu } from "@/components/bucket-dropdown-menu";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Main from "@/components/ui/main";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { Bucket } from "@/db/schema";
import { currencyFormatter, truncateString } from "@/lib/utils";
import { currentUser, User } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  const authedUser = await currentUser();
  if (!authedUser) return;

  const { buckets, transactions } = await getData(authedUser.id);

  return (
    <Main className="grid gap-y-8">
      <section className="grid gap-y-4">
        <h2 className="text-xl font-bold">Buckets</h2>
        <BucketList buckets={buckets} />
      </section>

      <section className="grid gap-y-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <TransactionsTable transactions={transactions} />
      </section>
    </Main>
  );
}

async function getData(userId: User["id"]) {
  const buckets = await db.query.buckets.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
      userId: false,
    },
    where: (buckets, { eq }) => eq(buckets.userId, userId),
    orderBy: (buckets, { desc }) => [desc(buckets.totalAmount)],
    with: {
      transactions: {
        columns: {
          bucketId: false,
          updatedAt: false,
        },
      },
    },
  });

  type PartialTransactionsWithBucketName =
    ((typeof buckets)[number]["transactions"][number] & {
      bucket: { name: Bucket["name"] };
    })[];

  const transactions = buckets
    .reduce<PartialTransactionsWithBucketName>((previous, current) => {
      if (current.transactions.length) {
        previous.push(
          ...current.transactions.map((transaction) => ({
            ...transaction,
            bucket: { name: current.name },
          })),
        );
      }

      return previous;
    }, [])
    .toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return { buckets, transactions };
}

function BucketList({
  buckets,
}: {
  buckets: Awaited<ReturnType<typeof getData>>["buckets"];
}) {
  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      {buckets.map((bucket) => (
        <Card
          key={bucket.id}
          className="relative isolate flex flex-col justify-between"
        >
          <BucketDropdownMenu bucketId={bucket.id} />
          <CardHeader>
            <CardTitle>{truncateString(bucket.name)}</CardTitle>
            <CardDescription>
              {bucket.description ? truncateString(bucket.description) : null}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <strong>{currencyFormatter.format(+bucket.totalAmount)}</strong>
          </CardFooter>
        </Card>
      ))}
      <Link href="/buckets/create">
        <Card className="grid h-full place-content-center py-4 hover:bg-primary/5">
          <Plus className="size-20" />
        </Card>
      </Link>
    </div>
  );
}

function TransactionsTable({
  transactions,
}: {
  transactions: Awaited<ReturnType<typeof getData>>["transactions"];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Bucket</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Suspense
          fallback={
            <TableRow>
              <TableCell colSpan={5}>loading...</TableCell>
            </TableRow>
          }
        >
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="whitespace-nowrap">
                  {transaction.description}
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell className="whitespace-nowrap font-medium">
                  {transaction.bucket.name}
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
        </Suspense>
      </TableBody>
    </Table>
  );
}
