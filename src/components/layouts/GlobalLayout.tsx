import { type Component, type JSX, Suspense, createSignal, onMount, onCleanup, Show, useContext } from 'solid-js'
import NavDock from '~/components/NavDock'
import BottomBanner from '~/components/BottomBanner'

import JSConfetti from 'js-confetti'
import { format, register } from 'timeago.js'

import IconBlog from '~/assets/icons/nav/blog.svg'
import IconHome from '~/assets/icons/nav/home.svg'
import IconSource from '~/assets/icons/source.svg'

import sharedStyles from '~/styles/shared.module.scss'
import { ThemeContext } from '~/contexts'

const year = new Date().getUTCFullYear()
const birthday = new Date(`${year}-07-01 00:00:00 UTC+7`)
const birthdayEnd = new Date(`${year}-07-02 00:00:00 UTC+7`)

register(
    'countdown',
    (_: number, index: number, __?: number): [string, string] =>
        (
            [
                ['a few seconds', 'a few seconds'],
                ['%s seconds', '%s seconds'],
                ['1 minute', '1 minute'],
                ['%s minutes', '%s minutes'],
                ['1 hour', '1 hour'],
                ['%s hours', '%s hours'],
            ] as [string, string][]
        )[index],
)

const GlobalLayout: Component<{ children: JSX.Element }> = props => {
    const theme = useContext(ThemeContext)
    const [time, setTime] = createSignal<string | null>('...')

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
        confetti = new JSConfetti({ canvas: canvasRef })

        const interval = setInterval(() => {
            if (Date.now() >= birthday.getTime()) {
                launchConfetti()
                setTime(null)
                clearInterval(interval)
                return
            }

            setTime(format(birthday, 'countdown'))
        }, 1000)

        onCleanup(() => clearInterval(interval))
    })

    return (
        <>
            <canvas
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
            <Show when={Date.now() < birthdayEnd.getTime()}>
                <BottomBanner id="2024-bd" closeLabel="Happy birthday!" onClose={launchConfetti}>
                    <div>
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
                    </div>
                </BottomBanner>
            </Show>
        </>
    )
}

export default GlobalLayout
