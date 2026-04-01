export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse bg-white p-5 rounded-2xl shadow-sm">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}