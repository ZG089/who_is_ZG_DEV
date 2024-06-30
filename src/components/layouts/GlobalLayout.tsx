import { type Component, type JSX, Suspense, useContext, Show, onMount, onCleanup, createSignal } from 'solid-js'
import JSConfetti from 'js-confetti'
import { format } from 'timeago.js'

import { NavDock, BottomBanner, Row, Button } from '~/components'
import { Birthday, BirthdayEnd } from '~/constants/personal'
import { ThemeContext } from '~/contexts'

import IconBlog from '~/assets/icons/nav/blog.svg'
import IconHome from '~/assets/icons/nav/home.svg'
import IconSource from '~/assets/icons/source.svg'

import sharedStyles from '~/styles/shared.module.scss'

const GlobalLayout: Component<{ children: JSX.Element }> = props => {
    const [time, setTime] = createSignal<string | null>('...')
    const theme = useContext(ThemeContext)

    let canvasRef: HTMLCanvasElement | undefined
    let confetti: JSConfetti | undefined

    const launchConfetti = () => {
        confetti?.addConfetti({
            confettiRadius: 4,
            confettiNumber: 250,
            confettiColors: theme.colorScheme === 'light' ? ['#29a873', '#007cfa'] : ['#4feaa9', '#57b7d9'],
        })
    }

    onMount(() => {
        confetti = new JSConfetti({ canvas: document.getElementById('confetti-canvas') as HTMLCanvasElement })

        const fn = () => {
            if (Date.now() >= Birthday.getTime()) {
                launchConfetti()
                setTime(null)
                clearInterval(interval)
                return
            }

            setTime(format(Birthday, 'countdown'))
        }

        fn()
        const interval = setInterval(() => fn, 1000)

        onCleanup(() => clearInterval(interval))
    })

    return (
        <>
            <canvas
                id="confetti-canvas"
                ref={canvasRef}
                style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: var(--layer-overlay);"
            />
            <NavDock
                pages={[
                    { name: 'Home', href: '/', icon: IconHome },
                    { name: 'Blog', href: '/blog', icon: IconBlog, matchSubroutes: true },
                ]}
                links={[
                    {
                        name: 'Source code',
                        icon: IconSource,
                        href: 'https://github.com/PalmDevs/website',
                    },
                ]}
            />
            <Suspense>{props.children}</Suspense>
            <Show when={Date.now() < BirthdayEnd.getTime()}>
                <BottomBanner id="2024-bd" closeLabel="Close" onClose={launchConfetti}>
                    <Row gap="sm" flex wrap centerVertical style="justify-content: space-between">
                        <p style="margin: 0">
                            <Show
                                when={time()}
                                fallback={
                                    <>
                                        Today's my <span class={sharedStyles.GradientText}>birthday!</span> 🎂
                                    </>
                                }
                            >
                                It's <span class={sharedStyles.GradientText}>{time()}</span> before my birthday! 🎂
                            </Show>
                        </p>
                        <Button onClick={launchConfetti}>Launch confetti 🎉</Button>
                    </Row>
                </BottomBanner>
            </Show>
        </>
    )
}

export default GlobalLayout
