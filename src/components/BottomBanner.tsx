import { createSignal, onMount, type JSX, For } from 'solid-js'
import { Row } from './Page'
import { Button } from './buttons'

import styles from './BottomBanner.module.scss'

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
                <Row centerHorizontal wrap gap="sm">
                    <For each={props.actions}>{action => action}</For>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            props.onClose?.()
                            ref!.style.bottom = `-${ref!.scrollHeight}px`
                            localStorage.setItem(`bottom_bar_closed:${props.id}`, 'true')
                            setTimeout(() => setShouldOpen(false), 1000)
                        }}
                    >
                        {props.closeLabel ?? 'Close'}
                    </Button>
                </Row>
            </Row>
        </div>
    )
}

export default BottomBanner

interface BottomBarProps {
    id: string
    children: JSX.Element | JSX.Element[]
    actions?: JSX.Element[]
    closeLabel?: string
    onClose?: () => void
}
