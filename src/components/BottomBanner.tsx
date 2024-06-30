import { createEffect, createSignal, onMount, type JSX } from 'solid-js'
import { Row } from './Page'

import styles from './BottomBanner.module.scss'
import { Button } from './buttons'

const BottomBanner = (props: BottomBarProps) => {
    const [shouldOpen, setShouldOpen] = createSignal(false)
    let ref: HTMLDivElement | undefined

    onMount(() => {
        if (localStorage.getItem(`bottom_bar_closed_${props.id}`)) return
        ref!.style.bottom = `-${ref!.scrollHeight}px`
        
        setTimeout(() => {
            setShouldOpen(true)
            ref!.style.removeProperty('bottom')
        }, 250)
    })

    return (
        <div ref={ref} class={styles.Container} data-open={shouldOpen()} aria-hidden={shouldOpen()}>
            <Row wrap centerHorizontal centerVertical gap="sm" class={styles.Banner}>
                <div class={styles.Background} />
                {props.children}
                <Button
                    variant="secondary"
                    onClick={() => {
                        props.onClose?.()
                        ref!.style.bottom = `-${ref!.scrollHeight}px`
                        localStorage.setItem(`bottom_bar_closed_${props.id}`, 'true')
                        setTimeout(() => setShouldOpen(false), 1000)
                    }}
                >
                    {props.closeLabel ?? 'Close'}
                </Button>
            </Row>
        </div>
    )
}

export default BottomBanner

export interface BottomBarProps {
    id: string
    children: JSX.Element | JSX.Element[]
    closeLabel?: string
    onClose?: () => void
}
