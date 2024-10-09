import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmationPopup from "../globalPops/confirmationPopup";
import PropTypes from 'prop-types';

export default function ChatUtilMenu({execute, setExecute, blockedStatus}) {
    const [openUtility, setOpenUtility] = useState(false);
    const [confirmAction, setConfirmAction] = useState(-1);
    
    useEffect(() => {
        if(execute === -1) {
            setOpenUtility(false);
            setConfirmAction(-1);
        }
    },[execute]);

    return (
        <>
            {confirmAction !== -1 && <ConfirmationPopup action={confirmAction} setAction={setConfirmAction} setExecute={setExecute}/>}
            <div className="relative z-40">
                <EllipsisVertical onClick={() => setOpenUtility(!openUtility)} className="group size-8 text-white transition-all duration-150 ease-in-out hover:cursor-pointer active:bg-color-dark rounded-full p-1 hover:brightness-75" />
                <div className={`bg-color-blue flex-col flex w-44 p-3 px-4 rounded-lg absolute top-full -left-36 transition-all duration-200 ease-in-out ${openUtility ? "scale-100" : "scale-0 translate-x-1/2 -translate-y-1/2"}`}>
                    <div onClick={() => setConfirmAction(1)} className="text-white font-semibold hover:brightness-75 hover:cursor-pointer py-2">clear conversation</div>
                    <div onClick={() => setConfirmAction(2)} className="text-white font-semibold hover:brightness-75 hover:cursor-pointer py-2">delete chat</div>
                    {!blockedStatus && <div onClick={() => setConfirmAction(3)} className="text-white font-semibold hover:brightness-75 hover:cursor-pointer py-2">block user</div>}
                    {blockedStatus && <div onClick={() => setConfirmAction(4)} className="text-white font-semibold hover:brightness-75 hover:cursor-pointer py-2">unblock user</div>}
                    <div className="text-white font-semibold hover:brightness-75 hover:cursor-pointer py-2">report user</div>
                </div>
            </div>
        </>

    )
}

ChatUtilMenu.propTypes = {
    execute: PropTypes.number.isRequired,
    setExecute: PropTypes.func.isRequired,
    blockedStatus: PropTypes.bool.isRequired
}