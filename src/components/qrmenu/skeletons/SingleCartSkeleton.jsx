const SingleCartSkeleton = () => {
  return (
    <div className='w-full h-[85px] p-4 flex items-center justify-between gap-4 border-b-[0.3px] border-stone-100'>
        <div className="flex items-center gap-3 w-[75%]">
            <div className="w-[4rem] aspect-[1/1] rounded-md skeleton"></div>
            <div className="flex-1">
                <div className="w-[80px] h-[0.7rem] rounded-full skeleton mb-1"></div>
                <div className="w-[120px] h-[0.7rem] rounded-full skeleton"></div>
            </div>
        </div>
        <div className="flex flex-col items-end justify-between">
            <div className="h-[0.85rem] w-[40px] skeleton rounded-full"></div>
            <div className="flex items-center gap-1 mt-1">
                <div className="w-[24px] aspect-square rounded-full skeleton"></div>
                <div className="w-[24px] h-[24px] rounded-full skeleton"></div>
                <div className="w-[24px] aspect-square rounded-full skeleton"></div>
            </div>
        </div>
    </div>
  )
}

export default SingleCartSkeleton