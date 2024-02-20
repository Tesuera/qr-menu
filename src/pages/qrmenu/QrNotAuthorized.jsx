const QrNotAuthorized = () => {
  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
        <div className='flex items-center justify-center flex-col w-[60%] text-center'>
            <img className='w-[285px] bg-none' src="assets/images/SessionTimeout.svg" alt="" />
            <h1 className="font-bold tracking-[-0.6px] text-[18px] text-stone-800 my-4">Oops! Your sessoion has expired.</h1>
        </div>
    </div>
  )
}

export default QrNotAuthorized