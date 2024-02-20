import ModifierSkeleton from "./ModifierSkeleton"

const ItemDetailSkeleton = () => {
  return (
    <div>
        <div className="w-full aspect-[16/8] skeleton"></div>

        <div className="px-4 w-full bg-white pt-4">
            <div className="w-[80px] h-[1rem] rounded-full skeleton mb-1"></div>
            <div className="w-[40px] h-[1rem] rounded-full skeleton"></div>
        </div>
        <div className='w-[90%] h-[1px] my-3 bg-stone-200 rounded-full mx-auto'></div>
        <ModifierSkeleton />
        <ModifierSkeleton />
        <div className='w-[90%] h-[1px] my-3 bg-stone-200 rounded-full mx-auto'></div>
        <div className="px-4 py-2">
            <div className="w-[40px] h-[1rem] rounded-full skeleton mb-2"></div>

            <div className="w-full h-[5rem] rounded-xl skeleton mb-1"></div>
        </div>
    </div>
  )
}

export default ItemDetailSkeleton