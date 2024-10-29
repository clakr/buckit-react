import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { deleteBucket } from "@/actions/buckets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bucket } from "@/db/schema";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { EllipsisVertical, Eye, Trash } from "lucide-react";
import Form from "next/form";
import Link from "next/link";

export function BucketDropdownMenu({ bucketId }: { bucketId: Bucket["id"] }) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-2 top-2 rounded-full p-2">
          <span className="sr-only">Open Menu</span>
          <EllipsisVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/buckets/${bucketId}`}>
              <Eye />
              View
            </Link>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Trash />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Bucket</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete this bucket and its
            transactions? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form id="deleteForm" action={deleteBucket}>
          <input type="hidden" name="bucketId" value={bucketId} />
        </Form>
        <DialogFooter>
          <Button type="submit" variant="destructive" form="deleteForm">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
