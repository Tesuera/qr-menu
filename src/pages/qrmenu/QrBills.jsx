import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BillSkeleton from '../../components/qrmenu/skeletons/BillSkeleton';
import { setBillNo, setTableHeaderSyskey } from '../../slices/qrmenu/CartSlice';
import { formatDateToYYYYMMDD, getNavigateRoute } from '../../services/ControllerService';
import axios from 'axios';
import { postRequest } from '../../services/MainService';

const QrBills = () => {

    // AXIOS CANCEL TOKEN 
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // CONTEXT DATAS
    const isAuthorized = useSelector(state => state.qrconfig.isAuthorized);
    const isFetching = useSelector(state => state.qrconfig.fetchingJson);
    const billNo = useSelector(state => state.qrcart.billNo);
    const configData = useSelector(state => state.qrconfig.configData);
    const apiData = useSelector(state => state.qrconfig.apiData);

    // STATES
    const [bills, setBills] = useState([]);
    const [isFetchingBill, setIsFetchingBill] = useState(false);

    // HELPER HOOKS
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // HOOKS CALL

    useEffect(() => {
        if(!isFetching && configData != null && isAuthorized) {
            getBillDataFromSession();
            getBillList();
        }
       
        return () => source.cancel();
    }, [isFetching, configData, isAuthorized])


    //BUSSINESS LOGICS FUNCTIONS

    // GET BILL LIST
    const getBillList = () => {
        setIsFetchingBill(true);

        let url = configData.apiurl + "getKitchenItems";
        let today = formatDateToYYYYMMDD(new Date());
        
        // CALL BILL LIST API
        postRequest(url, {
            "domain": apiData.domain,
            "demo": "0",
            "date": today,
            "status": "",
            "tablesyskey": apiData.tablesyskey
        },
        {
            cancelToken: source.token,
            headers: {
                token: apiData.token, 
                data: apiData.headerData
            }
        }).then(({data: billData}) => {
            if(billData?.status == "SUCCESS") {
                setBills(billData.kitchenData);
                dispatch(setBillNo(billData?.kitchenData[0]?.slipNo));

                setIsFetchingBill(false);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const getBillDataFromSession = () => {
        if(sessionStorage.getItem("billNo") && sessionStorage.getItem("headerSyskey")) {
            dispatch(setTableHeaderSyskey(parseInt(sessionStorage.getItem("headerSyskey"))))
            dispatch(setBillNo(parseInt(sessionStorage.getItem("billNo"))))
        }
    }

    const gotoRoute = (path) => {
        navigate(getNavigateRoute(path, apiData));
    }

    return (
        <>
         <div className="fixed top-0 left-0 w-full bg-white h-[50px] z-40 flex justify-start items-center gap-4 px-4">
            <button onClick={() => gotoRoute("/qr")} className="text-primary text-[1.5rem] justify-self-start">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" className='stroke-primary' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <h1 className="text-[1.2rem] leading-[1.2rem] text-stone-800 font-semibold">Bill {(bills.length) ? ` - #${billNo}` : ''}</h1>
        </div>
        {!isFetching && isAuthorized && !isFetchingBill 
        ?
            (bills.length)
            ?
            <>
                <div className='mt-[50px] pb-[90px] w-full px-4'>
                    {bills.map((s, index) => (
                        <div key={index}>
                        {s.details.map((e, index) => (
                            <div key={index} className='flex items-start justify-between gap-4'>
                            <>
                                <div className='flex items-start gap-2 py-1 w-[70%]'>
                                    <p className='text-[14px] font-semibold'>{e.qty.toLocaleString()}x</p>
                                    <div>
                                        <p className='text-[14px] font-semibold text-eclipsis-2 leading-[normal]'>{e.stockDesc}</p>
                                        {(e.modifier != "") ? e.modifier.split(",").map((m, index) => <span className="text-[12px] text-stone-500 leading-[normal]" key={index}>- {m}</span>) : ""}
                                    </div>
                                </div>

                                <p className='text-[14px] py-2'>{e.price.toLocaleString()} Ks</p>
                            </>
                            </div>
                        ))}
                        {(bills[index + 1]) ? <div className=' w-[90%] h-[1px] rounded-full mx-auto bg-stone-300 my-1'></div> : ''}
                        </div>
                        )
                    )}
                </div>

                <div className="fixed bottom-0 left-0 w-full h-[70px] px-4 pt-3 pb-5 border-t-[1px] border-stone-300 z-30 bg-white">
                    <div className="flex items-end justify-between mb-4">
                        <h1 className="text-[1.2rem] text-stone-700 font-[500]">Total</h1>
                        <p className="text-[1.3rem] tracking-[-0.4px] text-stone-800 font-semibold">{bills.reduce((p, c) => p + c.totalPrice ,0).toLocaleString()} Ks</p>
                    </div>
                </div>
            </>
            :
            <div className="w-full h-[100vh] flex items-center justify-center">
                <div className="flex items-center justify-center flex-col w-[65%] text-center">
                    <img className='w-[295px] bg-none' src="assets/images/NoBill.svg" alt="" />
                    <h1 className="font-bold tracking-[-0.6px] text-[18px] leading-[24px] text-stone-800 my-4">You do not currently have an order.</h1>
                </div>
            </div>
        :
            <BillSkeleton />
        } 
        </>
    )
}

export default QrBills