import { ArrowBigLeftDash, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import AccountSettings from "./settingsMenus/accountSettings";

import propTypes from "prop-types";

export default function SettingsEdit({ opened, setOpened }) {
    const [selectMenu, setSelectMenu] = useState(0);

    useEffect(() => {
        setSelectMenu(0);
    },[opened]);

    return (
        <div className={`w-[27%] fixed top-0 h-full min-w-[250px] ${opened === 3 ? "sm:translate-x-[16%] lg:translate-x-[11%] z-20" : "-translate-x-full z-10"} transition-all duration-700 ease-in-out border-r-[1px] border-r-[#C1E8FF] border-opacity-45`}>
            <div className="w-full h-full bg-color-dark text-white z-20">
                <div className="w-full h-[7%] justify-between items-center flex gap-3 px-5 select-none mb-4">
                    <p className="text-2xl font-bold">Settings</p>
                    <ArrowBigLeftDash onClick={() => setOpened(1)} className="size-8 mt-1 fill-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                </div>
                {selectMenu === 0 &&
                    <div className="flex flex-col gap-3 w-[94%] mx-auto">
                        <div onClick={() => setSelectMenu(1)} className="flex gap-3 items-center border-b border-color-light px-3 py-4 hover:bg-color-blue transition-colors duration-150 ease-in-out">
                            <UserCog className="size-6" />
                            <p className="text-lg font-semibold">Account settings</p>
                        </div>
                    </div>}
                {selectMenu === 1 && <AccountSettings setSelectedMenu={setSelectMenu}/>}
            </div>
        </div>
    );
}

SettingsEdit.propTypes = {
    opened: propTypes.number,
    setOpened: propTypes.func
};