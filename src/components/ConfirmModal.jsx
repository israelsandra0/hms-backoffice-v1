import { useEffect, useState } from "react";
import AlertBox from "./ui/alert-box";

export default function ConfirmModal() {

    const [show, setShow] = useState(false)
    const [detail, setDetail] = useState({})
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        document.addEventListener('confirm-modal:show', (e) => {
            setDetail({...(e?.detail ?? {})})
            setTimeout(()=> setShow(true), 100) 
        })
    }, [])

    if (!show) {
        return null
    }

    return (
        
        <AlertBox
            title={detail?.title ?? 'Are you sure you want to continue?'}
            message={detail?.message ?? ''}
            confirmButtonText={detail?.confirmButtonText ?? 'Yes'}
            cancelButtonText={detail?.cancelButtonText ?? 'No'}
            confirmFn={ async () => {
                setIsProcessing(true)
                if (detail?.confirmFn && detail.confirmFn instanceof Function) {
                   const res = await detail.confirmFn()
                    if (detail?.completeFn && detail.completeFn instanceof Function) {
                        detail.completeFn(res)
                    }
                }
                setShow(false)  
                setIsProcessing(false)
            }}
            cancelFn={() => {setShow(false)}}
            buttonVariant={detail?.isDestructive ? 'error' : 'primary'}
            isProcessing={isProcessing}
        />
    );
}
