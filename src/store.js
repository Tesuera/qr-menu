import { configureStore } from "@reduxjs/toolkit";
import QrCategoryReducer from "./slices/qrmenu/CategorySlice";
import QrMenuReducer from "./slices/qrmenu/MenuSlice";
import QrConfigReducer from "./slices/qrmenu/ConfigSlice";
import QrCartReducer from "./slices/qrmenu/CartSlice";

import KitchenConfigReducer from "./slices/kitchen/ConfigSlice";
import KitchenOrderReducer from "./slices/kitchen/OrderSlice";

export default configureStore ({
    reducer: {

        //QR SLICES
        qrcategory: QrCategoryReducer,
        qrmenu: QrMenuReducer,
        qrconfig: QrConfigReducer,
        qrcart: QrCartReducer,

        // KITCHEN SLICES
        kitchenconfig: KitchenConfigReducer,
        kitchenorder: KitchenOrderReducer
    }
})