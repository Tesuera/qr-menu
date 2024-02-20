export function generateSyskey() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year ='' + d.getFullYear(),
        hours ='' + d.getHours(),
        minutes ='' + d.getMinutes();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    if (hours.length < 2) 
        hours = '0' + hours;
    if (minutes.length < 2) 
        minutes = '0' + minutes;

    let randomNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1) + 1000000)
    return [year, month, day, hours, minutes, randomNumber].join('');
}

export function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}${month}${day}`;
}

export const APITOUI = (time) => {
    let hour = time.substr(0, 2);
    let minute = time.substr(2, 2);
    let seconds = time.substr(4, 2);

    time = `${hour}:${minute}:${seconds}`;
    return convertTo12HourFormat(time);
}

function convertTo12HourFormat(time24) {
    var timeComponents = time24.split(":");
    var hours = parseInt(timeComponents[0]);
    var minutes = timeComponents[1];
    var seconds = timeComponents[2];
  
    var period = hours < 12 ? "AM" : "PM";
  
    hours = hours % 12 || 12;
  
    minutes = minutes.length === 1 ? "0" + minutes : minutes;
    seconds = seconds.length === 1 ? "0" + seconds : seconds;
  
    var time12 = hours + ":" + minutes + ":" + seconds + " " + period;
  
    return time12;
}

export const convertToSendOrderDetailData = (data, uniqueKey) => {
    let modifierList = data.modifierList.filter(e => e.checked).map(s => ({mdfDesc: s.mdfDesc, mdfSK: s.mdfSK}));

    return {
        syskey: "0",
        ref1: "0",
        ref2: "0",
        t1: data.code, // stockcode
        t2: data.code, // stockcode
        t3: data.description, // stock desc
        t4: "MMK",
        t6: "MMK",
        n1: data.syskey + "", // stocksyskey
        n2: "0",
        n3: "0",
        n4: "0", // promotion syskey
        n6: data.cartCount, //qty
        n7: data.uomSyskey, // stkuom junction syskey
        n8: data.cartCount + "", // level qty
        n11: 0, //cost
        n13: 0, //cost
        n14: data.totalPrice, // saleprice
        n18: data.totalPrice, // levelprice
        n19: 0, //unit discount
        n20: 0, // lineTotaldiscamount + distributedDiscount
        n22: 0, // distributedDiscount
        n23: 0, // taxamount
        n24: "0",
        n26: "0",
        n28: "0",
        n29: "0",
        n31: 0, // itemtype
        n34: data.totalPrice, // totalamount - linetotaldiscountamount
        n36: 1,
        n37: data.totalPrice,// levelprice
        n38: data.totalPrice, // totalamount - linetotaldiscountamount(before tax amount)
        t7: "*",
        n44:"1",
        n45: data.n45,
        n46: 0, // discount pcent
        t9: "*",
        n48: 0, // cost
        n49: data.totalPrice,// price
        t10: data.uomDesc, // uom
        n50: "0", // taxPcent
        brandSyskey: data.brandSyskey,
        categorySyskey: data.categorysyskey,
        groupSyskey: data.groupSyskey,
        tmpDetailSK: "0",
        modifier: modifierList,
        t12: (modifierList.length) ? modifierList.map(e => e.mdfDesc).join(",") : "",
        orgQty: 0,
        projectCode: data.projectCode,
        n53: 0, //cook qty
        n54: 1, // done qty
        n55: 0,//serve qty
        ref6: "0",
        setmenuItem: [],
        itemcheckbox: 0,
        n58: 0, // hold
        subcategorySyskey: "0",
        n60: 0, // service pcent
        n61: 0, // service amount
        n62: "0", // discount sk
        n43: "0",
        mdfstk: 0,
        t17: data.uomDesc, // uom description
        n64: 0, // takeaway
        accSK: "0",
        t18: "",
        uniqueKey
    }
}

export const addToSessionStorage = (list) => {
    if(sessionStorage.getItem("qrcart")) {
        const tempList = JSON.parse(sessionStorage.getItem("qrcart"));
        sessionStorage.setItem("qrcart", JSON.stringify([...tempList, ...list]));
    } else {
        sessionStorage.setItem("qrcart", JSON.stringify([...list]));
    }
}

export const getNavigateRoute = (path, apiData) => {
    const queryParams = new URLSearchParams({
        eid: apiData.domain,
        tid: apiData.tablesyskey,
        lid: apiData.locsyskey,
        sid: apiData.token,
        serial: apiData.serial
    }).toString();

    return `${path}?${queryParams}`;
}