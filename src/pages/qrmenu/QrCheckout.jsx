import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus  } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setBillNo, setCartList, setTableHeaderSyskey } from "../../slices/qrmenu/CartSlice";
import { useEffect, useRef, useState } from "react";
import Swiper from "react-id-swiper";
import 'swiper/css';   
import { v4 } from "uuid";
import { convertToSendOrderDetailData, getNavigateRoute } from "../../services/ControllerService";
import axios from "axios";
import CartSkeleton from "../../components/qrmenu/skeletons/CartSkeleton";
import { postRequest } from "../../services/MainService";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import Stomp from "stompjs";

const QrCheckout = () => {
    

    // AXIOS CANCEL TOKEN
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // CONTEXT DATA
    const cartList = useSelector(state => state.qrcart.cartList);
    const configData = useSelector(state => state.qrconfig.configData);
    const apiData = useSelector(state => state.qrconfig.apiData);
    const isAuthorized = useSelector(state => state.qrconfig.isAuthorized);
    const tableHeaderSyskey = useSelector(state => state.qrcart.tableHeaderSyskey);
    const isFetching = useSelector(state => state.qrconfig.fetchingJson);
    const billNo = useSelector(state=> state.qrcart.billNo);

    // REFERENCES
    const swiperRefs = useRef([]);

    // STATES
    const [sendingOrder, setSendingOrder] = useState(false);
    const [placeOrder, setPlaceOrder] = useState(false);
    const [stomp, setStomp] = useState(null);

    // HELPER HOOKS
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // HOOK CALLS
    useEffect(() => {
        // GET CART LIST AND BILL.NO ...ETC FROM SESSION STORAGE IF THE ENTER USER IS AUTHORIZED
        if(!isFetching && configData != null && isAuthorized) {
            getCartFromSession();
            getBillDataFromSession();

            
            const sock = new SockJS(configData.websocketurl);
            setStomp(prev => Stomp.over(sock));
        }

        // CANCEL API CALLS IF THE TOKEN IS CALLING
        return () => {
            source.cancel();
            if(stomp) stomp.disconnect();
        }
    }, [isFetching, configData, isAuthorized])

    useEffect(() => {
        if(stomp) {
            stomp.connect({}, onConnect, onError);
        }
    }, [stomp])

    //BUSSINESS LOGICS FUNCTIONS

    // CONNECTING SOCKET
    const onConnect = (frame) => {
        console.log('Connected');
    };
    
      const onError = (error) => {
        console.log('err');
        console.error('Error: ' + error);
    };

    // FUNCTION CALL WHEN THE SEND ORDER BUTTON GETS CLICKED
    const handlePlaceOrder = () => {
        setSendingOrder(true);
        callSendOrderApi();
    }

    // FUNCTION CALL WHEN THE MINUS(-) BUTTON ON EACH ITEM GETS CLICKED
    const handleDecreaseItemCount = (itemIndex) => {
        const newCount = cartList[itemIndex].cartCount - 1;
    
        if (newCount <= 0) {
            handleDeleteItem(itemIndex);
            return;
        }
    
        updateCartItemCount(itemIndex, newCount);
    };

    // FUNCTION CALL WHEN THE PLUS(+) BUTTON ON EACH ITEM GETS CLICKED
    const handleIncreaseItemCount = (itemIndex) => {
        const newCount = cartList[itemIndex].cartCount + 1;
        updateCartItemCount(itemIndex, newCount);
    }

    // FUNCTION CALL WHEN THE DELETE BUTTON ON EACH ITEM GETS CLICKED
    const handleDeleteItem = (itemIndex) => {
        const selectedItem = cartList[itemIndex];
        let updatedCart;
    
        if (selectedItem.isAddOn) {
            updatedCart = cartList.filter((_, index) => index !== itemIndex);
        } else {
            updatedCart = cartList.filter(e => e.n45 !== selectedItem.projectCode && e.projectCode !== selectedItem.projectCode);
        }
    
        // Update the cart in both state and session storage
        dispatch(setCartList(updatedCart));
        saveToSessionStorage(updatedCart);
    
        // Reset the swiper position if needed
        if (swiperRefs.current[itemIndex]) {
            swiperRefs.current[itemIndex].swiper.slideTo(0, 0);
        }
    };

    // UPDATING CART ITEM COUNT ON CLICKING +, - BUTTONS
    const updateCartItemCount = (itemIndex, newCount) => {
        const updatedItem = {
            ...cartList[itemIndex],
            cartCount: newCount,
            totalPrice: cartList[itemIndex].price * newCount
        };
    
        const updatedCart = [
            ...cartList.slice(0, itemIndex),
            updatedItem,
            ...cartList.slice(itemIndex + 1)
        ];
    
        dispatch(setCartList(updatedCart));
        saveToSessionStorage(updatedCart);
    };

    const callSendOrderApi = () => {
        let url = configData.apiurl + "save";

        let totalAmount = cartList.reduce((p, c) => p + c.totalPrice ,0);
        let totalItemCount = cartList.reduce((p, c) => p + c.cartCount ,0);
        let uniqueKey = v4();
        let details = cartList.map(e => convertToSendOrderDetailData(e, uniqueKey));

        let sendOrderData = {
            "domain": apiData.domain,
            "syskey": (tableHeaderSyskey) ? tableHeaderSyskey : "0",
            "userid": "v6admin",
            "username": "v6admin",
            "ref5": apiData.tablesyskey,// table syskey
            "t1": "", // slip no
            "t8": "MMK", //
            "t12": "001",
            "n1": "0", // customer syskye
            "n5": totalAmount, // net amount
            "n7": 0, // detail discount amount total
            "n9": 0, // discount amount
            "n10": totalAmount,// net amount
            "n12": "0", //tax pcent
            "n13": 0, // tax inclusive
            "n14": 0, // tax amount
            "discPercent": 0,
            "n16": apiData.locsyskey, // location syskey
            "n21": "0", // person syskey
            "n26": "1", // counter syskey
            "userSyskey": "0",
            "n31": 0, // service amount
            "n32": 0, // service pcent
            "n37":"0",
            "stockDetails": details,
            "deletedStockDetails": [],
            "t25": "",
            "t30": uniqueKey,
            "stkqtydecimal": totalItemCount
        }
        let sendOrderRequestHeader = {
            token: apiData.token, 
            data: apiData.headerData
        }

        postRequest(url, sendOrderData, {
            headers: sendOrderRequestHeader,
            cancelToken: source.token,
        }).then(({data: sendOrderResData}) => {
            if(sendOrderResData?.message == "SUCCESS") {
                handleSuccessSendOrder(sendOrderResData);
            } else {
                navigate('/authorization-error')
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const handleSuccessSendOrder = (sendOrderResData) => {
        if (!sessionStorage.getItem("billNo")) {
            dispatch(setTableHeaderSyskey(sendOrderResData.syskey))
            dispatch(setBillNo(sendOrderResData.slipNo));
            sessionStorage.setItem("billNo", sendOrderResData.slipNo);
            sessionStorage.setItem("headerSyskey", sendOrderResData.syskey);
        }
    
        setSendingOrder(false);

        setPlaceOrder(true);

        const sendMessageData = {
            orgId: apiData.token, 
            data: apiData.headerData,
            syskey: sendOrderResData.syskey
        }
        console.log(sendMessageData);
        sendMessage(sendMessageData);
        setTimeout(() => {
            sessionStorage.removeItem('qrcart');
            gotoRoute("/qr");
            setPlaceOrder(false);
            dispatch(setCartList([]));
        }, 5000);
    };

    const sendMessage = (data) => {
        if(stomp) stomp.send('/azureps/azuresend/stm/0001', {}, JSON.stringify({ message: JSON.stringify(data) }));
    };

    // GET CART LIST FROM SESSION
    const getCartFromSession = () => {
        if(sessionStorage.getItem('qrcart')) {
            dispatch(setCartList(JSON.parse(sessionStorage.getItem('qrcart'))))
        }
    }

    // GET BILL NO. AND BILL SYSKEY FROM SESSION
    const getBillDataFromSession = () => {
        let billNo = sessionStorage.getItem("billNo");
        let headerSyskey = sessionStorage.getItem("headerSyskey")

        if(billNo && headerSyskey) {
            dispatch(setTableHeaderSyskey(parseInt(headerSyskey)));
            dispatch(setBillNo(parseInt(billNo)));
        }
    }

    // SAVE CART TO SESSION
    const saveToSessionStorage = (cart) => {
        sessionStorage.setItem("qrcart", JSON.stringify(cart));
    }

    // NAVIGATE TO ANYWHERE WITH QUERYPARAMS
    const gotoRoute = (path) => {
        navigate(getNavigateRoute(path, apiData));
    }

    return (
        <div className="w-full overflow-hidden">
            <div className={`placingorder fixed flex items-center justify-center top-0 left-0 bottom-0 right-0 order-noti z-50 ${placeOrder? 'placing' : 'hidePlaceOrder'}`}>
                <div className="w-[240px] text-center mb-4">
                    <p className="font-semibold text-stone-800 text-[1.05rem]">We are preparing your order. When finished, we will announce.</p>
                    <p className="text-[0.7rem] text-stone-500 mt-6">Your order number</p>
                    <h1 className="text-[4rem] leading-[4.2rem] font-bold text-primary">{billNo}</h1>
                </div>
            </div>

            {/* HEADER */}
            <div className="fixed top-0 left-0 w-full  bg-white h-[50px] z-40 flex justify-start items-center gap-4 px-4 ">
                <button onClick={() => gotoRoute("/qr")} className=" text-primary text-[1.5rem] justify-self-start">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h1 className=" text-[1.2rem] leading-[1.2rem] text-stone-800 font-semibold">Cart Items</h1>
            </div>

            {(!isFetching && isAuthorized)
            ?
                (cartList.length)
                ?
                    <>
                    <div className="fixed bottom-0 left-0 w-full h-[130px] pt-3 px-4 pb-1 border-t-[1px] border-stone-300 z-30 bg-white">
                        <div className="flex items-end justify-between mb-4">
                            <h1 className="text-[1.2rem] text-stone-700 font-[500]">Total</h1>
                            <p className="text-[1.3rem] tracking-[-0.4px] text-stone-800 font-semibold">{cartList.reduce((p, c) => p + c.totalPrice ,0).toLocaleString()} Ks</p>
                        </div>
                        <button onClick={handlePlaceOrder} className={`text-[0.9rem] rounded-lg w-full py-[12px] font-[500] tracking-[0.3px] menu-button font-semibold flex items-center justify-center gap-1 ${sendingOrder ? 'sending' : ''}`}>Send Order {sendingOrder ? <span className="loader"></span> : ''}</button>
                    </div>
                    <div className="mt-[50px] mb-[130px]">
                        {cartList.map((s, index) => (
                            <Swiper 
                            key={index}
                            ref={(swiperInstance) => (swiperRefs.current[index] = swiperInstance)}
                            slidesPerView={'auto'}
                            spaceBetween={0}
                            pagination={{
                            clickable: true,
                            }}
                            className=""
                            >
                                <div className='w-full h-[75px] p-4 flex items-center justify-between gap-4 border-b-[0.3px] border-stone-100'>
                                    <div className="flex items-center gap-3 w-[75%]">
                                        {(!s.isAddOn)
                                        ?
                                        <img src={configData.azureurl + s.imagesyskey} className="w-[4rem] aspect-[1/1] rounded-md object-cover" alt="" />
                                        :   
                                        <div className="w-[4rem] h-[2rem] flex items-center justify-center">
                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.9808 20V11.9615M11.9615 15.9808H20M7.57692 1H2.46154C2.07391 1 1.70217 1.15398 1.42807 1.42807C1.15398 1.70217 1 2.07391 1 2.46154V7.57692C1 7.96455 1.15398 8.33629 1.42807 8.61039C1.70217 8.88448 2.07391 9.03846 2.46154 9.03846H7.57692C7.96455 9.03846 8.33629 8.88448 8.61039 8.61039C8.88448 8.33629 9.03846 7.96455 9.03846 7.57692V2.46154C9.03846 2.07391 8.88448 1.70217 8.61039 1.42807C8.33629 1.15398 7.96455 1 7.57692 1ZM7.57692 11.9615H2.46154C2.07391 11.9615 1.70217 12.1155 1.42807 12.3896C1.15398 12.6637 1 13.0355 1 13.4231V18.5385C1 18.9261 1.15398 19.2978 1.42807 19.5719C1.70217 19.846 2.07391 20 2.46154 20H7.57692C7.96455 20 8.33629 19.846 8.61039 19.5719C8.88448 19.2978 9.03846 18.9261 9.03846 18.5385V13.4231C9.03846 13.0355 8.88448 12.6637 8.61039 12.3896C8.33629 12.1155 7.96455 11.9615 7.57692 11.9615ZM18.5385 1H13.4231C13.0355 1 12.6637 1.15398 12.3896 1.42807C12.1155 1.70217 11.9615 2.07391 11.9615 2.46154V7.57692C11.9615 7.96455 12.1155 8.33629 12.3896 8.61039C12.6637 8.88448 13.0355 9.03846 13.4231 9.03846H18.5385C18.9261 9.03846 19.2978 8.88448 19.5719 8.61039C19.846 8.33629 20 7.96455 20 7.57692V2.46154C20 2.07391 19.846 1.70217 19.5719 1.42807C19.2978 1.15398 18.9261 1 18.5385 1Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        }
                                        <div className="flex-1">
                                            <h1 className="text-primary font-semibold text-[0.9rem] text-eclipsis-2 leading-[normal]">{(s.isAddOn) ? s.description : s.shortdescription}</h1>
                                            
                                            {(s.modifierList.length)
                                            ?
                                            <p className="text-eclipsis-1 text-[0.85rem] leading-[normal] text-stone-700 mt-1">
                                                {s.modifierList.filter((g) => g.checked).map((e, i, array) => (
                                                    <span key={e.mdfSK}>{e.mdfDesc}{(array[i + 1]) ? "," : ""}</span>
                                                ))}
                                            </p>
                                            :
                                            ''
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <p className="text-stone-700 leading-[1.1rem] text-[0.85rem]">{s.totalPrice.toLocaleString()} Ks</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <button onClick={() => handleDecreaseItemCount(index)} className={`w-[24px] h-[24px] text-[1rem] flex items-center justify-center rounded-full border-[1px] ${(s.cartCount == 1 || sendingOrder) ? 'border-stone-300 text-stone-300' : ' border-stone-700 text-stone-700'}`} disabled={s.cartCount == 1 || sendingOrder}><FiMinus /></button>
                                            <p className="text-stone-800 w-[24px] text-[0.9rem] text-center font-semibold">{s.cartCount}</p>
                                            <button onClick={() => handleIncreaseItemCount(index)} className={`w-[24px] h-[24px] text-[1rem] flex items-center justify-center rounded-full border-[1px] ${(sendingOrder) ? 'border-stone-300 text-stone-300' : ' border-stone-700 text-stone-700'}`} disabled={sendingOrder}><FiPlus /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-[80px] h-[75px]'>
                                    <button onClick={() => handleDeleteItem(index)} className={`w-full h-full bg-rose-600 flex items-center justify-center  ${sendingOrder ? 'sending' : ''}`}>
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 5.00001H4.16667M4.16667 5.00001H17.5M4.16667 5.00001V16.6667C4.16667 17.1087 4.34226 17.5326 4.65482 17.8452C4.96738 18.1577 5.39131 18.3333 5.83333 18.3333H14.1667C14.6087 18.3333 15.0326 18.1577 15.3452 17.8452C15.6577 17.5326 15.8333 17.1087 15.8333 16.6667V5.00001H4.16667ZM6.66667 5.00001V3.33334C6.66667 2.89131 6.84226 2.46739 7.15482 2.15483C7.46738 1.84227 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84227 12.8452 2.15483C13.1577 2.46739 13.3333 2.89131 13.3333 3.33334V5.00001" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </Swiper>
                        ))}
                    
                    </div>
                    </>
                :
                    <div className="w-full h-[100vh] flex items-center justify-center">
                        <div className="flex items-center justify-center flex-col w-[60%] text-center">
                            <img className="w-[199px] bg-none" src="assets/images/NoCartItem.svg" alt="" />
                            <h1 className="font-bold tracking-[-0.6px] text-[18px] leading-[24px] text-stone-800 my-4">Your cart is empty. Let’s start an order!</h1>
                            <button onClick={() => gotoRoute("/qr")} className={`text-[0.9rem] rounded-full px-7 py-[12px] font-[500] tracking-[0.6px] font-semibold  bg-category-active text-category-active ${sendingOrder ? 'sending' : ''}`}>Start Order</button>
                        </div>
                    </div>
                
            :
                <CartSkeleton />
            }
        </div>
    )
}

export default QrCheckout;