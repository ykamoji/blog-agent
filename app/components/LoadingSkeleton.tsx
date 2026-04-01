export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-14 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    </div>
  );
}
