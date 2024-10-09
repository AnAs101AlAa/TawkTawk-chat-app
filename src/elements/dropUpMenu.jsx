import { useState } from "react";
import { FileText, ImageUp, ChartBarBig } from "lucide-react";
import GenerateUniqueFileName from "../utils/generateUniqueFileName";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase-config";
import { db } from "../../firebase-config";
import { collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import propTypes from 'prop-types';

export default function DropUpMenu({ icon, logID, mainID }) {
    const [open, setOpen] = useState(false);

    const handleFileSelect = (accept) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.onchange = async (event) => {
            const selectedFile = event.target.files[0];
            console.log(selectedFile);
            const logQuery = query(collection(db, 'messageLog'), where('__name__', '==', logID));
            const logDocs = await getDocs(logQuery);

            const newFileName = GenerateUniqueFileName(selectedFile.name);
            const storageRef = ref(storage, 'chatMediaImages/' + newFileName);
            await uploadBytesResumable(storageRef, selectedFile);
            const messageOut = {
                content: newFileName,
                creationTime: new Date(),
                owner: mainID,
                type: 'image',
                status: 'delivered'
            };
            const newLog = logDocs.docs[0].data().log;
            newLog.push(messageOut);
            console.log(newLog);
            updateDoc(logDocs.docs[0].ref, { log: newLog });
            setOpen(false);
        };
    input.click();
};

return (
    <>
        <div onClick={() => setOpen(!open)} id="dropdownTopButton" onBlur={() => setOpen(false)} className={`relative rounded-full size-10 items-center flex justify-center transition-color duration-200 ease-in-out ${open ? "bg-[#021024] rotate-[225deg]" : "bg-transparent rotate-0"}`}>
            {icon}
        </div>
        <div id="dropdownTop" className={`absolute bottom-16 left-14 z-40 bg-[#052659] divide-y divide-gray-100 rounded-xl shadow w-[15%] transition-all duration-200 ease-in-out ${open ? "translate-x-0 translate-y-0 scale-100" : "-translate-x-1/2 translate-y-1/2 scale-0"}`}>
            <ul className="px-2 py-3" aria-labelledby="dropdownTopButton">
                <li className="flex gap-3 items-center hover:bg-color-dark p-2 rounded-xl" onClick={() => handleFileSelect('.pdf,.doc,.docx')}>
                    <FileText className="w-7 h-7 fill-purple-600 text-purple-300" strokeWidth={1} />
                    <p className="text-[15px]">Documents</p>
                </li>
                <li className="flex gap-3 items-center hover:bg-color-dark p-2 rounded-xl" onClick={() => handleFileSelect('image/*,video/*')}>
                    <ImageUp className="w-7 h-7 fill-red-600 text-red-300" strokeWidth={1} />
                    <p className="text-[15px]">Photos and Videos</p>
                </li>
                <li className="flex gap-3 items-center hover:bg-color-dark p-2 rounded-xl">
                    <ChartBarBig className="w-7 h-7 fill-yellow-600 text-yellow-300" strokeWidth={1} />
                    <p className="text-[15px]">{"Poll (not yet)"}</p>
                </li>
            </ul>
        </div>
    </>
);
}

DropUpMenu.propTypes = {
    icon: propTypes.object.isRequired,
    logID: propTypes.string.isRequired,
    mainID: propTypes.string.isRequired
}