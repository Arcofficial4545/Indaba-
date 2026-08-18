import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Skeleton className="h-5 w-64" />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
        <Skeleton className="size-21 rounded-2xl" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      <Skeleton className="h-14 rounded-full" />

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="flex flex-col gap-16">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-5">
              <Skeleton className="mx-auto h-10 w-72" />
              <Skeleton className="h-48 rounded-3xl" />
            </div>
          ))}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
}
