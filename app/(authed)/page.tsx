import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { currencyFormatter, truncateString } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Plus, EllipsisVertical, Trash, Eye } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Main className="grid gap-y-8">
      <section className="grid gap-y-2">
        <h2 className="text-xl font-bold">Buckets</h2>
        <Suspense fallback={<p>loading...</p>}>
          <BucketList />
        </Suspense>
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
            <Suspense
              fallback={
                <TableRow>
                  <TableCell colSpan={5}>loading...</TableCell>
                </TableRow>
              }
            >
              <TransactionList />
            </Suspense>
          </TableBody>
        </Table>
      </section>
    </Main>
  );
}

async function BucketList() {
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

  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      {buckets.map((bucket) => (
        <Card
          key={bucket.id}
          className="relative isolate flex flex-col justify-between"
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute right-2 top-2 rounded-full p-2">
              <span className="sr-only">Open Menu</span>
              <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href={`/buckets/${bucket.id}`}>
                  <Eye />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <Card className="grid h-full place-content-center hover:bg-primary/5">
          <Plus className="size-20" />
        </Card>
      </Link>
    </div>
  );
}

async function TransactionList() {
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

  return transactions.map((transaction) => (
    <TableRow key={transaction.id}>
      <TableCell>{transaction.id}</TableCell>
      <TableCell className="whitespace-nowrap">
        {transaction.description}
      </TableCell>
      <TableCell>{transaction.amount}</TableCell>
      <TableCell className="font-medium">{transaction.bucket.name}</TableCell>
      <TableCell>{transaction.createdAt.toLocaleString()}</TableCell>
    </TableRow>
  ));
}
