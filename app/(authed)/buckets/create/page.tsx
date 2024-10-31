import { CreateEditBucketForm } from "@/components/create-bucket-form";
import Main from "@/components/ui/main";

export default function Page() {
  return (
    <Main>
      <section className="grid gap-y-4">
        <h2 className="text-xl font-bold">Create Bucket</h2>
        <CreateEditBucketForm intent="create" />
      </section>
    </Main>
  );
}
