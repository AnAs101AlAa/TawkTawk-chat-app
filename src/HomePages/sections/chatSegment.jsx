import DropUpMenu from "../../elements/dropUpMenu";
import propTypes from "prop-types";
import ChatBubble from "../../elements/chatBubble";
import ImageBubble from "../../elements/imageBubble";
import { NotificationContext } from "../../globalPops/useNotification";
import { setChats } from "../../Redux/Slices/chatsSlice";
import { updateAccountChat, updateBlocked } from "../../Redux/Slices/accountSlice";

import { SmilePlus, Plus, SendHorizonal, LoaderCircle } from "lucide-react";
import { useEffect, useState, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../../firebase-config";
import { doc, collection, query, where, onSnapshot, Timestamp, getDocs, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import ChatUtilMenu from "../../elements/chatUtilMenu";

export default function ChatSegment({ selectedChat, setSelectedChat, chatRef }) {
    const [messageLog, setMessageLog] = useState([]);
    const [chatIcon, setChatIcon] = useState('');
    const [chatterName, setChatterName] = useState('');
    const [chatterBio, setChatterBio] = useState('');
    const [messageID, setMessageID] = useState("");
    const [toolkitOpen, setToolkitOpen] = useState(-1);
    const [checkBlockedUser, setCheckBlockedUser] = useState(false);
    const [checkBlockedByUser, setCheckBlockedByUser] = useState(false);
    const [fetchingChat, setFetchingChat] = useState(false);
    const [execute, setExecute] = useState(-1);

    const chatList = useSelector(state => state.Chats.chats);
    const account = useSelector(state => state.Account);
    const dispatch = useDispatch();

    const { notify } = useContext(NotificationContext);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = async () => {
        for(let i = 0; i < 10; i++) {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "auto" });
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const setupObserver = () => {
        const container = messagesContainerRef.current;
    
        if (!container) {
            setTimeout(setupObserver, 100);
            return;
        }
    
        const observer = new MutationObserver(() => {
            setTimeout(scrollToBottom, 0);
        });
    
        observer.observe(container, { childList: true, subtree: true });
    
        return () => {
            observer.disconnect();
        };
    };

    useEffect(() => {
        setupObserver();
    }, [messageLog]);

    useEffect(() => {
        if (selectedChat === -1) return;

        const fetchChatData = async () => {
            try {
                const chatData = chatList.find(chat => chat.chatId === selectedChat);
                setChatIcon(sessionStorage.getItem(chatData.otherUser));
                setChatterName(chatData.otherUser);
                setChatterBio(chatData.bio);
                setMessageID(chatData.logId);

                const q = query(collection(db, "messageLog"), where("__name__", "==", chatData.logId));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    let messages = [];
                    querySnapshot.forEach((doc) => {
                        messages = messages.concat(doc.data().log);
                    });
                    console.log('messages', messages);
                    setMessageLog(messages);
                    scrollToBottom();
                });

                await validateBlocked();
                setFetchingChat(false);
                return () => unsubscribe();
            } catch (err) {
                console.error('Error fetching chat data', err);
            }
        };

        setFetchingChat(true);
        fetchChatData();
    }, [selectedChat]);

    const validateBlocked = async () => {
        const chatData = chatList.find(chat => chat.chatId === selectedChat);
        const otherUserDoc = await getDocs(query(collection(db, 'users'), where("displayName", "==", chatData.otherUser)));
        const blockedList = otherUserDoc.docs[0].data().blocked;
        const blockList = blockedList.filter(block => block.id === account.id);
        setCheckBlockedByUser(blockList.length > 0);

        const otherUserRef = otherUserDoc.docs[0].ref;
        const userDoc = await getDocs(query(collection(db, 'users'), where("__name__", "==", account.id)));
        const blockedList2 = userDoc.docs[0].data().blocked;
        const blockList2 = blockedList2.filter(block => block.id === otherUserRef.id);
        setCheckBlockedUser(blockList2.length > 0);
    };

    useEffect(() => {
        if (execute === 1) {
            clearChat()
                .then(() => {
                    setExecute(-1);
                    notify({ message: 'Messages cleared successfully', type: 'success' });
                });
        }
        else if (execute === 2) {
            deleteChat()
                .then(() => {
                    setSelectedChat(-1);
                    setExecute(-1)
                    notify({ message: 'Chat deleted successfully', type: 'success' });
                });
        }
        else if (execute === 3) {
            blockChat()
                .then(() => {
                    setExecute(-1);
                    validateBlocked()
                        .then(() => {
                            notify({ message: 'User blocked successfully', type: 'success' });
                        });
                });
        }
        else if (execute === 4) {
            unblockChat()
                .then(() => {
                    setExecute(-1);
                    validateBlocked()
                        .then(() => {
                            notify({ message: 'User unblocked successfully', type: 'success' });
                        });
                });
        };
    }, [execute]);

    const unblockChat = async () => {
        try {
            const targetChatRef = doc(db, chatRef);
            const targetChatDocs = await getDoc(targetChatRef);
            const otherUserRef = targetChatDocs.data().otherUser;

            const userDocs = await getDocs(query(collection(db, 'users'), where("__name__", '==', account.id)));
            const blockedList = userDocs.docs[0].data().blocked;
            const newBlockedList = blockedList.filter(block => block.id !== otherUserRef.id);

            await updateDoc(userDocs.docs[0].ref, { blocked: newBlockedList });
            dispatch(updateBlocked({ blocked: newBlockedList }));
        }
        catch (err) {
            console.error('Error unblocking chat', err);
        }
    };

    const blockChat = async () => {
        try {
            const targetChatRef = doc(db, chatRef);
            const targetChatDocs = await getDoc(targetChatRef);
            const otherUserRef = targetChatDocs.data().otherUser;

            const userDocs = await getDocs(query(collection(db, 'users'), where("__name__", '==', account.id)));
            const blockedList = userDocs.docs[0].data().blocked;
            const newBlockedList = [...blockedList, otherUserRef];

            await updateDoc(userDocs.docs[0].ref, { blocked: newBlockedList });
            dispatch(updateBlocked({ blocked: newBlockedList }));
        }
        catch (err) {
            console.error('Error blocking chat', err);
        }
    };

    const clearChat = async () => {
        try {
            const messageCollection = collection(db, "messageLog");
            const messageDoc = await getDocs(query(messageCollection, where("__name__", "==", messageID)));
            const log = messageDoc.docs[0].data().log;
            const newLog = log.map(message => {
                if (message.owner === account.id) {
                    message.status = 'deleted';
                }
                return message;
            });
            await updateDoc(messageDoc.docs[0].ref, { log: newLog });
        } catch (err) {
            console.error('Error clearing chat', err);
        }
    };

    const deleteChat = async () => {
        try {
            const targetChatRef = doc(db, chatRef);
            const userCollection = collection(db, "users");
            const userDoc = await getDocs(query(userCollection, where("__name__", "==", account.id)));
            const mainChatList = userDoc.docs[0].data().chats.filter(chat => chat.id !== targetChatRef.id);

            const otherUserDoc = await getDocs(query(userCollection, where("displayName", "==", chatterName)));
            const otherUserRef = otherUserDoc.docs[0].ref;
            const otherChatList = otherUserDoc.docs[0].data().chats.filter(chat => chat.id !== targetChatRef.id);

            await updateDoc(userDoc.docs[0].ref, { chats: mainChatList });
            await updateDoc(otherUserRef, { chats: otherChatList });
            await deleteDoc(targetChatRef);

            const newChats = chatList.filter(chat => chat.id !== targetChatRef.id);
            const newAccountChats = account.chats.filter(chat => chat !== "chats/" + targetChatRef.id);
            dispatch(updateAccountChat({ chats: newAccountChats }));
            dispatch(setChats({ chats: newChats }));
        } catch (err) {
            console.error('Error deleting chat', err);
        }
    };

    const sendMessage = async () => {
        const messageOut = {
            content: document.querySelector('textarea').value,
            owner: account.id,
            creationTime: Timestamp.now(),
            type: 'text',
            status: 'sending'
        };

        if (messageOut.content === '') return;
        document.querySelector('textarea').value = '';
        setMessageLog([...messageLog, messageOut]);

        try {
            const messageCollection = collection(db, "messageLog");
            const q = query(messageCollection, where("__name__", "==", chatList.find(chat => chat.chatId === selectedChat).logId));
            const messageDoc = await getDocs(q);
            const messageLogRef = messageDoc.docs[0].ref;

            const adjustedMessage = { ...messageOut, status: 'delivered' };
            const newLog = [...messageLog, adjustedMessage];
            await updateDoc(messageLogRef, { log: newLog });

        } catch {
            messageLog.pop();
            const failedMessage = { ...messageOut, status: 'failed' };
            setMessageLog([...messageLog, failedMessage]);
        }
    };

    if (fetchingChat) {
        return (
            <div className="w-[70%] h-full select-none relative flex flex-col">
                <div className="w-full h-full bg-color-blue flex flex-col items-center justify-center gap-3">
                    <LoaderCircle className="w-[45px] h-[45px] text-white animate-spin" />
                    <span className="text-white text-lg font-semibold">Please hold while we fetch you your chat</span>
                </div>
            </div>
        )
    };

    if (selectedChat === -1) {
        return (
            <div className="w-[70%] h-full select-none relative flex flex-col">
                <div className="w-full h-full bg-color-blue flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">Select a chat to start messaging</span>
                </div>
            </div>
        )
    };

    return (
        <div className="w-[70%] h-full select-none relative flex flex-col">
            <div className="z-30 w-full h-[7%] p-2 px-4 flex justify-between bg-color-blue items-center border-b-[1px] border-b-[#C1E8FF] border-opacity-45">
                <div className="flex gap-4 items-center">
                    <img alt="pfpPic" src={chatIcon} className="lg:w-[46px] lg:h-[46px] w-[30px] h-[30px] rounded-full" />
                    <div className="flex flex-col text-white content-center justify-center">
                        <span className="lg:text-lg text-md font-semibold">{chatterName}</span>
                        <span className="lg:text-sm text-xs font-normal">{chatterBio}</span>
                    </div>
                </div>
                <ChatUtilMenu execute={execute} setExecute={setExecute} blockedStatus={checkBlockedUser} />
            </div>

            <div className="w-full h-[85%] relative text-white">
                <img alt="background" src="/chatBackground.jpg" className="absolute top-0 w-full h-full object-cover -z-10" />
                <div ref={messagesContainerRef} className="flex flex-col gap-5 overflow-y-scroll h-full w-full px-4 py-3 custom-scrollbar">
                    {messageLog.map((message, index) => {
                        switch (message.type) {
                            case 'text':
                                return <ChatBubble key={index} message={message} mainID={account.id} logID={messageID} index={index} openedToolKit={toolkitOpen} setOpenedToolKit={setToolkitOpen} />;
                            case 'image':
                                return <ImageBubble key={index} message={message} mainID={account.id} logID={messageID} />;
                            default:
                                return null;
                        }
                    })}
                    <div className="h-0 -my-5" ref={messagesEndRef} />
                </div>
            </div>

            <div className="w-full h-[8%] px-4 flex gap-4 bg-color-blue items-center text-white">
                {checkBlockedByUser && !checkBlockedUser && <div className="text-center w-full">this user has blocked you</div>}
                {checkBlockedUser && !checkBlockedByUser && <div className="text-center w-full">you have blocked this user, unblock if you want to chat</div>}
                {checkBlockedUser && checkBlockedByUser && <div className="text-center w-full">you have blocked this user and this user has blocked you</div>}
                {!checkBlockedUser && !checkBlockedByUser && <>
                    <SmilePlus className="w-[25px] h-[25px] hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                    <DropUpMenu logID={messageID} mainID={account.id} icon={<Plus className="w-[25px] h-[25px] hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />} />
                    <textarea onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Type a message..." className="w-full h-[55%] -ml-2 bg-[#2a4b7e] rounded-full py-2 px-3 outline-none content-center caret-white overflow-y-auto resize-none hide-scrollbar" rows="1" />
                    <SendHorizonal onClick={sendMessage} className="w-[25px] h-[25px] hover:cursor-pointer transition-all duration-150 ease-in-out hover:brightness-75" />
                </>}
            </div>
        </div>
    );
}

ChatSegment.propTypes = {
    selectedChat: propTypes.number.isRequired,
    setSelectedChat: propTypes.func.isRequired,
    chatRef: propTypes.string.isRequired
}