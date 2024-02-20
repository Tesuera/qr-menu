import KitchenOrder from './KitchenOrder'
import {useSelector} from 'react-redux'

const KitchenBody = () => {

    const orderList = useSelector(state => state.kitchenorder.orderList)

    return (
        <>
            {(orderList.length)
            ?
            <div className='w-max flex-1 h-full py-4 flex flex-col flex-wrap overflow-hidden'>
                {orderList.map((order, index) => <KitchenOrder key={index} order={order} />)}
            </div>
            :
            <div className='w-full h-[100%] flex-1 flex items-center justify-center text-center'>
                <div>
                    <img className='w-[28vw]' src="assets/images/NoOrder.svg" alt="" />
                    <div>
                        <p className='text-[1.2vw] font-semibold'>There is no order right now.</p>
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default KitchenBody