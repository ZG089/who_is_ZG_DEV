import { A, useIsRouting } from '@solidjs/router'
import { For, Show, createEffect, createMemo, onCleanup, onMount, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { Column, Row } from './Page'
import Touchable from './Touchable'

import ThemeSyncing from '~/assets/icons/nav/theme_syncing.svg'

import { ThemeCycleMap, ThemeIconMap, ThemeSwitchHintMap } from '~/constants/theme'
import { ThemeContext } from '~/contexts'

import type { Component } from 'solid-js'
import type { FlexHelperProps, IconType } from '.'

import styles from './NavDock.module.scss'

const NavDock: Component<NavDockProps> = props => {
    const isRouting = useIsRouting()

    const handleRef = (ref: HTMLElement) => {
        // Scroll transition
        onMount(() => {
            const listener = () => ref.setAttribute('data-scrolled', String(window.scrollY > 0))
            listener()
            document.addEventListener('scroll', listener)
            onCleanup(() => document.removeEventListener('scroll', listener))
        })

        const rehighlight = () => {
            const highlight = ref.querySelector('#nav-highlight') as HTMLElement
            const active = ref.querySelector(`.${styles.ActiveLink}`) as HTMLAnchorElement

            if (active) {
                const parentRect = ref.getBoundingClientRect()
                const rect = active.getBoundingClientRect()

                if (!active.clientWidth || !active.clientHeight) return

                highlight.style.width = `${active.clientWidth}px`
                highlight.style.height = `${active.clientHeight}px`
                highlight.style.left = `${rect.x - parentRect.x}px`
                highlight.style.top = `${rect.y - parentRect.y}px`
            } else console.warn('No active page')
        }

        document.fonts.ready.then(rehighlight)

        // Subscribe to route changes, rehighlight only after routing has finished
        createEffect(() => !isRouting() && rehighlight())
    }

    return (
        <div class={styles.DockContainer}>
            <Row ref={handleRef} as="div" class={styles.Dock}>
                <div id="nav-highlight" class={styles.Highlight} aria-hidden="true" />
                <nav>
                    <div id="nav-highlight" class={styles.Highlight} aria-hidden="true" />
                    <Row as="ul" gap="xs" aria-label="Navigation links">
                        <For each={props.pages}>
                            {page => (
                                <li>
                                    <Touchable
                                        as={Row}
                                        class={styles.Link}
                                        asProps={
                                            {
                                                gap: 'xs',
                                                as: A,
                                                href: page.href,
                                                inactiveClass: '',
                                                activeClass: styles.ActiveLink,
                                                end: true,
                                                onClick: e =>
                                                    (e.currentTarget as HTMLAnchorElement).classList.contains(
                                                        styles.ActiveLink,
                                                    ) && window.scrollTo({ top: 0 }),
                                            } as FlexHelperProps<typeof A>
                                        }
                                        withoutHoverInteractionEffect
                                        centerVertical
                                    >
                                        <page.icon aria-hidden="true" class={styles.Icon} />
                                        <Show when={page.name}>
                                            <span>{page.name}</span>
                                        </Show>
                                    </Touchable>
                                </li>
                            )}
                        </For>
                    </Row>
                </nav>
                <Show when={props.links?.length}>
                    <div>
                        <Row as="ul" gap="xs" aria-label="Other links and site settings">
                            <li>
                                <ThemeSwitchNavButton />
                            </li>
                            <For each={props.links}>
                                {link => (
                                    <li>
                                        <Touchable
                                            as={Row}
                                            class={`${styles.Link} ${styles.IconLink}`}
                                            asProps={{ as: 'a', href: link.href, target: '_blank', rel: 'noreferrer', title: link.name }}
                                            centerVertical
                                            aria-label={link.name}
                                            withoutHoverInteractionEffect
                                        >
                                            <link.icon aria-hidden="true" class={styles.Icon} />
                                        </Touchable>
                                    </li>
                                )}
                            </For>
                        </Row>
                    </div>
                </Show>
            </Row>
        </div>
    )
}

const ThemeSwitchNavButton: Component = () => {
    const themeContext = useContext(ThemeContext)
    const theme = createMemo(() => themeContext.theme())
    const label = createMemo(() => ThemeSwitchHintMap[ThemeCycleMap[theme()]])

    return (
        <Touchable
            as={Column}
            class={`${styles.Link} ${styles.IconLink}`}
            asProps={
                {
                    as: 'button',
                    onClick: themeContext.cycle,
                    title: label(),
                    'aria-label': label(),
                } as FlexHelperProps<'button'>
            }
            withoutHoverInteractionEffect
            centerVertical
        >
            <Dynamic
                component={themeContext.initialized() ? ThemeIconMap[theme()] : ThemeSyncing}
                aria-hidden="true"
                class={styles.Icon}
            />
        </Touchable>
    )
}

export default NavDock

interface NavDockProps {
    pages: [LinkConfig, ...LinkConfig[]]
    links?: [LinkConfig, ...LinkConfig[]]
}

interface LinkConfig {
    icon: IconType
    href: string
    name: string
}
