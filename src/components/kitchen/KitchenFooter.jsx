import { useSelector } from 'react-redux'

const KitchenFooter = () => {

  const orderList = useSelector(state => state.kitchenorder.orderList);

  return (
    <div className='w-full h-[9vh] bg-white flex items-center justify-between px-[1rem]'>
        <p className='text-black text-[3vh] font-semibold '>{orderList.length} {(orderList.length > 1) ? 'Orders' : 'Order'}</p>
        <p className='text-black text-[2.5vh] font-[400] leading-normal'>Kitchen View Min Lan (Parami)</p>
    </div>
  )
}

export default KitchenFooter