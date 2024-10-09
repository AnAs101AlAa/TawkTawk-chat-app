import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function MainMenu() {
    const [render, setRender] = useState("opacity-0 translate-x-10");
    const [float, setFloat] = useState("");
    const [card1, setCard1] = useState("opacity-0 -translate-x-10");
    const [card2, setCard2] = useState("opacity-0 -translate-x-10");
    const [card3, setCard3] = useState("opacity-0 -translate-x-10");
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setCard3("opacity-100 translate-x-0");
            setTimeout(() => {
                setCard2("opacity-100 translate-x-0");
                setTimeout(() => {
                    setCard1("opacity-100 translate-x-0");
                    setTimeout(() => {
                        setRender("opacity-100 translate-x-0");
                        setTimeout(() => {
                            setFloat("animate-moveUpDown");
                        }, 200);
                    }, 200);
                }, 100);
            }, 100);
        }, 100);
    }, []);

    return (
        <div className="w-full h-full bg-white relative">
            <div className="w-full justify-between flex items-center h-[7%] py-3">
                <img alt="logo" src="/logoMini.png" className="w-[90px] h-[57px]" />
                <div className="flex justify-end gap-4 w-full px-8">
                    <button onClick={() => navigate("/register")} className="text-[15px] font-medium bg-white text-color-blue border-color-blue border rounded-full px-12 py-1 transition-all duration-150 ease-linear hover:bg-color-blue hover:text-white hover:px-8 hover:ml-4">Sign up for free</button>
                    <button onClick={() => navigate("/login")} className="text-[15px] font-medium bg-color-blue text-white border-color-blue border rounded-full px-12 py-1 transition-all duration-150 ease-linear hover:bg-white hover:text-color-blue hover:px-8 hover:mr-4">Login</button>
                </div>
            </div>
            <div className="w-full h-[91%] flex justify-between px-28 items-center select-none">
                <div className={`flex-none w-[55%] flex-col relative`}>
                    <div className="absolute flex justify-center inset-0 opacity-40 ml-32 mt-10 rotate-[150deg]">
                        <img alt="decoration" src="/paperPlane.png" className="w-[540px] h-[540px]" />
                    </div>
                    <p className={`TT-commons-pro text-[75px] text-color-dark font-bold text-center mb-14 ${card3} transition-all duration-200 ease-linear`}>The best digital messaging service on the web</p>
                    <p className={`TT-commons-pro text-[20px] w-[55%] mx-auto text-[#225d80] leading-tight font-bold my-12 ${card2} transition-all duration-200 ease-linear`}>A free, powerful and secured online texting platform that helps you easily reach and connect with new people, family, and friends around the globe</p>
                    <div className={`flex gap-10 justify-center w-[95%] ${card1} transition-all duration-200 ease-linear mb-10`}>
                        <button onClick={() => navigate("/register")} className="text-[15px] font-medium text-white bg-gradient-to-br from-sky-600 via-indigo-400 to-indigo-200 via-50% rounded-full w-[151px] py-3 duration-1000 ease-in-out transition-all hover:via-30%">Start now</button>
                        <button className="text-[15px] font-medium bg-color-blue text-white border-color-blue border rounded-full w-[151px] py-3 transition-colors duration-150 ease-linear hover:bg-white hover:text-color-blue">Learn more</button>
                    </div>
                </div>

                <img alt="logo" src="/logoMini.png" className={`w-[700px] h-[400px] ${render} translate-y-[20px] transition-all duration-200 ease-linear ${float}`} />
            </div>
        </div>
    )

}