import { MessageSquareText, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileEdit from "../drawers/profileEdit";
import SettingsEdit from "../drawers/settingsEdit";
import propTypes from "prop-types";
import { useSelector } from "react-redux";
import ConfirmationPopup from "../../globalPops/confirmationPopup";
import { useNavigate } from "react-router-dom";


export default function ToolBar({ loading, setLoading }) {
    const [profilePic, setProfilePic] = useState("");
    const [selectedDrawer, setSelectedDrawer] = useState(1);
    const account = useSelector(state => state.Account);
    const [fetchingTools, setFetchingTools] = useState(true);
    const [action, setAction] = useState(-1);
    const [execute, setExecute] = useState(-1);
    const Navigate = useNavigate();

    useEffect(() => {
        setProfilePic(sessionStorage.getItem(account.displayName + 'profilePic'));
        setTimeout(() => {
            setFetchingTools(false);
            setLoading(loading + 1);
        }, 1000);
    }, []);

    useEffect(() => {
        if(execute === 5) {
            sessionStorage.clear();
            localStorage.clear();
            Navigate('/');
        }
    },[execute]);
    
    return (
        <>
            {action !== -1 && <ConfirmationPopup action={action} setAction={setAction} setExecute={setExecute} />}
            <div className="w-[11%] min-w-[50px] h-full bg-color-blue flex flex-col justify-between py-4 border-r-[1px] border-r-[#C1E8FF] border-opacity-45 z-30">
                <div className="flex flex-col gap-3 items-center">
                    <div className="group relative select-none" onClick={() => setSelectedDrawer (1)}>
                        <MessageSquareText className={`w-[40px] h-[40px] text-white ${selectedDrawer === 1 ? "bg-color-dark" : "bg-transparent"} rounded-full p-2 transition-all duration-150 ease-in-out group-hover:brightness-75`} />
                        <div className="bg-color-light py-1 px-3 rounded-full group-hover:scale-100 scale-0 absolute top-1/2 -translate-y-1/2 left-10 transition-all duration-300 ease-in-out">
                            <span className="text-color-dark font-semibold whitespace-nowrap">Chats</span>
                        </div>
                    </div>
                    <div className="group relative select-none" onClick={() => setAction(5)}>
                        <LogOut className={`w-[42px] h-[42px] text-white p-2 rounded-full transition-all duration-150 ease-in-out group-hover:brightness-75`} />
                        <div className="bg-color-light py-1 px-3 rounded-full group-hover:scale-100 scale-0 absolute top-1/2 -translate-y-1/2 left-10 transition-all duration-300 ease-in-out">
                            <span className="text-color-dark font-semibold whitespace-nowrap">Logout</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 items-center">
                    <div className="group relative select-none" onClick={() => setSelectedDrawer(3)}>
                        <Settings className={`w-[42px] h-[42px] text-white ${selectedDrawer === 3 ? "bg-color-dark" : "bg-transparent"} p-2 rounded-full transition-all duration-150 ease-in-out group-hover:brightness-75`} />
                        <div className="bg-color-light py-1 px-3 rounded-full group-hover:scale-100 scale-0 absolute top-1/2 -translate-y-1/2 left-10 transition-all duration-300 ease-in-out">
                            <span className="text-color-dark font-semibold whitespace-nowrap">Settings</span>
                        </div>
                    </div>
                    <div className="group relative select-none" onClick={() => setSelectedDrawer(4)}>
                        {fetchingTools ? (
                            <div className="animate-pulse bg-gray-500 w-9 h-9 rounded-full" />
                        ) : (
                            <img alt="profile" src={profilePic} className={`w-[35px] h-[35px] rounded-full transition-all duration-150 ease-in-out group-hover:brightness-75`} />
                        )}
                        <div className="bg-color-light py-1 px-3 rounded-full group-hover:scale-100 scale-0 absolute top-1/2 -translate-y-1/2 -right-2 translate-x-full transition-all duration-300 ease-in-out">
                            <span className="text-color-dark font-semibold whitespace-nowrap">Profile</span>
                        </div>
                    </div>
                </div>
            </div>
            <ProfileEdit opened={selectedDrawer} setOpened={setSelectedDrawer} />
            <SettingsEdit opened={selectedDrawer} setOpened={setSelectedDrawer} />
        </>
    )
}

ToolBar.propTypes = {
    loading: propTypes.number,
    setLoading: propTypes.func
}