import { ArrowBigLeftDash, Camera, Pencil, Check, LoaderCircle, X } from "lucide-react";
import { NotificationContext } from "../../globalPops/useNotification";
import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateBio, updateDisplayName } from "../../Redux/Slices/accountSlice";
import { db } from "../../../firebase-config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { deleteObject, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase-config";
import { UsernameValidate } from "../../utils/textValidations";
import GenerateUniqueFileName from "../../utils/generateUniqueFileName";
import propTypes from "prop-types";


export default function ProfileEdit({ opened, setOpened }) {
    const { notify } = useContext(NotificationContext);
    const [profilePic, setProfilePic] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [editField, setEditField] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const account = useSelector(state => state.Account);
    const dispatch = useDispatch();

    useEffect(() => {
        document.getElementById('nameEditInput').value = account.displayName;
        document.getElementById('bioEditInput').value = account.bio;
        setSubmitting(false);
        setEditField(0);
    }, [opened]);

    useEffect(() => {
        setName(account.displayName);
        setBio(account.bio);
        setProfilePic(sessionStorage.getItem(account.displayName + 'profilePic'));
    }, []);

    const submitNewImage = async () => {
        const decodedURL = decodeURIComponent(account.profilePic);
        const startIndex = decodedURL.indexOf('/o/') + 3;
        const endIndex = decodedURL.indexOf('?');
        const filePath = decodedURL.substring(startIndex, endIndex);
        const oldImageRef = ref(storage, filePath);

        const imageQuery = query(collection(db, "users"), where("profilePic", "==", account.profilePic));
        const imageQuerySnapshot = await getDocs(imageQuery);
        let deletedImage = "";
        if (imageQuerySnapshot.docs.length > 1) {
            deletedImage = null;
        } else {
            deletedImage = oldImageRef;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            const reader = new FileReader();
            const uniqueFileName = GenerateUniqueFileName(file.name);
            const newImageRef = ref(storage, `profileImages/${uniqueFileName}`);
            reader.readAsDataURL(file);
            reader.onload = () => {
                try {
                    const uploadNewImage = () => {
                        const uploadTask = uploadBytesResumable(newImageRef, file);
                        uploadTask.on(
                            'state_changed',
                            null,
                            (error) => {
                                console.error("Error updating user profile picture: ", error);
                                notify({ message: "Error updating profile picture", type: "error" });
                            },
                            async () => {

                                await updateDoc(doc(db, 'users/' + account.id), { profilePic: `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/profileImages%2F${uniqueFileName}?alt=media` });
                                notify({ message: "Profile picture updated successfully", type: "success" });
                                sessionStorage.setItem(account.displayName + 'profilePic', reader.result);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1500);
                            }
                        );
                    };

                    if (deletedImage) {
                        deleteObject(deletedImage).then(uploadNewImage).catch((error) => {
                            console.error("Error deleting old profile picture: ", error);
                            notify({ message: "Error deleting old profile picture", type: "error" });
                        });
                    } else {
                        uploadNewImage();
                    }
                } catch (error) {
                    console.error("Error updating user profile picture: ", error);
                    notify({ message: "Error updating profile picture", type: "error" });
                }
            }
        }
    }

    useEffect(() => {
        const modifyAccountData = async () => {
            let newData = {};
            if (submitting === 1) {
                if (!UsernameValidate(name.trim(), notify)) {
                    setSubmitting(false);
                    return;
                }
                newData = { displayName: name };
            }
            else if (submitting === 2) {
                newData = { bio: bio };
            }
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("displayName", "==", account.displayName));
            const querySnapshot = await getDocs(q);

            const userDoc = querySnapshot.docs[0].ref;
            try {
                await updateDoc(userDoc, newData);
                notify({ message: "Account updated successfully", type: "success" });
                if (submitting === 1) {
                    sessionStorage.removeItem(account.displayName + 'profilePic');
                    sessionStorage.setItem(name + 'profilePic', profilePic);
                    dispatch(updateDisplayName({ displayName: name }));
                }
                else if (submitting === 2) {
                    dispatch(updateBio(bio));
                }
                setSubmitting(false);
                setEditField(0);
            } catch (error) {
                console.error("Error updating user profile: ", error);
                notify({ message: "Error updating account", type: "error" });
                setSubmitting(false);
                setEditField(0);
            }
        }
        if (submitting) {
            modifyAccountData();
        }
    }, [submitting]);


    return (
        <div className={`w-[27%] fixed top-0 h-full min-w-[250px] ${opened === 4 ? "sm:translate-x-[16%] lg:translate-x-[11%] z-20" : "-translate-x-full z-10"} transition-all duration-700 ease-in-out border-r-[1px] border-r-[#C1E8FF] border-opacity-45`}>
            <div className="w-full h-full bg-color-dark flex flex-col gap-8 text-white z-20">
                <div className="w-full h-[7%] justify-between items-center flex gap-3 px-5 mb-4 select-none">
                    <p className="text-2xl font-bold">Edit profile</p>
                    <ArrowBigLeftDash onClick={() => setOpened(1)} className="size-8 mt-1 fill-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                </div>

                <div className="group w-fit mx-auto relative mb-8 select-none">
                    <img alt="profilePic" src={profilePic} className="lg:w-[190px] lg:h-[190px] w-[100px] h-[100px] rounded-full mx-auto group-hover:brightness-50" />
                    <div onClick={() => submitNewImage()} className="flex flex-col items-center justify-center absolute top-0 w-full h-full hover:cursor-pointer">
                        <Camera className="lg:size-8 size-5 top-7 left-10 text-white group-hover:block hidden pointer-events-none" />
                        <p className="text-center lg:text-lg text-sm font-semibold group-hover:block hidden pointer-events-none">Edit Image</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 px-7 mb-4">
                    <label className="text-md text-[#C1E8FF] font-semibold px-2">Username</label>
                    <div className={`flex gap-6 items-center select-none border-b-2 transition-all duration-150 ease-in-out ${editField === 1 ? "border-[#C1E8FF]" : "border-transparent"}`}>
                        <input id="nameEditInput" defaultValue={name} onChange={(e) => setName(e.target.value)} maxLength={30} disabled={editField !== 1} className={`w-[90%] h-10 bg-transparent text-white p-2 outline-none`} rows="1" />
                        <div className="flex gap-3 items-center">
                            <span className="text-white">{30 - name.length}</span>
                            {editField !== 1 ? <Pencil onClick={() => setEditField(1)} className="size-7 fill-white text-black hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                                : <>
                                    {!submitting ? <>
                                        <Check onClick={() => setSubmitting(1)} className="size-7 text-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                                        <X onClick={() => setEditField(0)} className="size-7 text-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                                    </>
                                        : <LoaderCircle className="size-7 text-white animate-spin" />}
                                </>}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 px-7 mb-4">
                    <label className="text-md text-[#C1E8FF] font-semibold px-2">About</label>
                    <div className={`flex gap-6 items-center select-none border-b-2 transition-all duration-150 ease-in-out ${editField === 2 ? "border-[#C1E8FF]" : "border-transparent"}`}>
                        <input id="bioEditInput" defaultValue={bio} onChange={(e) => setBio(e.target.value)} disabled={editField !== 2} className={`w-[90%] h-10 bg-transparent text-white p-2 outline-none`} rows="1" />
                        <div className="flex gap-3 items-center">
                            {editField !== 2 ? <Pencil onClick={() => setEditField(2)} className="size-7 fill-white text-black hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                                : <>
                                    {!submitting ? <>
                                        <Check onClick={() => setSubmitting(2)} className="size-7 text-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                                        <X onClick={() => setEditField(0)} className="size-7 text-white hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                                    </>
                                        : <LoaderCircle className="size-7 text-white animate-spin" />}
                                </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ProfileEdit.propTypes = {
    opened: propTypes.number,
    setOpened: propTypes.func
};