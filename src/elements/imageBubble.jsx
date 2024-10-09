import { TriangleRight, Trash2, ClipboardCopy, ChevronDown, CircleOff, Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatTimestamp } from "../utils/messageUtilFunctions";
import propTypes from 'prop-types';
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase-config";
import { db } from "../../firebase-config";
import { getDocs, query, collection, where, updateDoc } from "firebase/firestore";

export default function ImageBubble({ message, mainID, logID }) {
    const [growIn, setGrowIn] = useState(message.owner === mainID ? 'scale-0 -translate-x-1/2 -translate-y-1/2' : "scale-0 translate-x-1/2 -translate-y-1/2");
    const [openUtility, setOpenUtility] = useState(false);
    const [imageContent, setImageContent] = useState(null);
    const [fullPreview, setFullPreview] = useState(false);

    useEffect(() => {
        const storeRef = ref(storage, 'chatMediaImages/' + message.content);
        getDownloadURL(storeRef).then((url) => {
            setImageContent(url);
        }).catch((error) => {
            console.log(error);
        });
        setTimeout(() => setGrowIn('scale-100'), 10);
    }, []);

    const downloadImage = () => {
        fetch(imageContent)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = message.content;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(err => console.error('Error downloading the image:', err));
    };

    const deleteImage = async () => {
        try {
            const storeRef = ref(storage, 'chatMediaImages/' + message.content);
            await deleteObject(storeRef);
            const messageDocs = await getDocs(query(collection(db, "messageLog"), where("__name__", "==", logID)));
            const logData = messageDocs.docs[0].data().log;
            const newLog = logData.map(msg => {
                if (msg.content === message.content) {
                    msg.status = 'deleted';
                }
                return msg;
            });
            updateDoc(messageDocs.docs[0].ref, { log: newLog });
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {fullPreview &&
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 z-50 flex justify-center items-center">
                    <img alt={message.content} src={imageContent} className="max-w-[70%] max-h-[70%]" />
                    <div className="absolute top-0 w-full flex justify-end p-5 gap-6">
                        <Download onClick={() => downloadImage()} className="size-6 text-white hover:brightness-50 cursor-pointer" />
                        <X onClick={() => setFullPreview(false)} className="size-6 text-white hover:brightness-50 cursor-pointer" />
                    </div>
                </div>}

            <div className={`${growIn} transition-all duration-200 ease-in-out group relative flex flex-col max-w-[80%] w-fit leading-1.5 p-4 ${message.owner === mainID ? "bg-color-blue rounded-xl rounded-tl-none ml-2" : "bg-black self-end rounded-xl rounded-tr-none mr-2"}`}>
                <TriangleRight className={`${message.owner === mainID ? "fill-color-blue text-color-blue flip-horizontal -left-5" : "text-black fill-black rotate-180 -right-5"} absolute -top-1 size-8`} />
                {message.owner === mainID && <div className={`flex-col flex absolute -right-1 group-hover:translate-x-full top-2 group-hover:opacity-100 ${openUtility ? `opacity-100 translate-x-full` : `opacity-0 translate-x-1/2`} transition-all duration-200 ease-in-out`}>
                    <ChevronDown onClick={() => setOpenUtility(!openUtility)} className={`${openUtility ? "rotate-180" : "rotate-0"} bg-color-blue hover:brightness-50 hover:cursor-pointer size-8 p-1 rounded-full transition-all duration-200 ease-in-out`} />
                    <div className={`flex flex-col gap-4 rounded-lg p-4 ${openUtility ? "scale-100 block" : "scale-0 hidden"} bg-color-blue w-48 transition-all duration-200 ease-in-out`}>
                        <div className='flex gap-4 hover:brightness-75 hover:cursor-pointer' onClick={() => navigator.clipboard.writeText(message.content)}>
                            <ClipboardCopy className="size-5" />
                            <span className="text-md">Copy image</span>
                        </div>
                        <div className='flex gap-4 hover:brightness-75 hover:cursor-pointer' onClick={() => downloadImage()}>
                            <Download className="size-5" />
                            <span className="text-md">Download image</span>
                        </div>
                        <div className='flex gap-4 hover:brightness-75 hover:cursor-pointer' onClick={() => deleteImage()}>
                            <Trash2 className="size-5" />
                            <span className="text-md">Delete image</span>
                        </div>
                    </div>
                </div>}
                <div className={`text-[17px] ${message.status === 'deleted' ? 'text-gray-400' : ""} flex gap-2 items-center`}>{message.status === 'deleted' ? <>
                    <CircleOff className='text-gray-400 size-3' />
                    <p>this image was deleted</p>
                </> :
                    imageContent === null ? (
                        <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg" />
                    ) : (
                        <img alt={message.content} src={imageContent} onClick={() => setFullPreview(true)} className="lg:max-w-[356px] lg:max-h-[200px] max-w-full max-h-full rounded-lg cursor-pointer" />
                    )}
                </div>
                <div className={`text-[12px] items-center font-bold flex gap-4 mt-2 w-full justify-between`}>{formatTimestamp(message, mainID)}</div>
            </div >
        </>
    )
}

ImageBubble.propTypes = {
    message: propTypes.object.isRequired,
    mainID: propTypes.string.isRequired,
    logID: propTypes.string.isRequired
}