
export default async function uploadImageSession (url, name) {
    const profilePicQuery = await fetch(url);
    const blob = await profilePicQuery.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        const base64data = reader.result;
        sessionStorage.setItem(name, base64data);
    }
}