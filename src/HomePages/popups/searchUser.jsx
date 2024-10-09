import { X, Send, LoaderCircle, HeartCrack, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../../../firebase-config";
import { getDocs, collection, addDoc, query, where, updateDoc, arrayUnion, doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { addAccountChat } from "../../Redux/Slices/accountSlice";
import uploadImageSession from "../../utils/uploadImageSession";
import propTypes from 'prop-types';

export default function SearchUser({ setSearchUser, setSelectedChat }) {
    const [search, setSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [userList, setUserList] = useState(null);
    const account = useSelector(state => state.Account);
    const chatList = useSelector(state => state.Chats.chats);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!search) return;

        if(searchValue === "") {
            setUserList(null);
            setSearch(false);
            return;
        }

        const fetchUsers = async () => {
            const usersRef = collection(db, "users");
            const q = query(usersRef);
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const users = querySnapshot.docs.map(doc => doc.data()).filter(user => user.displayName.toLowerCase().includes(searchValue.toLowerCase()));
                setUserList(users.filter(user => user.displayName !== account.displayName));
            } else {
                setUserList(null);
            }
            setSearch(false);
        };

        fetchUsers();
    }, [search])

    const addChatToList = async (chatIndex) => {
        const userDoc = doc(db, "users/"+ account.id);
        const otherUserQuery = await getDocs(query(collection(db, "users"), where("displayName", "==", userList[chatIndex].displayName)));
        const otherUserDoc = otherUserQuery.docs[0].ref;

        const chatQuery =  query(collection(db, "chats"), where("mainUser", "==", userDoc), where("otherUser", "==", otherUserDoc));
        const chatResponse = await getDocs(chatQuery);        
        if (!chatResponse.empty) {
            setSelectedChat(chatList.findIndex(chat => chat.otherUser === userList[chatIndex].displayName));
            setSearchUser(false);
        }
        else {
            const messageLog = await addDoc(collection(db, "messageLog"),{ log: [] });
            const newChatMain = await addDoc(collection(db, "chats"), {messages: messageLog, mainUser: userDoc, otherUser: otherUserDoc});
            const newChatOther = await addDoc(collection(db, "chats"), {messages: messageLog, mainUser: otherUserDoc, otherUser: userDoc});

            await updateDoc(userDoc, {chats: arrayUnion(newChatMain)});
            await updateDoc(otherUserDoc, {chats: arrayUnion(newChatOther)});
            uploadImageSession(userList[chatIndex].profilePic, userList[chatIndex].displayName);
            
            dispatch(addAccountChat(newChatMain.path));
            setSearchUser(false);
        }
    }

    return (
        <div className="fixed top-0 z-50 w-screen h-screen bg-black flex justify-center items-center bg-opacity-50">
            <div className="w-1/4 h-1/2 bg-color-blue flex flex-col">
                <div className="w-full h-[12%] flex justify-between items-center px-5">
                    <p className="font-bold text-2xl text-white">Search user</p>
                    <X onClick={() => setSearchUser(false)} className="size-6 font-bold text-white hover:cursor-pointer hover:brightness-50" />
                </div>
                <div className="w-full h-[9%] flex gap-4 px-5 items-center bg-color-dark select-none mb-4">
                    <input onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setSearch(true); } }} type="text" placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} className="w-[92%] h-full bg-transparent text-white placeholder-[#C1E8FF] placeholder-opacity-70 outline-none" />
                    <Send onClick={() => setSearch(true)} className="size-5 text-white hover:cursor-pointer hover:brightness-50 transition duration-150 ease-in-out" />
                </div>
                <div className="w-full h-[79%] flex flex-col overflow-y-auto custom-scrollbar">
                    {search ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <LoaderCircle className="size-12 text-white animate-spin" />
                            <p className="text-white">Searching...</p>
                        </div>
                    ) : (
                        <>
                            {!userList ? (
                                <div className="w-full h-full flex justify-center items-center flex-col gap-3">
                                    <Search className="size-12 text-white" />
                                    <p className="text-white">click on the icon to search for users</p>
                                </div>
                            ) : (
                                <>
                                    {userList.length === 0 ? (
                                        <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
                                            <HeartCrack className="size-12 text-white" />
                                            <p className="text-white">No user found</p>
                                        </div>
                                    ) : (
                                        userList.map((user, index) => (
                                            <div onClick={() => addChatToList(index)} key={index} className="w-full h-16 flex items-center px-3 bg-color-dark border-color-light border-b hover:bg-color-blue hover:text-color-dark hover:cursor-pointer transition duration-150 ease-in-out">
                                                <img src={user.profilePic} alt="User profile" className="w-10 h-10 rounded-full" />
                                                <p className="text-white text-xl ml-3">{user.displayName}</p>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

SearchUser.propTypes = {
    setSearchUser: propTypes.func.isRequired,
    setSelectedChat: propTypes.func.isRequired
}