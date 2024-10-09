import { X } from "lucide-react"
import PropTypes from 'prop-types'

export default function ConfirmationPopup({action, setAction, setExecute}) {
    const dictionary = {
        1: "clear your messages and media in this chat",
        2: "delete the entire chat (all messages and media will be lost)",
        3: "block this user",
        4: "unblock this user",
        5: "log out"
    }

    return(
        <div className="fixed !z-50 top-0 w-full h-full inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-color-blue border-color-dark border-4 w-fit h-fit py-12 px-16 rounded-lg flex flex-col justify-center items-center">
                <X onClick={() => setAction(-1)} className="absolute top-2 right-2 size-6 text-white hover:brightness-75 cursor-pointer" />
                <span className="text-white text-lg font-semibold">are you sure you want to {dictionary[action]}</span>
                <div className="flex gap-4 mt-8">
                    <button onClick={() => setAction(-1)} className="bg-color-dark text-white font-semibold px-4 py-2 rounded-lg hover:brightness-75">cancel</button>
                    <button onClick={() => setExecute(action)} className="bg-color-dark text-white font-semibold px-4 py-2 rounded-lg hover:brightness-75">confirm</button>
                </div>
            </div>
        </div>
    )
}

ConfirmationPopup.propTypes = {
    action: PropTypes.number.isRequired,
    setAction: PropTypes.func.isRequired,
    setExecute: PropTypes.func.isRequired
}