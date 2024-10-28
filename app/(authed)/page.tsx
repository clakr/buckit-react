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
import {
  currencyFormatter,
  formatDateToRelative,
  truncateString,
} from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const authedUser = await currentUser();
  if (!authedUser) return;

  const buckets = await db.query.buckets.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
      userId: false,
    },
    where: (buckets, { eq }) => eq(buckets.userId, authedUser.id),
    orderBy: (buckets, { desc }) => [desc(buckets.totalAmount)],
  });

  const transactions = await db.query.transactions.findMany({
    columns: {
      updatedAt: false,
    },
    // @todo: add where clause
    orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
    with: {
      bucket: {
        columns: {
          name: true,
        },
      },
    },
  });

  return (
    <Main className="grid gap-y-8">
      <section className="grid gap-y-2">
        <h2 className="text-xl font-bold">Buckets</h2>
        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {buckets.map((bucket) => (
            <Card key={bucket.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{truncateString(bucket.name)}</CardTitle>
                <CardDescription>
                  {bucket.description
                    ? truncateString(bucket.description)
                    : null}
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-end">
                <strong>{currencyFormatter.format(+bucket.totalAmount)}</strong>
              </CardFooter>
            </Card>
          ))}
          <Link href="/buckets/create">
            <Card className="grid h-full place-content-center hover:bg-primary/5">
              <Plus className="size-20" />
            </Card>
          </Link>
        </div>
      </section>
      <section className="grid gap-y-2">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bucket</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {transaction.description}
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell className="font-medium">
                  {transaction.bucket.name}
                </TableCell>
                <TableCell>{transaction.createdAt.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </Main>
  );
}
