import React from "react";
import { FiPlus } from "react-icons/fi";

const MenuItem = ({menu, soldout, handleShowItemDetail, handleAddToCart, configData}) => {
    return (
        <div className="w-[50%] mb-4 px-2">
            <div className="w-full h-full">
                <div className="item-img mb-[4px] relative">
                    <img
                        onClick={() =>
                            soldout ? null : handleShowItemDetail(menu)
                        }
                        className={`h-full w-full object-cover rounded-lg`}
                        src={configData.azureurl + menu.imagesyskey}
                        alt=""
                    />
                    {soldout ? (
                        <>
                            <div className="absolute z-10 top-0 left-0 w-full h-full rounded-lg bg-white bg-opacity-40"></div>
                            <button className="h-[20px] px-2 py-1 flex items-center justify-center absolute bottom-[10px] right-[10px] rounded-full bg-red-600 text-white z-20">
                                <span className="text-[0.7rem]">Sold Out</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleAddToCart(menu)}
                            className="w-[30px] h-[30px] flex items-center justify-center absolute bottom-[10px] right-[10px] rounded-full menu-button"
                        >
                            <FiPlus className="text-[1.1rem]" />
                        </button>
                    )}
                </div>
                <div
                    onClick={() =>
                        soldout ? null : handleShowItemDetail(menu)
                    }
                    className="px-[4px]"
                >
                    <h1 className="font-[600] text-[14px] text-stone-800 text-eclipsis-2 leading-[normal] mb-[1px]">
                        {menu.shortdescription}
                    </h1>
                    <p className="text-[14px] text-stone-700 text-[0.9rem]">
                        {menu.price.toLocaleString()} Ks
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
