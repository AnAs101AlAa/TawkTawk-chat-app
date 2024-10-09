import { TriangleRight, ChevronDown, ClipboardCopy, Trash2, Pencil, CircleOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { formatTimestamp } from '../utils/messageUtilFunctions';
import propTypes from 'prop-types';

export default function ChatBubble({ message, mainID, logID, openedToolKit, setOpenedToolKit, index }) {
    const [openUtility, setOpenUtility] = useState(false);
    const [editMessage, setEditMessage] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [growIn, setGrowIn] = useState(message.owner === mainID ? 'scale-0 -translate-x-1/2 -translate-y-1/2' : "scale-0 translate-x-1/2 -translate-y-1/2");

    useEffect(() => {
        setTimeout(() => setGrowIn('scale-100'), 10);
    }, []);

    const handleUtilitySwitch = () => {
        if (openUtility) {
            setOpenUtility(false);
            setOpenedToolKit(-1);
        }
        else {
            setOpenUtility(true);
            setOpenedToolKit(index);
        }
    };

    const submitEditMessage = async () => {
        const q = query(collection(db, "messageLog"), where("__name__", "==", logID));
        const messageDoc = await getDocs(q);
        const newMessageLog = messageDoc.docs[0].data().log.map(msg => {
            if (msg.type !== 'text')
                return msg;
            if (msg.content === message.content && msg.creationTime.nanoseconds === message.creationTime.nanoseconds && msg.creationTime.seconds === message.creationTime.seconds && msg.owner === message.owner) {
                return { content: newMessage, creationTime: msg.creationTime, owner: msg.owner, type: msg.type, status: 'edited', editTime: new Date() };
            }
            return msg;
        });
        console.log(newMessageLog);
        await updateDoc(messageDoc.docs[0].ref, { log: newMessageLog });
        setEditMessage(false);
        setOpenedToolKit(-1);
        setOpenUtility(false);
    };

    const deleteMessage = async () => {
        const messageQuery = query(collection(db, 'messageLog'), where('__name__', '==', logID));
        const messageDoc = await getDocs(messageQuery);
        const newMessageLog = messageDoc.docs[0].data().log.map(msg => {
            if (msg.type !== 'text')
                return msg;
            if (msg.content === message.content && msg.creationTime.nanoseconds === message.creationTime.nanoseconds && msg.creationTime.seconds === message.creationTime.seconds && msg.owner === message.owner) {
                return { content: msg.content, creationTime: msg.creationTime, owner: msg.owner, type: msg.type, status: 'deleted' };
            }
            return msg;
        });
        await updateDoc(messageDoc.docs[0].ref, { log: newMessageLog });
    };

    return (
        <div className={`group relative max-w-[80%] w-fit ${message.owner === mainID ? "self-start" : "self-end"}`}>
            <div className={`z-0 ${growIn} transition-all duration-200 ease-in-out relative flex flex-col w-full leading-1.5 p-4 ${message.owner === mainID ? "bg-color-blue rounded-xl rounded-tl-none ml-2" : "bg-black rounded-xl rounded-tr-none mr-2"}`}>
                <TriangleRight className={`${message.owner === mainID ? "fill-color-blue text-color-blue flip-horizontal -left-4" : "text-black fill-black rotate-180 -right-4"} absolute -top-1 size-8`} />

                <div className={`lg:text-[17px] text-[13px] ${editMessage ? "hidden" : "block"} ${message.status === 'deleted' ? 'text-gray-400' : ""} flex gap-2 items-center`}>{message.status === 'deleted' ?
                    <>
                        <CircleOff className='text-gray-400 size-4' />
                        <p>this message was deleted</p>
                    </>
                    : message.content}
                </div>
                
                {editMessage && <input onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEditMessage(); } }} type="text" className={`font-medium w-fit px-2 py-1 text-black bg-color-light outline-none rounded-xl`} defaultValue={message.content} onChange={(e) => setNewMessage(e.target.value)} />}
                <div className={`lg:text-[12px] text-[8px] items-center font-bold flex gap-1 mt-2 w-full justify-between`}>{formatTimestamp(message, mainID)}</div>
            </div>
            {message.owner === mainID && (openedToolKit === index || openedToolKit == -1) && <div className={`z-40 flex-col flex absolute -right-3 group-hover:translate-x-full top-2 group-hover:opacity-100 ${openUtility ? `opacity-100 translate-x-full` : `opacity-0 translate-x-0`} transition-all duration-200 ease-in-out`}>
                <ChevronDown onClick={() => handleUtilitySwitch()} className={`${openUtility ? "rotate-180" : "rotate-0"} bg-color-blue hover:brightness-50 hover:cursor-pointer size-8 p-1 rounded-full transition-all duration-200 ease-in-out`} />
                <div className={`flex flex-col gap-4 rounded-lg p-4 ${openUtility ? "scale-100" : "scale-0 hidden"} bg-color-blue w-48 transition-all duration-200 ease-in-out`}>
                    <div className='flex gap-4 hover:brightness-75 hover:cursor-pointer' onClick={() => navigator.clipboard.writeText(message.content)}>
                        <ClipboardCopy className="size-5" />
                        <span className="text-md">Copy Message</span>
                    </div>
                    <div className='flex gap-4 hover:brightness-75 hover:cursor-pointer' onClick={() => deleteMessage()}>
                        <Trash2 className="size-5" />
                        <span className="text-md">Delete Message</span>
                    </div>
                    <div className='flex gap-4 hover:brightness-75 hover:cursor-pointer' onClick={() => setEditMessage(true)}>
                        <Pencil className="size-5" />
                        <span className="text-md">Edit Message</span>
                    </div>
                </div>
            </div>}
        </div>
    )
}

ChatBubble.propTypes = {
    message: propTypes.object.isRequired,
    mainID: propTypes.string.isRequired,
    logID: propTypes.string.isRequired,
    openedToolKit: propTypes.number.isRequired,
    setOpenedToolKit: propTypes.func.isRequired,
    index: propTypes.number.isRequired
}