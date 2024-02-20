import { useDispatch, useSelector } from "react-redux";
import { setDetailMenu } from "../../slices/qrmenu/MenuSlice";
import { addToCart } from "../../slices/qrmenu/CartSlice";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";
import { addToSessionStorage, getNavigateRoute } from "../../services/ControllerService";
import ItemDetailSkeleton from "../../components/qrmenu/skeletons/ItemDetailSkeleton";

const QrItemDetail = () => {

    const detailMenu = useSelector(state => state.qrmenu.detailMenu);
    const configData = useSelector(state => state.qrconfig.configData);
    const apiData = useSelector(state => state.qrconfig.apiData);
    const isFetching = useSelector(state => state.qrconfig.fetchingJson);
    const isAuthorized = useSelector(state => state.qrconfig.isAuthorized);

    const [addToCount, setAddToCount] = useState(1);
    const [showFullImg, setShowFullImg] = useState(false);

    const detailScroll = useRef();
    const navDetail = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        
        if(!isFetching && configData != null && isAuthorized) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            dispatch(setDetailMenu({}));
        }
    }, [isFetching, configData, isAuthorized])

    // BUSSINESS LOGICS
    const handleScroll = () => {
        let ratioHeight = parseInt((navDetail.current.clientWidth / 16) * 8 - 56);
        if(parseInt(window.scrollY) < ratioHeight) {
            let cal = (window.scrollY * 100) / ratioHeight;
            navDetail.current.style.backgroundColor = `rgb(255 255 255 / ${cal}%)`
        } else if (parseInt(window.scrollY) > ratioHeight) {
            navDetail.current.style.backgroundColor = `rgb(255 255 255)`
        }
    } 

    const chooseInstructions = (selectedModifier) => {
        dispatch(setDetailMenu({
            ...detailMenu,
            modifierList: detailMenu.modifierList.map(modifier => 
                modifier.mdfSK === selectedModifier.mdfSK 
                    ? {...modifier, checked: !modifier.checked} 
                    : modifier
            )
        }));
    };

    const handleAddOnsItem = (selectedItem) => {
        dispatch(setDetailMenu({
            ...detailMenu,
            stockmodifierList: detailMenu.stockmodifierList.map(item => 
                item.syskey === selectedItem.syskey 
                    ? {...item, checked: true, cartCount: 1, totalPrice: item.price} 
                    : item
            )
        }));
    };

    const handleDecreaseAddOn = (selectedItem) => {
        dispatch(setDetailMenu({
            ...detailMenu,
            stockmodifierList: detailMenu.stockmodifierList.map(item => 
                item.syskey === selectedItem.syskey 
                    ? {...item, cartCount: Math.max(0, selectedItem.cartCount - 1), 
                        checked: selectedItem.cartCount > 1, 
                        totalPrice: selectedItem.cartCount > 1 ? item.price * (selectedItem.cartCount - 1) : 0} 
                    : item
            )
        }));
    };

    const handleIncreaseAddOn = (selectedItem) => {
        dispatch(setDetailMenu({
            ...detailMenu,
            stockmodifierList: detailMenu.stockmodifierList.map(item => 
                item.syskey === selectedItem.syskey 
                    ? {...item, cartCount: selectedItem.cartCount + 1, totalPrice: item.price * (selectedItem.cartCount + 1)} 
                    : item
            )
        }));
    };

    const handleAddToCart = () => {
        const tempCartItem = {
            ...detailMenu,
            cartCount: addToCount,
            totalPrice: detailMenu.price * addToCount
        };
    
        const tempAddItemList = [
            tempCartItem,
            ...tempCartItem.stockmodifierList.filter(item => item.checked)
        ];
    
        dispatch(addToCart(tempAddItemList));
        addToSessionStorage(tempAddItemList);
        gotoRoute("/qr");
    };

    const gotoRoute = (path) => {
        navigate(getNavigateRoute(path, apiData));
    }

    return (
        <div className="bg-white">
            {(showFullImg)
            ?
            <div className="w-full h-full fixed z-50">
                <div className="w-[90%] max-w-[280px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-4 rounded-lg">
                    <button
                        onClick={() => setShowFullImg(false)}
                        className="p-2 absolute top-[4px] right-[4px] rounded-full cursor-pointer menu-button"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <img className="w-full rounded-md" src={configData?.azureurl + detailMenu?.imagesyskey + ""} alt="" />
                    <p className="w-full mt-2 text-stone-800 font-[500]">{detailMenu.description}</p>
                </div>
                <div onClick={() => setShowFullImg(false)} className="w-full h-full img-overley"></div>
            </div>
            :
            ""
            }
          
            {(!isFetching && isAuthorized)
            ?
            <>
                <div ref={navDetail} className='fixed top-[0px] left-[0px] h-[56px] flex items-center px-4 z-40 w-full'>
                    <button onClick={() => gotoRoute("/qr")} className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-white text-primary">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div ref={detailScroll} className="mb-[84px]">
                    <div className="w-full aspect-[16/8] relative">
                        <img onClick={() => setShowFullImg(true)} loading='lazy' src={configData?.azureurl + detailMenu?.imagesyskey + ""} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="px-4 w-full bg-white pt-4">
                        <h1 className="text-[1rem] leading-[normal] text-stone-900 font-semibold mb-2">{detailMenu.description}</h1>
                        <p className="text-[1rem] text-primary">{detailMenu?.price?.toLocaleString()} Ks</p>
                    </div>
                    {(detailMenu?.modifierList?.length) 
                    ?
                    <>
                        <div className='w-[90%] h-[1px] my-3 bg-stone-200 rounded-full mx-auto'></div>
                        <div className='bg-white'>
                            {detailMenu?.modifierList?.map(e => (
                                <label key={e.mdfSK} onClick={() => chooseInstructions(e)} htmlFor="" className='w-full px-4 py-2 flex items-center justify-between gap-8'>
                                    <span className='text-[14px] font-[600] text-eclipsis-1'>{e.mdfDesc}</span>
                                    {e.checked ?
                                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_563_1969)">
                                        <path d="M6.75 12.75L9.75 15.75L13.5 12L17.25 8.25" className="fill-check"/>
                                        <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3C5 3 11.7042 3 16 3" className="fill-check"/>
                                        <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16H19C19.3944 3 20.0223 3.14003 20.4692 3.58579C20.7777 3.89342 21 4.34667 21 5V12Z" className="fill-check"/>
                                        <path d="M6.75 12.75L9.75 15.75L13.5 12L17.25 8.25M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3M21 12C21 10.3333 21 6.6 21 5M21 12V5M5 3C5 3 11.7042 3 16 3M5 3H16M16 3C17.1716 3 19 3 19 3M16 3H19M19 3C19.3944 3 20.0223 3.14003 20.4692 3.58579C20.7777 3.89342 21 4.34667 21 5" className="fill-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <g filter="url(#filter0_d_563_1969)">
                                        <path d="M6.75 12.75L9.75 15.75L13.5 12L17.25 8.25" className="fill-check"/>
                                        <path d="M6.75 12.75L9.75 15.75L13.5 12L17.25 8.25" className="stroke-check" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </g>
                                        </g>
                                        <defs>
                                        <filter id="filter0_d_563_1969" x="1.75" y="7.25" width="20.5" height="17.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="4"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                        <feComposite in2="hardAlpha" operator="out"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_563_1969"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_563_1969" result="shape"/>
                                        </filter>
                                        <clipPath id="clip0_563_1969">
                                        <rect width="24" height="24" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    }
                                </label>
                            ))}
                        </div>
                    </>
                    : 
                    ''}

                    {(detailMenu?.stockmodifierList?.length) 
                    ?
                    <>
                        <div className='w-[90%] h-[1px] my-3 bg-stone-200 rounded-full mx-auto'></div>
                        <div className='bg-white'>
                            <h1 className='px-4 font-[700] text-stone-800 text-[16px]'>Add-On</h1>
                            {detailMenu?.stockmodifierList?.map(e => (
                                <label key={e.syskey} htmlFor="" className='w-full px-4 py-1 flex items-start justify-between gap-8'>
                                    <div className='w-[50%]'>
                                        <p className='text-[14px] font-[600] mb-1'>{e.description}</p>
                                        <p className='text-[14px] text-primary'>{e.price.toLocaleString()} Ks</p>
                                    </div>
                                    {e.checked 
                                    ?
                                    <div className="flex items-center gap-2">
                                        <button onClick={() =>handleDecreaseAddOn(e)} className="text-stone-500 w-[28px] h-[28px] text-[1rem] flex items-center justify-center rounded-full border-[1px] border-stone-500"><FiMinus /></button>
                                        <p className="text-stone-800 w-[28px] font-[500] text-[16px] text-center">{e.cartCount}</p>
                                        <button onClick={() =>handleIncreaseAddOn(e)} className="text-stone-500 w-[28px] h-[28px] text-[1rem] flex items-center justify-center rounded-full border-[1px] border-stone-500"><FiPlus /></button>
                                    </div>
                                    :
                                    <button onClick={() => handleAddOnsItem(e)} className="text-stone-500 w-[28px] h-[28px] text-[1rem] flex items-center justify-center rounded-full border-[1px] border-stone-500"><FiPlus /></button>
                                    }
                                </label>
                            ))}
                        </div>
                    </>
                    : 
                    ''}

                    <div className='w-[90%] h-[1px] my-3 bg-stone-200 rounded-full mx-auto'></div>
                    <div className="px-4 bg-white py-2">
                        {/* <h3 className="font-[700] text-stone-800 text-[16px] mb-1">Note</h3> */}
                        <textarea className="w-full rounded-xl border-2 border-stone-300 focus:outline-0 focus:border-green-600 p-3 text-[0.9rem]" rows="3" placeholder="Let us know if you have any special request."></textarea>
                    </div>
                </div>

                <div className="fixed  bottom-0 left-0 w-full h-[83px] border-t-2 border-stone-200 px-4 flex items-center justify-between bg-white pb-4 pt-2">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setAddToCount(prev => (prev - 1 == 0) ? 1 : prev - 1)} className="text-primary w-[44px] h-[44px] text-[1rem] flex items-center justify-center rounded-full border-[1px] border-primary"><FiMinus /></button>
                        <p className="text-stone-800 font-semibold w-[32px] text-center text-[1.1rem]">{addToCount}</p>
                        <button onClick={() => setAddToCount(prev => prev + 1)} className="text-primary w-[44px] h-[44px] text-[1rem] flex items-center justify-center rounded-full border-[1px] border-primary"><FiPlus /></button>
                    </div>

                    <button onClick={handleAddToCart} className="text-[0.9rem] rounded-lg px-7 py-[12px] font-[500] tracking-[0.3px] menu-button font-semibold">Add to Cart</button>
                </div>
            </>
            :
                <ItemDetailSkeleton />
            }
        </div>
    )
}

export default QrItemDetail