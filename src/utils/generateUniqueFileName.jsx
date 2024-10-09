const GenerateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${fileExtension}`;
};

export default GenerateUniqueFileName;