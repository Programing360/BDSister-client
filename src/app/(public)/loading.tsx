import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function PublicLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
