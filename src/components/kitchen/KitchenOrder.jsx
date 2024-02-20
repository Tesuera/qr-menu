import { useEffect } from "react"
import { APITOUI } from "../../services/ControllerService";

const KitchenOrder = ({order}) => {

    useEffect(() => {
        console.log(order);
    }, [])

    return (
        <>
            <div className="order-header">
                <div className="w-full flex items-start justify-between border-[1px] border-slate-100 border-t-none bg-slate-200 p-4 rounded-tl-[1rem] rounded-tr-[1rem]">
                    <div>
                        <h1 className="text-[1.15vw]">{order.tableDesc}</h1>
                        <p className="text-[0.95vw]">#{order.slipNo}, {APITOUI(order.time)}</p>
                    </div>
                </div>
            </div>
            {order.details.map((dd, index, array) => (
                <div key={dd.syskey} className="order-header">
                    <div className={`flex items-start gap-4 border-[1px] border-slate-100 border-t-none bg-white p-4 ${(index == array.length-1) ? 'rounded-bl-[1rem] rounded-br-[1rem] mb-4': ''}`}>
                        <p className="text-[0.9vw] leading-normal font-[700] my-[0.25rem]">{dd.qty}x</p>

                        <div>
                            <h2 className="text-[0.9vw] leading-normal font-[700] my-[0.25rem] text-eclipsis-2">{dd.stockDesc}</h2>
                            {(dd.modifier != "")
                            ?
                            dd.modifier.split(",").map((m, index) => <p className="text-[0.85vw] leading-normal text-slate-700 my-[0.3rem] text-eclipsis-2" key={index}>- {m}</p>)
                            :
                            ''
                            }
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default KitchenOrder