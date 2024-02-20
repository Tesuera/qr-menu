import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getNavigateRoute } from "../../services/ControllerService";
import {
  setCatList,
  setCurrentlyActive,
  setIsFetchingCat
} from '../../slices/qrmenu/CategorySlice';
import { setMenuList } from '../../slices/qrmenu/MenuSlice';
import { setBillNo, setCartList, setTableHeaderSyskey } from "../../slices/qrmenu/CartSlice";
import IndexSkeleton from '../../components/qrmenu/skeletons/IndexSkeleton';
import CategorySkeleton from "../../components/qrmenu/skeletons/CategorySkeleton";
import MenuSkeleton from "../../components/qrmenu/skeletons/MenuSkeleton";
import MenuList from '../../components/qrmenu/MenuList';
import { postRequest } from "../../services/MainService";
import { setLastScroll } from "../../slices/qrmenu/ConfigSlice";

const QrIndex = () => {

    // CONTEXT DATAS
    const isFetching = useSelector(state => state.qrconfig.fetchingJson);
    const isFetchingCat = useSelector(state => state.qrcategory.isFetchingCat);
    const tableHeaderSyskey = useSelector(state => state.qrcart.tableHeaderSyskey);
    const theme = useSelector(state => state.qrconfig.theme);
    const configData = useSelector(state => state.qrconfig.configData);
    const apiData = useSelector(state => state.qrconfig.apiData);
    const currentActive = useSelector(state => state.qrcategory.currentlyActive);
    const isAuthorized = useSelector(state => state.qrconfig.isAuthorized);
    const catList = useSelector(state => state.qrcategory.catList);
    const cartList = useSelector(state => state.qrcart.cartList);
    const menuList = useSelector(state => state.qrmenu.menuList);

    // REFERENCES
    const swiperRef = useRef(null);
    const activeCatRef = useRef(null);
    const tempMenuListRef = useRef(menuList);
    const isFetchingMenu = useRef(false);

    // STATES
    const [swiper, setSwiper] = useState(null);

    // HELPER HOOKS
    const dispatch = useDispatch();
    const navigate = useNavigate();


    // HOOK CALLS
    useEffect(() => {
        if (currentActive !== null && swiperRef.current) {
          swiperRef.current.swiper.slideTo(catList.findIndex(e => e.syskey === currentActive.syskey), 0);
        }
    
        return () => {
            tempMenuListRef.current = [];
        };
      }, []);

    useEffect(() => {
    if (!isFetching && configData != null && isAuthorized) {
        getCartFromSession();
        getBillDataFromSession();
    
        if (catList !== null) {
            fetchMenuIfNotExists(currentActive);
            return;
        }

        dispatch(setIsFetchingCat(true));

        // get categories
        postRequest(
            configData.apiurl + "getcat",
            {
                "binsyskey": "0",
                "domain": apiData.domain,
                "tablesyskey": apiData.tablesyskey,
                "locsyskey": apiData.locsyskey,
                "demo": "0"
            },
            {
            headers: {
                token: apiData.token,
                data: apiData.headerData
            }
            }).then(({ data: categoryData }) => {
            if (categoryData.status === "SUCCESS") {
                dispatch(setCatList(categoryData?.catlist));
                const firstCat = categoryData?.catlist[0];
    
                dispatch(setCurrentlyActive(firstCat));
                dispatch(setIsFetchingCat(false));
    
                fetchMenuIfNotExists(firstCat);
            } else {
                navigate('/qr/authorization-error');
            }
            });
    }
    }, [isFetching, configData, isAuthorized]);

    useEffect(() => {
        const swipePage = () => {
          const cur = catList[swiper.activeIndex];
          dispatch(setCurrentlyActive(cur));
    
          const activeButton = document.getElementById(`categoryButton${swiper.activeIndex}`);
          if (activeButton) {
            activeButton.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
              block: 'nearest'
            });
          }
    
          fetchMenuIfNotExists(cur);
        };
    
        if (swiper) {
          swiper.on('slideChange', swipePage);
        }
    
        return () => {
          if (swiper) {
            swiper.off('slideChange', swipePage);
          }
        };
    }, [swiper]);

    useEffect(() => {
        if(activeCatRef.current) {
            activeCatRef.current.scrollIntoView({
                behavior: 'instant',
                inline: 'center',
                block: 'nearest'
              })
        }
    }, [activeCatRef, catList])
    
    // BUSSINESS LOGICS

    // FETCH MENU ON CHANGE CATEGORY
    const fetchMenuIfNotExists = (category) => {
        if(category?.syskey) {
            isFetchingMenu.current = true;
            let catSyskey = category.syskey;
            if(!tempMenuListRef.current[catSyskey]){
                postRequest(
                    configData.apiurl + "getskubycat", 
                    {
                        "locsyskey" : apiData.locsyskey,
                        "binsyskey": "0",
                        "categorysk": catSyskey,
                        "domain" : apiData.domain,
                        "tablesyskey" : apiData.tablesyskey,
                        "demo": "0"
                    }, 
                    {
                        headers: {
                            token:  apiData.token,
                            data: apiData.headerData
                        }
                    }
                    ).then(({data: menuData}) => {
                    if(menuData.status == 'SUCCESS') {
                        let newMenuList = {...tempMenuListRef.current};
                        newMenuList[catSyskey] = menuData.skulist;

                        tempMenuListRef.current = newMenuList;
                        dispatch(setMenuList(newMenuList));

                        isFetchingMenu.current = false;
                    } else {
                        navigate('/qr/authorization-error');
                    }
                })
            }
        }
    }

    // SWIPE TO THE CATEGORY WHEN THE CATEGORY BUTTON GETS CLICKED
    const onClickCategoryBtn = (cat, index) => {
        window.scrollTo(0,0);
        if(swiperRef.current) swiperRef.current.swiper.slideTo(index, 0);
    }

    // GET CARTLIST FROM SESSION AND SET IT TO CART SLICE
    const getCartFromSession = () => {
        if(sessionStorage.getItem('qrcart')) {
            dispatch(setCartList(JSON.parse(sessionStorage.getItem('qrcart'))))
        }
    }

    // GET BILLNO AND BILLSYSKEY FROM SESSION AND SET IT TO BILL SLICE
    const getBillDataFromSession = () => {
        let billNo = sessionStorage.getItem("billNo");
        let headerSyskey = sessionStorage.getItem("headerSyskey")

        if(billNo && headerSyskey) {
            dispatch(setTableHeaderSyskey(parseInt(headerSyskey)));
            dispatch(setBillNo(parseInt(billNo)));
        }
    }

    // NAVIGATE TO ANYWHERE WITH QUERYPARAMS
    const gotoBill = () => {
        dispatch(setLastScroll(0));
        navigate(getNavigateRoute("bills", apiData));
        window.scrollTo(0,0);
    }

    const gotoCart = () => {
        dispatch(setLastScroll(0));
        navigate(getNavigateRoute("checkout", apiData));
        window.scrollTo(0,0);
    }

    return (
        <div>
            {(isFetching)
            ?
            <IndexSkeleton />
            :
             <>
                {/* header bar */}
                <div className="fixed top-0 left-0 w-full h-[50px] flex items-center justify-between px-4 pt-2 z-50 bg-white">
                    <img src="assets/images/Logo.svg" className="bg-none h-[28px]" alt="" />

                    <h1 className="text-[0.9rem] font-bold tracking-[-0.2px] text-stone-800 mt-1 whitespace-nowrap absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">Table - T12</h1>

                    <div className="relative">
                        {(tableHeaderSyskey)
                        ?
                        <button onClick={gotoBill} className={`flex items-center justify-center gap-1 rounded-full`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-primary" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.755 2H7.24502C6.08614 2 5.50671 2 5.03939 2.16261C4.15322 2.47096 3.45748 3.18719 3.15795 4.09946C3 4.58055 3 5.17705 3 6.37006V20.3742C3 21.2324 3.985 21.6878 4.6081 21.1176C4.97417 20.7826 5.52583 20.7826 5.8919 21.1176L6.375 21.5597C7.01659 22.1468 7.98341 22.1468 8.625 21.5597C9.26659 20.9726 10.2334 20.9726 10.875 21.5597C11.5166 22.1468 12.4834 22.1468 13.125 21.5597C13.7666 20.9726 14.7334 20.9726 15.375 21.5597C16.0166 22.1468 16.9834 22.1468 17.625 21.5597L18.1081 21.1176C18.4742 20.7826 19.0258 20.7826 19.3919 21.1176C20.015 21.6878 21 21.2324 21 20.3742V6.37006C21 5.17705 21 4.58055 20.842 4.09946C20.5425 3.18719 19.8468 2.47096 18.9606 2.16261C18.4933 2 17.9139 2 16.755 2Z" className="stroke-primary" strokeWidth="1.5"/>
                                <path d="M10.5 11L17 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M7 11H7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M7 7.5H7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M7 14.5H7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M10.5 7.5H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M10.5 14.5H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                        :
                        <button onClick={gotoBill} className="flex items-center justify-center gap-1 rounded-full opacity-50">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.755 2H7.24502C6.08614 2 5.50671 2 5.03939 2.16261C4.15322 2.47096 3.45748 3.18719 3.15795 4.09946C3 4.58055 3 5.17705 3 6.37006V20.3742C3 21.2324 3.985 21.6878 4.6081 21.1176C4.97417 20.7826 5.52583 20.7826 5.8919 21.1176L6.375 21.5597C7.01659 22.1468 7.98341 22.1468 8.625 21.5597C9.26659 20.9726 10.2334 20.9726 10.875 21.5597C11.5166 22.1468 12.4834 22.1468 13.125 21.5597C13.7666 20.9726 14.7334 20.9726 15.375 21.5597C16.0166 22.1468 16.9834 22.1468 17.625 21.5597L18.1081 21.1176C18.4742 20.7826 19.0258 20.7826 19.3919 21.1176C20.015 21.6878 21 21.2324 21 20.3742V6.37006C21 5.17705 21 4.58055 20.842 4.09946C20.5425 3.18719 19.8468 2.47096 18.9606 2.16261C18.4933 2 17.9139 2 16.755 2Z" stroke="#1D1F1F" strokeWidth="1.5"/>
                                <path d="M10.5 11L17 11" stroke="#1D1F1F" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M7 11H7.5" stroke="#1D1F1F" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M7 7.5H7.5" stroke="#1D1F1F" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M7 14.5H7.5" stroke="#1D1F1F" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M10.5 7.5H17" stroke="#1D1F1F" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M10.5 14.5H17" stroke="#1D1F1F" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                        }
                    </div>
                </div>

                {/* viewCart */}
                {cartList.length 
                ?
                <div className="card-model w-full px-4 pb-[8px] fixed bottom-0 left-0 h-[83px] z-40 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div>
                            <p className="text-[12px] text-stone-800 leading-[11px]">Total</p>
                            <p className="text-[1.3rem] tracking-[-0.4px] text-stone-800 font-semibold">{cartList.reduce((p, c) => p + c.totalPrice,0).toLocaleString()} Ks</p>
                        </div>
                    </div>

                    <div className="relative">
                        <p className="text-[11px] tracking-[-0.2px] font-semibold absolute right-[-8px] top-[-8px] rounded-full w-[1.3rem] aspect-[1/1] flex items-center justify-center bg-red-500 text-white">{cartList.reduce((p, c) => p + c.cartCount ,0)}</p>
                        <button onClick={gotoCart} className="text-[0.9rem] rounded-lg px-7 py-[12px] font-[500] tracking-[0.3px] menu-button font-semibold">View Cart</button>
                    </div>
                </div>
                :
                    ''
                }

                <div className="py-[50px]">
                    {(!isFetching && isFetchingCat)
                    ?
                    <>
                        <CategorySkeleton />
                        <div className="p-2">
                            <MenuSkeleton />
                        </div>
                    </>
                    :
                    (catList?.length)
                    ?
                    <>
                    <div className={`sticky top-[50px] w-full overflow-x-auto scrollbar-hide px-4 z-40 bg-white ${theme == 1 ? 'h-[54px]' : 'h-[94px]'}`}>
                        <div className="flex gap-[8px] items-center w-max h-full">
                            {(theme == 1)
                            ?
                                catList.map((clickedCat, index) => (
                                    (clickedCat.syskey == currentActive.syskey)
                                    ?
                                    <button ref={activeCatRef} key={clickedCat.syskey} className="px-5 text-[14px] h-[40px] rounded-lg border-[1px] border-category font-[500] bg-category-active text-category-active">{clickedCat.description}</button>
                                    :
                                    <button onClick={() => onClickCategoryBtn(clickedCat, index)} key={clickedCat.syskey} className="px-5 text-[14px] h-[40px] bg-none rounded-lg border-[1px] border-category font-[500] text-category" id={`categoryButton${index}`}>{clickedCat.description}</button>
                                ))
                            :
                                catList.map((clickedCat, index) => (
                                    (clickedCat.syskey == currentActive.syskey)
                                    ?
                                    <button ref={activeCatRef} onClick={() => onClickCategoryBtn(clickedCat, index)} key={clickedCat.syskey} className="flex flex-col items-center gap-[6px] w-[78px] h-[80px] px-2 pt-2 pb-1 rounded-lg bg-category-active text-category-active" id={`categoryButton${index}`}>
                                        <img className="w-[40px] h-[40px] rounded-full" src={configData?.azureurl + clickedCat.imageSyskey} alt="" />
                                        <p className="text-center text-[0.75rem] text-stone-800 text-eclipsis-1">{clickedCat.description}</p>
                                    </button>
                                    :
                                    <button onClick={() => onClickCategoryBtn(clickedCat, index)} key={clickedCat.syskey} className="flex flex-col items-center gap-[6px] w-[78px] h-[80px] px-2 pt-2 pb-1 rounded-lg bg-stone-50 text_category" id={`categoryButton${index}`}>
                                        <img className="w-[40px] h-[40px] rounded-full" src={configData?.azureurl + clickedCat.imageSyskey} alt="" />
                                        <p className="text-center text-[0.75rem] text-stone-800 text-eclipsis-1">{clickedCat.description}</p>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="p-2">
                        <Swiper 
                        ref={swiperRef}
                        className=""
                        onSwiper={setSwiper}
                        autoHeight={true}
                        >
                            {catList.map(cat => <SwiperSlide key={cat.syskey} className='pb-4 flex items-stretch flex-wrap h-max'><MenuList category={cat.syskey} /></SwiperSlide>)}
                        </Swiper>
                    </div>
                    </>
                    :
                    ''
                    }
                </div>
             </>
            }
        </div>
        
    );
}

export default QrIndex;