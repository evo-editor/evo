import { toasts }  from "svelte-toasts"
import { writable } from "svelte/store"
import type { SvelteComponent } from "svelte"
import type { ToastType } from "svelte-toasts/types/common"



export const renderedModal = writable<(new () => SvelteComponent) | null>(null)
export const showDialog = writable<boolean>(false)
export let dialogProps = {}



export const triggerModal = (component: new () => SvelteComponent): void => {
    renderedModal.set(component)
}

export const triggerDialog = (statement: string, continueButton: string, onClickButton: () => {}, secondButton?: string, secondButtonClick?: () => {}): void => {
    showDialog.set(true)
    dialogProps = {
        statement,
        continueButton,
        onClickButton,
        secondButton: null,
    }

    if (secondButton) {
        dialogProps.secondButton = secondButton
        dialogProps.secondButtonClick = secondButtonClick
    }
}





export const showToast = (message: string, type: ToastType) => {
    toasts.add({
        description: message,
        showProgress: true,
        duration: 3000,
        placement: 'bottom-right',
        theme: 'light',
        type,
        onClick: () => {},
        onRemove: () => {},
    })
};



export const closeModal = (): void => {
    renderedModal.set(null)
}

export const closeDialog = (): void => {
    showDialog.set(false)
}