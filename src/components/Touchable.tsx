import { onMount, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { combineClassNames, undefinedIf } from '~/utils'

import type { Component, ComponentProps, JSX } from 'solid-js'

import styles from './Touchable.module.scss'

const Touchable = <E extends ElementType>(
    props: TouchableProps<E> & Omit<ComponentProps<E>, keyof TouchableProps<E>>,
) => {
    const [local, others] = splitProps(props, ['as', 'class', 'asProps', 'withoutHoverInteractionEffect'])

    return (
        <Dynamic
            class={combineClassNames(
                styles.Container,
                undefinedIf(!local.withoutHoverInteractionEffect, styles.WithoutHoverInteractionEffect),
                props.class,
            )}
            ref={undefinedIf(local.withoutHoverInteractionEffect, handleDynamicRef)}
            component={local.as ?? 'div'}
            {...others}
            {...local.asProps}
        />
    )
}

const handleDynamicRef = (ref: HTMLElement) => {
    onMount(() => {
        ref.addEventListener('mousemove', e => {
            const rect = ref.getBoundingClientRect()
            ref.style.setProperty('--comp-mx', String(e.clientX - rect.left))
            ref.style.setProperty('--comp-my', String(e.clientY - rect.top))
        })
    })
}

export default Touchable

// biome-ignore lint/suspicious/noExplicitAny: Typings
type ElementType = 'div' | 'button' | 'a' | Component<any>
export type TouchableProps<E extends ElementType> = {
    as?: E
    children: JSX.Element | JSX.Element[]
    withoutHoverInteractionEffect?: boolean
    class?: string
    asProps?: ComponentProps<E>
}
