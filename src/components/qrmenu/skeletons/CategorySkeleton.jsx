const CategorySkeleton = () => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide h-[54px] px-4 z-40 bg-white">
        <div className="flex items-center gap-[8px] w-max h-full">
            <div className="h-[40px] w-[130px] rounded-lg skeleton"></div>
            <div className="h-[40px] w-[110px] rounded-lg skeleton"></div>
            <div className="h-[40px] w-[90px] rounded-lg skeleton"></div>
            <div className="h-[40px] w-[120px] rounded-lg skeleton"></div>
        </div>
    </div>
  )
}

export default CategorySkeleton