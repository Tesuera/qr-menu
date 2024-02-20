import {FiPlus} from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import MenuSkeleton from "./skeletons/MenuSkeleton";
import { setDetailMenu } from "../../slices/qrmenu/MenuSlice";
import { useNavigate } from "react-router-dom";
import { generateSyskey, getNavigateRoute } from "../../services/ControllerService";
import { useEffect, useRef, useState } from "react";
import { addToCart } from "../../slices/qrmenu/CartSlice";
import { addToSessionStorage } from "../../services/ControllerService";
import MenuItem from "./MenuItem";
import { setLastScroll } from "../../slices/qrmenu/ConfigSlice";

const MenuList = ({category}) => {

    const activeSliderRef = useRef(null);

    const [currentMenu, setCurrentMenu] = useState([])

    const menuList = useSelector(state => state.qrmenu.menuList);
    const configData = useSelector(state => state.qrconfig.configData);
    const apiData = useSelector(state => state.qrconfig.apiData);
    const lastScroll = useSelector(state => state.qrconfig.lastScroll);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    useEffect(() => {
        if(menuList[category]) {
            setCurrentMenu(menuList[category]);
        }
    }, [category, menuList])

    useEffect(() => {
        if(activeSliderRef.current) {
            window.scrollTo(0, lastScroll);
        }
    }, [currentMenu])

    const handleShowItemDetail = (menu) => {
        if(menu != null) {
            let projectCode = generateSyskey();

            var tempProps = {...menu,
                modifierList: menu.modifierList.map(e => ({...e, checked: false})),
                stockmodifierList: menu.stockmodifierList.map(e => ({
                    brandSyskey: "0",
                    cartCount: 0, 
                    categorysyskey: "0",
                    code: e.t2,
                    description: e.mdfDesc,
                    groupSyskey: "0",
                    imagesyskey: "0",
                    isAddOn: true,
                    itemType: 0,
                    modifierList: [], 
                    price: e.price,
                    projectCode: "0",
                    shortdescription: "",
                    stkuomoperator : "*",
                    stockmodifierList: [],
                    syskey: e.mdfSK,
                    totalPrice: 0, 
                    uomDesc: "",
                    uomSyskey: "0",
                    uomoperator: "",
                    checked: false, 
                    n45: projectCode, 
                })),

                    cartCount: 0,
                    totalPrice: 0,
                    projectCode: projectCode,
                    n45: "0",
                    isAddOn: false,
                    checked: false, 
            };
            dispatch(setDetailMenu(tempProps));
            
            dispatch(setLastScroll(window.scrollY));
            navigate(getNavigateRoute("details", apiData));
            window.scrollTo(0,0);
        }
    }

    const handleAddToCart = (menu) => {
        if(menu != null) {
            let projectCode = generateSyskey();

            var tempProps = {...menu,
                modifierList: menu.modifierList.map(e => ({...e, checked: false})),
                stockmodifierList: menu.stockmodifierList.map(e => ({
                    brandSyskey: "0",
                    cartCount: 0, 
                    categorysyskey: "0",
                    code: e.t2,
                    description: e.mdfDesc,
                    groupSyskey: "0",
                    imagesyskey: "0",
                    isAddOn: true,
                    itemType: 0,
                    modifierList: [], 
                    price: e.price,
                    projectCode: "0",
                    shortdescription: "",
                    stkuomoperator : "*",
                    stockmodifierList: [],
                    syskey: e.mdfSK,
                    totalPrice: 0, 
                    uomDesc: "",
                    uomSyskey: "0",
                    uomoperator: "",
                    checked: false, 
                    n45: projectCode, 
                })),

                    cartCount: 1,
                    totalPrice: menu.price,
                    projectCode: projectCode,
                    n45: "0",
                    isAddOn: false,
                    checked: false, 
            };  

            dispatch(addToCart([tempProps]));
            addToSessionStorage([tempProps]);
        }
    }

    return (
        <>
            {(currentMenu.length) 
            ?
            <div ref={activeSliderRef} className="pb-4 flex items-stretch flex-wrap">
                {currentMenu.length 
                ?
                    currentMenu.map(menu => {
                    let soldout = menu?.soldout === 1;
                    return(
                        <MenuItem 
                            key={menu.syskey} 
                            configData={configData}
                            menu={menu}
                            soldout={soldout}
                            handleAddToCart={handleAddToCart}
                            handleShowItemDetail={handleShowItemDetail}
                        />
                    )
                    })
                :
                <div className="py-8">
                    <p className="w-full text-center">No Menus Yet!</p>
                </div>
                }
            
            </div>
            :
            <MenuSkeleton/>
            }
           
        </>
    )
}

export default MenuList