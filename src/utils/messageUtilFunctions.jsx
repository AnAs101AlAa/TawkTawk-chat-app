import { CheckCheck, Clock } from 'lucide-react';

const formatTimestamp = (message, mainID) => {
    const timestamp = message.status === 'edited' ? message.editTime : message.creationTime;
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return (
        <>
            {message.status === 'edited' && <p className='lg:text-[14px] text-[10px]'>edited at</p>}
            <div className='flex gap-2'>
                <p>{date.toLocaleDateString('en-GB')}</p>
                <p>{date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            {message.status !== 'deleted' && message.owner === mainID && <>{message.status === 'sending' ? <Clock className='size-3'/>: <CheckCheck className='lg:size-5 size-3'/>}</>}
        </>
    );
};

export { formatTimestamp };