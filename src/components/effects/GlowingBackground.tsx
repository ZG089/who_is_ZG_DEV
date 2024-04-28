import { type Component, For, type JSX, createEffect, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'

import { logger } from '~/utils'
import styles from './GlowingBackground.module.scss'

const GlowingBackground: Component<{
    children: JSX.Element | JSX.Element[]
    reanimateInterval?: number
    orbs?: number
    scrollStiffness?: number
}> = props => {
    const handleRef = (ref: HTMLDivElement) => {
        // Firefox with low opacity gradient sucks
        if ('mozInnerScreenX' in window && typeof window.mozInnerScreenX !== 'undefined') {
            logger.log('GlowingBackground', 'User is on Firefox (which has terrible rendering), disabling')
            return ref.remove()
        }

        // Handle scrolling parallax effect
        createEffect(() => {
            const parentHeight = ref.clientHeight
            const handleScroll = () =>
                requestAnimationFrame(() => {
                    logger.debug('GlowingBackground', 'Scroll position updated')
                    ref.style.top = `-${
                        (parentHeight / (props.scrollStiffness ?? 8.5)) *
                        (window.scrollY / (document.body.clientHeight - window.innerHeight))
                    }px`
                })

            window.addEventListener('scroll', handleScroll)
            onCleanup(() => window.removeEventListener('scroll', handleScroll))
        })

        // Handle initial animation
        createEffect(() => {
            const elements = [...ref.children] as [HTMLElement, ...HTMLElement[]]

            // Randomize initial positions
            animateGlow(elements)
            requestAnimationFrame(() => {
                // Randomize them again so it animates while it's still invisible
                requestAnimationFrame(() => animateGlow(elements))
                // Finally make it visible
                requestAnimationFrame(() => {
                    ref.style.removeProperty('opacity')
                    logger.log('GlowingBackground', 'Component initialized')
                })
            })

            const interval = setInterval(() => animateGlow(elements), props.reanimateInterval ?? 30000)
            onCleanup(() => clearInterval(interval))
        })
    }

    return (
        <>
            <Portal mount={document.querySelector('main') ?? document.body}>
                <div style="opacity: 0" aria-hidden="true" ref={handleRef} class={styles.Container}>
                    <For each={[...Array(props.orbs ?? 20).keys()]}>{() => <div class={styles.Orb} />}</For>
                </div>
            </Portal>
            {props.children}
        </>
    )
}

export default GlowingBackground

const animateGlow = (elements: HTMLElement[]) => {
    logger.debug('GlowingBackground', 'Animating glow')

    for (const elem of elements) {
        const xDisposition = Math.random() * 80
        const yDisposition = Math.random() * 50
        const factor = Math.random() > 0.5 ? -Math.random() : Math.random() + 0.5
        const scale = Math.max(0.75, Math.random() * 1.5)

        elem.setAttribute(
            'style',
            `top: ${yDisposition * factor}%; left: ${xDisposition * factor}%; transform: scale(${scale})`,
        )
    }
}
