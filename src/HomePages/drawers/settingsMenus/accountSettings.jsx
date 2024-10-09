import { useState, useContext, useEffect } from "react";
import { LoaderCircle, Check, X, ArrowBigLeftDash } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updatePassword } from "../../../Redux/Slices/accountSlice";
import { query, where, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { NotificationContext } from "../../../globalPops/useNotification";
import { PasswordValidate } from "../../../utils/textValidations";

export default function AccountSettings({setSelectedMenu}) {
    const [editField, setEditField] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [unlockSubmit, setUnlockSubmit] = useState(false);
    const account = useSelector((state) => state.Account);
    const dispatch = useDispatch();
    const { notify } = useContext(NotificationContext);


    const submitPasswordConfirm = () => {
        const inputElement = document.getElementById('passwordEditInput');
        if (inputElement.value === "") return;

        if (inputElement.value === account.password) {
            setUnlockSubmit(true);
            inputElement.placeholder = "Enter new password";
            inputElement.value = "";
        } else {
            inputElement.value = "";
            inputElement.placeholder = "Password mismatch, try again";
        }
    };

    useEffect(() => {
        if (!submitting || document.getElementById("passwordEditInput").value === "") {
            return;
        };

        const submitNewPassword = async () => {
            if (!PasswordValidate(document.getElementById('passwordEditInput').value.trim(), notify)) {
                setSubmitting(false);
                return;
            };

            if(document.getElementById('passwordEditInput').value === account.password){
                notify({ message: "password is the same as the current one", type: 'error' });
                setSubmitting(false);
                return;
            };

            const userQuery = query(collection(db,'users'), where('__name__', '==', account.id));
            const userDoc = await getDocs(userQuery);
            await updateDoc(userDoc.docs[0].ref, { password: document.getElementById('passwordEditInput').value });
            notify({ message: "password updated successfully", type: 'success' });
            dispatch(updatePassword(document.getElementById('passwordEditInput').value));
            
            if (localStorage.getItem('password'))
                localStorage.setItem('password', document.getElementById('passwordEditInput').value);

            setEditField(0);
            setSubmitting(false);
            setUnlockSubmit(false);
        }

        submitNewPassword();
    }, [submitting]);
    return (
        <div>
            <div className="flex justify-between items-center border-b-2 border-color-light w-[92%] pb-2 mx-auto mb-7 select-none">
                <p className="text-lg font-semibold text-[#C1E8FF]">Account settings</p>
                <ArrowBigLeftDash onClick={() => setSelectedMenu(0)} className="size-8 text-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:fill-white" />
            </div>
            <div className="flex flex-col gap-2 px-7 mb-4">
                <label className="text-md text-[#C1E8FF] font-semibold px-2">Password</label>
                <div className={`flex gap-6 items-center select-none border-b-2 transition-all duration-150 ease-in-out ${editField === 1 ? "border-[#C1E8FF]" : "border-transparent"}`}>
                    {editField === 1 && <input id="passwordEditInput" placeholder="Enter current password" type='text' className={`w-[90%] h-10 bg-transparent text-white p-2 outline-none`} />}
                    <div className="flex gap-3 items-center">
                        {editField !== 1 ? <button onClick={() => setEditField(1)} className="bg-color-blue rounded-lg py-2 px-3 w-40">change password</button>
                            : <>
                                {!submitting ? <>
                                    <Check onClick={() => { unlockSubmit ? setSubmitting(true) : submitPasswordConfirm() }} className="size-7 text-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                                    <X onClick={() => setEditField(0)} className="size-7 text-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                                </>
                                    : <LoaderCircle className="size-7 text-white animate-spin" />}
                            </>}
                    </div>
                </div>
            </div>
        </div>
    );
}