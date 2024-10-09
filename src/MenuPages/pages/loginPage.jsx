import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PasswordInput, TextInput } from '../../elements/inputUtils';
import { signinWIthGoogle } from '../../auth/googleAuth';
import { NotificationContext } from '../../globalPops/useNotification';
import { db } from '../../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LoaderCircle, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setAccount } from '../../Redux/Slices/accountSlice';
import uploadImageSession from '../../utils/uploadImageSession';

export default function LoginPage() {
    const [passLock, setPassLock] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submit, setSubmit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { notify } = useContext(NotificationContext);

    useEffect(() => {
        if (localStorage.getItem('username') && localStorage.getItem('password')) {
            setUsername(localStorage.getItem('username'));
            setPassword(localStorage.getItem('password'));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const ProcessLogin = async () => {
            try {
                if (username === '' || password === '') {
                    notify({ message: "Please fill all fields", type: "error" });
                    setSubmit(false);
                    return;
                }

                const usersCollection = collection(db, 'users');
                const q = query(usersCollection, where('displayName', '==', username), where('password', '==', password));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    notify({ message: "Invalid username or password, please check and try again", type: "error" });
                    setSubmit(false);
                } else {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();

                    uploadImageSession(userData.profilePic, userData.displayName + 'profilePic');

                    const item = {
                        displayName: userData.displayName,
                        password: userData.password,
                        email: userData.email,
                        phone: userData.phone,
                        chats: userData.chats.map(chat => chat.path),
                        profilePic: userData.profilePic,
                        bio: userData.bio,
                        id: userDoc.id,
                        blocked: userData.blocked
                    };

                    if (remember) {
                        localStorage.setItem('username', username);
                        localStorage.setItem('password', password);
                    }

                    dispatch(setAccount(item));
                    notify({ message: "Login successful", type: "success" });
                    setSubmit(false);
                    setTimeout(() => {
                        navigate('/home');
                    }, 1500);
                }
            } catch (error) {
                console.error("Error during login: ", error);
                notify({ message: "Error during login, please try again later", type: "error" });
                setSubmit(false);
            }
        };

        if (submit) {
            ProcessLogin();
        }
    }, [submit]);
    return (
        <>
            <div className='w-full h-full fixed top-0 inset-0 z-0'>
                <img alt="background" src="/background.jpeg" className="w-full h-full object-cover" />
            </div>
            {loading ? (<div className='content-center w-full h-full'>
                <LoaderCircle className='mx-auto text-color-maroon w-24 h-24 font-cold animate-spin' />
                <p className="text-color-maroon text-3xl text-center font-semibold mt-5 w-full">Loading...</p>
            </div>
            ) : (<div className="w-full h-full content-center flex justify-center gap-10 items-center">
                <div className='w-[55%] h-[80%] flex justify-center items-center z-20 select-none'>
                    <img alt="logo" src="/logoMini.png" className="w-[700px] h-[393px] object-cover" />
                </div>
                <div className='w-[45%] h-full flex-none content-center'>
                    <div className="px-5 py-8 relative select-none w-full max-w-[500px] h-fit rounded-xl thin-border bg-white items-center">
                        <div className='flex justify-center items-center h-[9%] mb-5'>
                            <img alt="logo" src="/logoMini.png" className="w-[70px] h-[39px] object-cover" />
                            <p className="text-2xl font-bold text-color-dark mb-2">TAWKTAWK</p>
                        </div>

                        <TextInput placeholder={"username"} type="text" setValue={setUsername} loadedVal={username} icon={<User className='absolute top-12 right-4 w-5 h-5 z-10' />} />
                        <PasswordInput placeholder={"password"} passLock={passLock} setPassLock={setPassLock} setValue={setPassword} loadedVal={password} />

                        <div className="flex justify-between mt-4 px-5 w-full mx-auto">
                            <div className='flex gap-2 items-center'>
                                <input onClick={(e) => setRemember(e.target.checked)} type='checkbox' className="hover:cursor-pointer w-4 h-4 mt-1" />
                                <label>Remember me</label>
                            </div>
                            <p className="text-md text-color-blue font-bold cursor-pointer hover:underline">Forgot password?</p>
                        </div>

                        <button onClick={() => setSubmit(true)} disabled={submit} className="bg-[#3d71b1] text-white border border-transparent font-medium w-full py-3 mt-7 rounded-xl transition-all duration-300 ease-in-out hover:bg-white hover:text-color-blue hover:border-color-blue">
                            {submit ? <LoaderCircle className='size-6 animate-spin text-color-maroon mx-auto' /> : "Login"}
                        </button>

                        <div className="flex justify-center items-center gap-3 mt-7">
                            <hr className='w-[40%] border border-black border-opacity-40' />
                            <p className="text-color-blue font-bold mb-1">OR</p>
                            <hr className='w-[40%] border border-black border-opacity-40' />
                        </div>
                        <button onClick={signinWIthGoogle} className="hover:bg-[#3d71b1] text-white border hover:border-transparent hover:text-white font-medium w-[90%] mx-auto h-12 mt-7 flex gap-4 items-center rounded-xl transition-all duration-300 ease-in-out bg-white text-color-blue border-color-blue">
                            <img alt="google" src="/google.png" className="w-6 h-6 object-cover ml-28" />
                            Log in with Google
                        </button>
                        <button className="hover:bg-[#3d71b1] text-white border hover:border-transparent hover:text-white font-medium w-[90%] mx-auto h-12 mt-7 flex gap-4 items-center rounded-xl transition-all duration-300 ease-in-out bg-white text-color-blue border-color-blue">
                            <img alt="facebook" src="/facebook.png" className="w-6 h-6 object-cover ml-28" />
                            Log in with Facebook
                        </button>
                        <div className="flex justify-center items-center gap-2 mt-7">
                            <p className="text-md ">Don{"'"}t have an account?</p>
                            <p onClick={() => navigate('/register')} className="text-md text-color-blue font-bold cursor-pointer hover:underline">Register</p>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    )
}