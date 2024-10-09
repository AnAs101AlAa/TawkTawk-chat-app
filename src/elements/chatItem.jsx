import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import propTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addChat } from '../Redux/Slices/chatsSlice';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import uploadImageSession from '../utils/uploadImageSession';

export default function ChatItem({ chat, search, index, onClick }) {
    const [profilePic, setProfilePic] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchChat = async () => {
            const chatRef = doc(db, chat);
            const response = await getDoc(chatRef);
            const otherUserRef = response.data().otherUser;
            const userData = await getDoc(otherUserRef);
            setProfilePic(userData.data().profilePic);
            setDisplayName(userData.data().displayName);

            const messagesQuery = await getDoc(response.data().messages);
            const messagesLog = messagesQuery.data().log;

            const q = query(collection(db, "messageLog"), where("__name__", "==", messagesQuery.id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let messages = [];
                querySnapshot.forEach((doc) => {
                    messages = messages.concat(doc.data().log);
                });
                if (messages.length !== 0) {
                    setLastMessage(messages[messages.length - 1].content);
                }
            });

            uploadImageSession(userData.data().profilePic, userData.data().displayName);

            const chatData = {
                chatId: index,
                otherUser: userData.data().displayName,
                messages: messagesLog,
                logId: messagesQuery.id,
                otherUserId: userData.id,
                bio: userData.data().bio,
            }

            dispatch(addChat(chatData));

            if (messagesLog.length === 0) {
                setLastMessage('your epic conversation has not started yet');
            }
            else {
                setLastMessage(messagesLog[messagesLog.length - 1].content);
            }

            setLoading(false);
            return () => unsubscribe();
        };
        fetchChat();
    }, [chat]);


    if (!displayName.toLowerCase().includes(search.toLowerCase())) {
        return null;
    }

    if (loading) {
        return (
            <>
                <div className="flex flex-row gap-3 px-3 h-20 -mb-1 items-center">
                    <div className="animate-pulse bg-gray-500 w-12 h-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <div className="animate-pulse bg-gray-500 w-28 h-5 rounded-full" />
                        <div className="animate-pulse bg-gray-500 w-48 h-5 rounded-full" />
                    </div>
                </div>
                <hr className="w-[92%] border-[#7DA0CA] border border-opacity-30 mx-auto" />
            </>
        )
    }

    return (
        <div className="w-full flex-none h-20 bg-color-dark transition-colors duration-150 ease-in-out hover:bg-color-blue" onClick={() => onClick(index, chat)}>
            <div className="w-full h-full flex px-3 gap-4 items-center">
                <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full object-fill flex-none" />
                <div className="flex flex-col flex-grow overflow-hidden">
                    <span className="text-white text-lg font-semibold">{displayName}</span>
                    <p className="text-white text-sm mt-1 truncate max-w-[96%]">{lastMessage}</p>
                </div>
            </div>
            <hr className="w-[92%] border-[#7DA0CA] border border-opacity-30 mx-auto" />
        </div>
    );
}

ChatItem.propTypes = {
    chat: propTypes.string.isRequired,
    search: propTypes.string.isRequired,
    index: propTypes.number.isRequired,
    onClick: propTypes.func.isRequired
};