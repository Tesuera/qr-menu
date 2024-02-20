import SingleBillSkeleton from "./SingleBillSkeleton"

const BillSkeleton = () => {
  return (
    <div className="mt-[70px] w-full px-4">
        <SingleBillSkeleton />
        <SingleBillSkeleton />
        <div className='w-[90%] h-[1px] rounded-full mx-auto bg-stone-300 my-3'></div>
        <SingleBillSkeleton />
        <SingleBillSkeleton />
        <div className='w-[90%] h-[1px] rounded-full mx-auto bg-stone-300 my-3'></div>
        <SingleBillSkeleton />  
        <SingleBillSkeleton />  
        <SingleBillSkeleton />  
        <SingleBillSkeleton />  
    </div>
  )
}

export default BillSkeleton