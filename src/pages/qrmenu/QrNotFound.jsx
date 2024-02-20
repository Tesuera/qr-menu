const QrNotFound = () => {
  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
        <div className='flex items-center justify-center flex-col w-[80%] text-center mb-10'>
          <img className='bg-none w-full' src="assets/images/404.svg" alt="" />

            <div className='w-[90%]'>
              <h1 className="font-bold tracking-[-0.3px] text-[20px] text-stone-800">Oops! No Sushi here...</h1>
              <p className="tracking-[-0.3px] text-[14px] text-stone-400">Please check your URL or try to go back.</p>
            </div>
        </div>
    </div>
  )
}

export default QrNotFound