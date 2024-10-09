import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PasswordInput, TextInput } from '../../elements/inputUtils';
import { signinWIthGoogle } from '../../auth/googleAuth';
import { NotificationContext } from '../../globalPops/useNotification';
import { db } from '../../../firebase-config';
import { storage } from '../../../firebase-config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { LoaderCircle, User, MailQuestion, } from 'lucide-react';
import { SignupValidate } from '../../utils/textValidations';

export default function SignupPage() {
    const [passLock, setPassLock] = useState(true);
    const [confirmPassLock, setConfirmPassLock] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [submit, setSubmit] = useState(false);
    const navigate = useNavigate();
    const { notify } = useContext(NotificationContext);

    useEffect(() => {
        const ProcessSignup = async () => {
            try {
                if (password !== confirmPassword) {
                    notify({ message: "Passwords do not match", type: "error" });
                    setSubmit(false);
                    return;
                }

                if (!SignupValidate({ username, password, email, notify })) {
                    setSubmit(false);
                    return;
                }

                const usersCollection = collection(db, 'users');
                const q = query(usersCollection, where('displayName', '==', username));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    notify({ message: "Username already exists, please choose another", type: "error" });
                    setSubmit(false);
                    return;
                }

                const profilePicRef = ref(storage, 'profileImages/profilePic.png');
                const url = await getDownloadURL(profilePicRef);
                
                await addDoc(usersCollection, {
                    chats: [],
                    displayName: username,
                    password: password,
                    email: email,
                    profilePic: url,
                    blocked: [],
                    bio: "Hello there, i am available let's chat!"
                });

                notify({ message: "Account created successfully, please wait...", type: "success" });
                setSubmit(false);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
            catch (error) {
                console.error(error);
                notify({ message: 'An error occurred, please try again', type: 'error' });
                setSubmit(false);
            }
        };

        if (submit) {
            ProcessSignup();
        }
    }, [submit]);

    return (
        <>
            <div className='w-full h-full fixed top-0 inset-0 z-0'>
                <img alt="background" src="/background.jpeg" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-full content-center flex justify-center gap-10 items-center">
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
                            <TextInput placeholder={"Email"} type="text" setValue={setEmail} loadedVal={email} icon={<MailQuestion className='absolute top-12 right-4 w-5 h-5 z-10' />} />
                            <PasswordInput placeholder={"Password"} passLock={passLock} setPassLock={setPassLock} setValue={setPassword} loadedVal={password} />
                            <PasswordInput placeholder={"Confirm password"} passLock={confirmPassLock} setPassLock={setConfirmPassLock} setValue={setConfirmPassword} loadedVal={confirmPassword} />

                        <button onClick={() => setSubmit(true)} disabled={submit} className="bg-[#3d71b1] text-white border border-transparent font-medium w-full py-3 mt-5 rounded-xl transition-all duration-300 ease-in-out hover:bg-white hover:text-color-blue hover:border-color-blue">
                            {submit ? <LoaderCircle className='size-6 animate-spin text-color-maroon mx-auto' /> : "Sign up"}
                        </button>

                        <div className="flex justify-center items-center gap-3 mt-5">
                            <hr className='w-[40%] border border-black border-opacity-40' />
                            <p className="text-color-blue font-bold mb-1">OR</p>
                            <hr className='w-[40%] border border-black border-opacity-40' />
                        </div>
                        <button onClick={signinWIthGoogle} className="hover:bg-[#3d71b1] text-white border hover:border-transparent hover:text-white font-medium w-[90%] mx-auto h-12 mt-5 flex gap-4 items-center rounded-xl transition-all duration-300 ease-in-out bg-white text-color-blue border-color-blue">
                            <img alt="google" src="/google.png" className="w-6 h-6 object-cover ml-28" />
                            Sign up with Google
                        </button>
                        <button className="hover:bg-[#3d71b1] text-white border hover:border-transparent hover:text-white font-medium w-[90%] mx-auto h-12 mt-5 flex gap-4 items-center rounded-xl transition-all duration-300 ease-in-out bg-white text-color-blue border-color-blue">
                            <img alt="facebook" src="/facebook.png" className="w-6 h-6 object-cover ml-28" />
                            Sign up with Facebook
                        </button>
                        <div className="flex justify-center items-center gap-2 mt-5">
                            <p className="text-md ">already have an account?</p>
                            <p onClick={() => navigate('/login')} className="text-md text-color-blue font-bold cursor-pointer hover:underline">Login</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}