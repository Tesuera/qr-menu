const ModifierSkeleton = () => {
  return (
    <div>
        <div className='w-full px-4 py-2 flex items-center justify-between gap-8'>
            <div className='w-[100px] h-[1rem] rounded-full skeleton'></div>
            
            <div className="w-[20px] h-[20px] rounded-md skeleton"></div>
        </div>
    </div>
  )
}

export default ModifierSkeleton