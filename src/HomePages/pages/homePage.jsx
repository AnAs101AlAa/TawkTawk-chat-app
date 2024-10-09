
import ChatList from "../sections/chatList";
import ToolBar from "../sections/toolBar";
import ChatSegment from "../sections/chatSegment";
import { useState } from "react";
export default function HomePage() {
    const [loading, setLoading] = useState(0);
    const [selectedChat, setSelectedChat] = useState(-1);
    const [chatRef, setChatRef] = useState(null);
    return (
        <div className="w-screen h-screen flex">
            <div className="max-w-[30%] w-[30%] min-w-[300px] h-full bg-color-dark flex">
                <ToolBar loading={loading} setLoading={setLoading}/>
                <ChatList setSelectedChat={setSelectedChat} setChatRef={setChatRef}/>
            </div>
            <ChatSegment setSelectedChat={setSelectedChat} selectedChat={selectedChat} chatRef={chatRef}/>
        </div>
    )
}