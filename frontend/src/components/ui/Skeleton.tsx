export const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`
        animate-pulse bg-gray-200 rounded-lg
        ${className}
      `}
    />
  )
}

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <Skeleton className="h-48 w-full mb-4 rounded-xl" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
