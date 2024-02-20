const SingleBillSkeleton = () => {
  return (
    <div className='flex items-center justify-between gap-4'>
        <div className='flex items-start gap-2 py-3 w-[70%]'>
            <div className='w-[20px] h-[15px] skeleton rounded-lg font-semibold'></div>
            <div className='w-[150px] h-[15px] skeleton rounded-lg font-semibold'></div>
        </div>

        <div className='w-[50px] h-[15px] skeleton rounded-lg font-semibold'></div>
    </div>
  )
}

export default SingleBillSkeleton