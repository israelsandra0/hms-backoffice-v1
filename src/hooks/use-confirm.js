export function useConfirm() {
    const confirmAction = ({
        title,
        message,
        cancelButtonText,
        confirmButtonText,
        isDestructive,
        confirmFn,
        cancelFn,
        completeFn
    }) => {
        document.dispatchEvent(
            new CustomEvent("confirm-modal:show", {
                detail: {
                    title,
                    message,
                    cancelButtonText,
                    confirmButtonText,
                    isDestructive,
                    confirmFn,
                    cancelFn,
                    completeFn
                },
            })
        );
    }

    return {confirmAction}
}
