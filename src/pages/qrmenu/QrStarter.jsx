import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { getRequest, postRequest } from "../../services/MainService";
import { setApiData, setConfigData, setFetchingJson, setIsAuthorized, setTheme } from "../../slices/qrmenu/ConfigSlice";

const QrStarter = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useSearchParams();

  useEffect(() => {
    startUp();
  }, []);

  // APP STARTING POINT
  const startUp = async () => {
    let {data} = await getRequest("/qrmenu/assets/config/config.json")
    dispatch(setConfigData({
      apiurl: data.apiurl,
      azureurl: data.azureurl,
      websocketurl: data.websocketurl
    }));

    if(!isCorrectUrl()) navigate('/authorization-error');
    
    let paramsData = outputParamsData();
        
    if(data?.themes[paramsData.domain]) {
      // SET THEME AND COLORS FROM CONFIG FILE
      dispatch(setTheme(data?.themes[paramsData.domain]?.theme));
      setRootStyles(data?.themes[paramsData.domain]);
    }

    // CALL CHECK TOKEN API
    postRequest(
      data.apiurl + "checktoken", 
      {
        "domain": paramsData.domain,
        "tablesyskey": paramsData.tablesyskey,
        "locsyskey": paramsData.locsyskey
      },
      {
        headers: {
          token: paramsData.token,
          data: paramsData.headerData
        }
      }
      ).then(({data: checkTokenData}) => {
        if(checkTokenData !== "VALID TOKEN") navigate('/authorization-error');
        dispatch(setApiData(paramsData))

        dispatch(setIsAuthorized(true));
        dispatch(setFetchingJson(false));
      })
  }

  // CHECK IF THE URL HAS CORRECT QUERY PARAMS
  const isCorrectUrl = () => {
    return queryParams.get("eid"), queryParams.get("tid"), queryParams.get("lid"), queryParams.get("sid"), queryParams.get("serial") != null;
  }

  // SETTING ROOT STYLES
  const setRootStyles = (configStyles) => {
    document.documentElement.style.setProperty("--primary", configStyles.primary)
    document.documentElement.style.setProperty("--bg-category-active", configStyles.bg_category_active)
    document.documentElement.style.setProperty("--text-category-active", configStyles.text_category_active)
    document.documentElement.style.setProperty("--border-category", configStyles.border_category)
    document.documentElement.style.setProperty("--text-category", configStyles.text_category)
    document.documentElement.style.setProperty("--item-menu-button-font-color", configStyles.item_menu_button_font_color)
    document.documentElement.style.setProperty("--item-menu-button-background-color", configStyles.item_menu_button_background_color)
    document.documentElement.style.setProperty("--checkbox-fill", configStyles.checkbox_fill)
    document.documentElement.style.setProperty("--checkbox-mark-fill", configStyles.checkbox_mark_fill)
  }

  // GET QUERY PARAMS DATA
  const outputParamsData = () => {
    let eid = queryParams.get("eid");
    let tid = queryParams.get("tid");
    let lid = queryParams.get("lid");
    let sid = queryParams.get("sid");
    let serial = queryParams.get("serial");
    let headerData = eid + "|" + tid + "|" + lid + "|" + serial;

    return {
      domain: eid,
      tablesyskey: tid,
      locsyskey: lid,
      token: sid,
      serial: serial,
      headerData: headerData
    };
  }

  return <Outlet />;
}

export default QrStarter