import { useEffect } from "react";
import { postRequest } from "../../services/MainService";
import { setFetchingOrders, setOrderList } from "../../slices/kitchen/OrderSlice";
import { formatDateToYYYYMMDD } from "../../services/ControllerService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import KitchenLoading from "../../components/kitchen/KitchenLoading";
import KitchenBody from "../../components/kitchen/KitchenBody";
import KitchenFooter from "../../components/kitchen/KitchenFooter";

const KitchenIndex = () => {
  
    const initializing = useSelector(state => state.kitchenconfig.initializing);
    const isAuthorized = useSelector(state => state.kitchenconfig.authorized);
    const isFetchingOrders = useSelector(state => state.kitchenorder.fetchingOrders);
    const configData = useSelector(state => state.kitchenconfig.configData);
    const paramsData = useSelector(state => state.kitchenconfig.paramsData);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        if(!initializing && isAuthorized) {

            dispatch(setFetchingOrders(true));
            let url = configData.apiurl + "getKitchenItems";
            let today = formatDateToYYYYMMDD(new Date());
            let headers = {
                token: paramsData.sid, 
                data: paramsData.headerData
            };

            // GET KITCHEN ITEMS (ORDERS)
            postRequest(url, {
                "domain": paramsData.eid,
                "demo": "0",
                "date": today,
                "status": "",
                "tablesyskey": ""
            }, {headers}).then(({data : kitchenItemsData}) => {
                if(kitchenItemsData?.status == "SUCCESS") {
                    dispatch(setOrderList(kitchenItemsData?.kitchenData));
                    (dispatch(setFetchingOrders(false)));
                } else navigate("authorization-error")
            })
        }
    }, [initializing, isAuthorized])

    return (
        <>
        {initializing || !isAuthorized || isFetchingOrders
        ?
        <KitchenLoading />
        :
        <section className='w-full h-[100vh] bg-slate-50 flex flex-col'>
            <KitchenBody />
            <KitchenFooter />
        </section>
        }
        </>
    )
}

export default KitchenIndex