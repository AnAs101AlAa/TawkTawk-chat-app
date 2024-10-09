
import ChatItem from "../../elements/chatItem";
import SearchUser from "../popups/searchUser";
import { useSelector } from "react-redux";
import { useState } from "react";
import { MessageCirclePlus } from "lucide-react";
import propTypes from 'prop-types';

export default function ChatList({ setSelectedChat, setChatRef }) {
    const chats = useSelector(state => state.Account.chats);
    const [search, setSearch] = useState("");
    const [searchUser, setSearchUser] = useState(false);

    return (
        <>
            {searchUser && <SearchUser setSearchUser={setSearchUser} setSelectedChat={setSelectedChat} />}
            <div className="w-[89%] min-w-[250px] h-full flex flex-col py-5 select-none border-r border-r-[#C1E8FF] border-opacity-40 z-0">
                <div className="flex justify-between w-full items-center mb-3 px-4">
                    <p className="font-bold text-3xl text-white">Chats</p>
                    <div className="group relative select-none">
                        <MessageCirclePlus onClick={() => setSearchUser(true)} className={`size-8 text-white transition-all duration-150 ease-in-out group-hover:brightness-75`} />
                        <div className="bg-color-light py-1 px-3 rounded-full group-hover:scale-100 scale-0 absolute top-1/2 translate-y-2/3 -translate-x-[55%] transition-all duration-300 ease-in-out">
                            <span className="text-color-dark font-semibold whitespace-nowrap">New chat</span>
                        </div>
                    </div>
                </div>
                <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} className="w-[94%] mx-auto h-10 my-4 bg-color-blue rounded-xl px-3 text-white placeholder-[#C1E8FF] placeholder-opacity-70 outline-none" />
                <div className="w-full h-full flex flex-col gap-1 overflow-y-auto custom-scrollbar select-none">
                    {chats.length === 0 ? (
                        <div className="w-full h-16 text-center content-center text-white font-semibold">No conversations started yet</div>
                    ) : (
                        <>
                            {chats.map((chat, index) => <ChatItem key={index} chat={chat} search={search} index={index} onClick={(i, chat) => {setChatRef(chat), setSelectedChat(i)} }/>)}
                        </>
                    )}
                </div>
            </div>
        </>

    )
}

ChatList.propTypes = {
    setSelectedChat: propTypes.func.isRequired,
    setChatRef: propTypes.func.isRequired
}