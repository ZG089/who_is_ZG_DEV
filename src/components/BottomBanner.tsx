import { Show, createEffect, createSignal, onMount, type JSX } from 'solid-js'
import { Column, Row } from './Page'

import styles from './BottomBanner.module.scss'
import { Button } from './buttons'

const BottomBanner = (props: BottomBarProps) => {
    const [open, setOpen] = createSignal(false)
    let ref: HTMLDivElement | undefined

    createEffect(() => !localStorage.getItem(`bottom_bar_closed_${props.id}`) && setOpen(true))

    return (
        <Show when={open()}>
            <div ref={ref} class={styles.Container}>
                <Row centerHorizontal centerVertical class={styles.Banner}>
                    <div class={styles.Background} />
                    <Column centerHorizontal>{props.children}</Column>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            props.onClose?.()
                            ref!.style.bottom = `-${ref!.scrollHeight + 1}px`
                            localStorage.setItem(`bottom_bar_closed_${props.id}`, 'true')
                            setTimeout(() => setOpen(false), 1000)
                        }}
                    >
                        {props.closeLabel ?? 'Close'}
                    </Button>
                </Row>
            </div>
        </Show>
    )
}

export default BottomBanner

export interface BottomBarProps {
    id: string
    children: JSX.Element | JSX.Element[]
    closeLabel?: string
    onClose?: () => void
}
