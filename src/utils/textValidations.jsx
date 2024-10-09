const UsernameValidate = (username, notify) => {
    const nameRegex = /^[a-zA-Z0-9_\s]+$/;

    if (username.length < 5 || username.length > 30) {
        notify({ message: "Username must be between 5 and 30 characters long", type: "error" });
        return false;
    }
    if (!nameRegex.test(username)) {
        notify({ message: "Username cannot contain special characters (except underscore)", type: "error" });
        return false;
    }
    return true;
};

const PasswordValidate = (password, notify) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password === "") {
        notify({ message: "Password is empty", type: "error" });
        return false;
    }
    if (password.length < 8) {
        notify({ message: "Password must be at least 8 characters long", type: "error" });
        return false;
    }
    if (!passRegex.test(password)) {
        notify({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character", type: "error" });
        return false;
    }
    if (password.includes(" ")) {
        notify({ message: "Password cannot contain spaces", type: "error" });
        return false;
    }
    return true;
};

const EmailValidate = (email, notify) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === "") {
        notify({ message: "Email is empty", type: "error" });
        return false;
    }
    if (!emailRegex.test(email)) {
        notify({ message: "Invalid email address", type: "error" });
        return false;
    }
    return true;
};

function SignupValidate({ username, password, email, notify }) {
    const isUsernameValid = UsernameValidate(username.trim(), notify);
    const isPasswordValid = PasswordValidate(password.trim(), notify);
    const isEmailValid = EmailValidate(email.trim(), notify);

    if (isUsernameValid && isPasswordValid && isEmailValid) {
        return true;
    } else {
        return false;
    }
}

export { UsernameValidate, PasswordValidate, EmailValidate, SignupValidate };