const SingleMenuSkeleton = () => {
  return (
    <div className="w-[50%] mb-4 px-2">
        <div className="w-full h-full">
            <div className="item-img mb-2 relative">
                <div className="w-full h-full rounded-lg skeleton"></div>
            </div>
            <div className="px-[4px]">
                <div className="w-[70px] h-[16px] rounded-full skeleton mb-[5px]"></div>
                <div className="w-[100px] h-[14px] rounded-full skeleton"></div>
            </div>
        </div>
    </div>
  )
}

export default SingleMenuSkeleton