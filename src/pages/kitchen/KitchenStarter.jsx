import { useEffect } from "react";
import { getRequest, postRequest } from "../../services/MainService";
import { setAuthorized, setConfigData, setInitializing, setParamsData } from "../../slices/kitchen/ConfigSlice";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

const KitchenStarter = () => {

  const [queryParams, setQueryParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let url = "assets/config/config.json";
    getRequest(url).then(({data}) => {
      dispatch(setConfigData({
        apiurl: data.apiurl,
        columnperview: data.columnperview
      }));
      document.documentElement.style.setProperty("--var-column-width", `${100/ data?.columnperview}vw`)

      dispatch(setInitializing(false));
      if(isCorrectUrl()) {

        let paramsData = outputParamsData();

        url = data?.apiurl + "checktoken"; 
        postRequest(url, {
          "domain": paramsData.eid,
          "tablesyskey": paramsData.tid,
          "locsyskey": paramsData.lid
        }, {
          headers: {
            token: paramsData.sid,
            data: paramsData.headerData
          }
        }).then(({data: checkTokenData}) => {
          if(checkTokenData !== "VALID TOKEN") navigate("authorization-error");
          
          dispatch(setParamsData(paramsData));
          dispatch(setAuthorized(true));
        })
      } else navigate("authorization-error");
    })
  }, [])

  const isCorrectUrl = () => {
    return queryParams.get("eid") != null && queryParams.get("tid") != null && queryParams.get("lid") != null && queryParams.get("sid") != null && queryParams.get("serial") != null;
  }

  const outputParamsData = () => {
    let eid = queryParams.get("eid");
    let tid = queryParams.get("tid");
    let lid = queryParams.get("lid");
    let sid = queryParams.get("sid");
    let serial = queryParams.get("serial");
    let headerData = eid + "|" + tid + "|" + lid + "|" + serial;

    return {
      eid,
      tid,
      lid,
      sid,
      serial,
      headerData
    };
  }

  return (
    <Outlet />
  )
}

export default KitchenStarter