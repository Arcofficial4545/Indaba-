import { Skeleton } from "@/components/ui/skeleton";

export default function DirectoryLoading() {
  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Skeleton className="h-5 w-48" />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <Skeleton className="hidden h-96 lg:block" />

        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
