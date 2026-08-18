import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="container-site flex flex-col gap-12 py-8">
      <Skeleton className="h-5 w-40" />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      <Skeleton className="h-64 rounded-3xl" />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
