const IndexHeaderSkeleton = () => {
  return (
    <div className="w-full h-[50px] flex items-end pb-2 justify-between px-4 z-50 bg-white relative">
        <div className='w-[80px] h-[1.8rem] rounded-full skeleton'></div>
        <div className='w-[90px] h-[1rem] mt-1 rounded-full skeleton absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'></div>
        <div className="flex items-center gap-5">
            <div className='w-[1.6rem] h-[1.6rem] rounded-full skeleton'></div>
        </div>
    </div>
  )
}

export default IndexHeaderSkeleton