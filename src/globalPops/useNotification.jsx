import { createContext, useState } from 'react';
import { CircleCheckBig, CircleX } from 'lucide-react';
import propTypes from 'prop-types';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [fade, setFade] = useState("opacity-0");

    const notify = ({ message, type }) => {
        if(notification.message !== '') return;
        setNotification({ message, type });
        setFade("opacity-100");
        setTimeout(() => {
            setFade("opacity-0");
            setTimeout(() => {
                setNotification({ message: '', type: '' });
            }, 500);
        }, 1500);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            {notification.message !== "" ? (<div className={`z-50 transition-opacity duration-500 ease-in-out fixed bottom-6 w-1/2 h-[60px] left-[25%] content-center text-center text-[20px] rounded-xl ${fade} ${notification.type === "error" ? "bg-rose-700" : "bg-color-light"}`}>
                {notification.type === "success" ? (<CircleCheckBig className="inline-block w-6 h-6 mr-3 mb-1"/>
                ) : (<CircleX className="inline-block w-6 h-6 mr-3 mb-1"/>)}
                {notification.message}
            </div>) : null}
        </NotificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children: propTypes.node.isRequired
};