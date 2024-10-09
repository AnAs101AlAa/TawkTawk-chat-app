import { auth, googleProvider } from '../../firebase-config';
import { signInWithPopup } from 'firebase/auth';

const signinWIthGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider)
        console.log(auth.currentUser.email);
    }
    catch (error) {
        console.log(error);
    }
}

export { signinWIthGoogle };