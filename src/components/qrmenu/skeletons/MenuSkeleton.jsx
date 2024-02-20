import SingleMenuSkeleton from "./SingleMenuSkeleton"

const MenuSkeleton = () => {
  return (
    <div className="pb-4 flex items-center flex-wrap">
        <SingleMenuSkeleton />
        <SingleMenuSkeleton />
        <SingleMenuSkeleton />
        <SingleMenuSkeleton />
        <SingleMenuSkeleton />
        <SingleMenuSkeleton />
    </div>
  )
}

export default MenuSkeleton