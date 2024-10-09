import { Lock, Unlock } from 'lucide-react';
import propTypes from 'prop-types';

function PasswordInput({ setPassLock, passLock, placeholder, setValue, loadedVal }) {
    return (
        <div className='relative w-[96%] mx-auto'>
            <p className="text-lg font-medium mb-2 ml-2">{placeholder}</p>
            <Unlock onClick={() => setPassLock(!passLock)} className={`absolute top-12 right-5 w-5 h-5 text-color-maroon transition-all duration-200 ease-linear hover:cursor-pointer ${!passLock ? "opacity-100 z-10" : "opacity-0 -z-10"}`} />
            <Lock onClick={() => setPassLock(!passLock)} className={`absolute top-12 right-5 w-5 h-5 text-color-maroon transition-all duration-200 ease-linear hover:cursor-pointer ${passLock ? "opacity-100 z-10" : "opacity-0 -z-10"}`} />
            <input value={loadedVal === "" ? "" : loadedVal} onChange={(e) => setValue(e.target.value)} type={passLock ? "password" : "text"} className={`z-20 w-full h-12 transition-all duration-200 ease-in-out border-transparent placeholder:text-black rounded-full p-2 mb-5 focus:border-[#3d71b1] outline-none border-[2px] ${loadedVal === "" ? "bg-gray-200 opacity-50" : "bg-white"}`} placeholder={placeholder}/>
        </div>
    )
}


function TextInput({ placeholder, type, setValue, loadedVal, icon }) {
    return (
        <div className='relative w-[96%] mx-auto'>
            <p className="text-lg font-medium mb-2 ml-2">{placeholder}</p>
            {icon}
            <input value={loadedVal === "" ? "" : loadedVal} onChange={(e) => setValue(e.target.value)} type={type} className={`w-full h-12 rounded-full p-2 mb-5 transition-all duration-200 ease-in-out border-transparent placeholder:text-black outline-none focus:border-[#3d71b1] border-2 ${loadedVal === "" ? "bg-gray-200 opacity-50" : "bg-white"}`} placeholder={placeholder} />
        </div>
    )
}


PasswordInput.propTypes = {
    setPassLock: propTypes.func.isRequired,
    passLock: propTypes.bool.isRequired,
    placeholder: propTypes.string.isRequired,
    setValue: propTypes.func.isRequired,
    loadedVal: propTypes.string.isRequired
}

TextInput.propTypes = {
    placeholder: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
    setValue: propTypes.func.isRequired,
    loadedVal: propTypes.string.isRequired,
    icon: propTypes.element
}


export { PasswordInput, TextInput };