export default function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm animate-pulse">
      {/* Table Header Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex gap-4">
          {[...Array(columns)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
            ></div>
          ))}
        </div>
      </div>

      {/* Table Body Skeleton */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-5 flex gap-4">
            {[...Array(columns)].map((_, colIndex) => (
              <div
                key={colIndex}
                className={`h-3 bg-gray-100 dark:bg-gray-800 rounded w-full ${
                  colIndex === 0 ? "w-3/4" : "w-full" // Variation for first column
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
